from fastapi import FastAPI, UploadFile, Form, HTTPException, Response, Request, Cookie
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import jwt, os, time, redis.asyncio as redis
from contextlib import asynccontextmanager
import json, asyncio
from slowapi import Limiter
from slowapi.util import get_remote_address
from vercel_blob import put
from supabase import create_client

load_dotenv(".env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

JWT_SECRET = os.getenv("JWT_SECRET", "")
JWT_ALGO = "HS512"
BLOB_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN", "")

REDIS_URL = os.getenv("redis_REDIS_URL", "")
redis_client = redis.from_url(REDIS_URL)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["127.0.0.1", "localhost", "https://sroyauthor.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

REFRESH_TOKEN_EXPIRE = 7 * 24 * 3600


def create_access_token(payload: dict, exp: int = 900):
    payload.update({"exp": int(time.time()) + exp})
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def verify_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def is_token_revoked(jti: str):
    return await redis_client.exists(f"revoked:{jti}") == 1


async def revoke_token(jti: str, exp: int):
    ttl = exp - int(time.time())
    if ttl > 0:
        await redis_client.setex(f"revoked:{jti}", ttl, "1")


async def upload_blob(file: UploadFile):
    try:
        fileb = await file.read()
        res = put(path=file.filename, data=fileb, options={"addRandomSuffix": True})
        return {"filename": file.filename, "pathname": res.get("pathname"), "url": res.get("url")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {e}")


async def refresh_cache():
    while True:
        try:
            bio = supabase.table("author").select("description").eq("id", 1).execute().data
            pfp = supabase.table("author").select("pfp").eq("id", 1).execute().data
            blogs = supabase.table("blogs").select("*").execute().data
            works = supabase.table("works").select("*").execute().data
            await redis_client.set("bio", json.dumps(bio))
            await redis_client.set("pfp", json.dumps(pfp))
            await redis_client.set("blogs", json.dumps(blogs))
            await redis_client.set("works", json.dumps(works))
        except Exception:
            pass
        await asyncio.sleep(3600)


@asynccontextmanager
async def lifespan(*args, **kwargs):
    asyncio.create_task(refresh_cache())
    yield


app = FastAPI(lifespan=lifespan)

# ----------------- ROUTES ----------------- #

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"detail": "Logged out"}

@app.post("/api/login")
async def login(username: str = Form(...), password: str = Form(...), response: Response = None):
    user = supabase.table("users").select("*").eq("username", username).execute().data
    if not user or user[0]["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    jti_access = os.urandom(16).hex()
    jti_refresh = os.urandom(16).hex()
    access_token = create_access_token({"sub": str(user[0]["id"]), "jti": jti_access}, exp=900)
    refresh_token = create_access_token({"sub": str(user[0]["id"]), "jti": jti_refresh}, exp=REFRESH_TOKEN_EXPIRE)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="Strict", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="Strict", max_age=REFRESH_TOKEN_EXPIRE, path="/")
    return {"status": "success"}


@app.post("/api/refresh")
async def refresh_token_endpoint(refresh_token: str = Cookie(None), response: Response = None):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")
    payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=[JWT_ALGO])
    jti = payload.get("jti")
    if await is_token_revoked(jti):
        raise HTTPException(status_code=401, detail="Token revoked")
    new_access_token = create_access_token({"sub": payload["sub"], "jti": os.urandom(16).hex()}, exp=900)
    response.set_cookie(key="access_token", value=new_access_token, httponly=True, secure=True, samesite="Strict", max_age=900, path="/")
    return {"access_token": new_access_token}


@app.post("/api/logout")
async def logout(request: Request, response: Response):
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    for token in [access_token, refresh_token]:
        if token:
            try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
                await revoke_token(payload["jti"], payload["exp"])
            except Exception:
                pass
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"status": "logged out"}


@app.get("/api/pfp")
async def pfp_get():
    cached = await redis_client.get("pfp")
    if cached:
        return JSONResponse(json.loads(cached)[0]["pfp"])
    res = supabase.table("author").select("pfp").eq("id", 1).execute().data
    await redis_client.set("pfp", json.dumps(res))
    return JSONResponse(res[0]["pfp"])


@app.get("/api/bio")
async def bio_get():
    cached = await redis_client.get("bio")
    if cached:
        return JSONResponse(json.loads(cached)[0]["description"])
    res = supabase.table("author").select("description").eq("id", 1).execute().data
    await redis_client.set("bio", json.dumps(res))
    return JSONResponse(res[0]["description"])


@app.get("/api/blog")
async def blog_get():
    cached = await redis_client.get("blogs")
    if cached:
        return JSONResponse(json.loads(cached))
    res = supabase.table("blogs").select("*").execute().data
    await redis_client.set("blogs", json.dumps(res))
    return JSONResponse(res)


@app.get("/api/work")
async def work_get():
    cached = await redis_client.get("works")
    if cached:
        return JSONResponse(json.loads(cached))
    res = supabase.table("works").select("*").execute().data
    await redis_client.set("works", json.dumps(res))
    return JSONResponse(res)


@app.post("/api/bio-u")
@limiter.limit("10/minute")
async def bio_post(file: str = Form(...), request: Request = None):
    token = request.cookies.get("access_token")
    verify_token(token)
    res = supabase.table("author").update({"description": file}).eq("id", 1).execute().data
    await redis_client.set("bio", json.dumps(res))
    return JSONResponse(res)


@app.post("/api/pfp-u")
@limiter.limit("10/minute")
async def pfp_post(file: UploadFile, request: Request = None):
    token = request.cookies.get("access_token")
    verify_token(token)
    res = await upload_blob(file)
    supabase.table("author").update({"pfp": res["url"]}).eq("id", 1).execute()
    new_data = supabase.table("author").select("pfp").eq("id", 1).execute().data
    await redis_client.set("pfp", json.dumps(new_data))
    return JSONResponse(res)


@app.post("/api/blog-u")
@limiter.limit("10/minute")
async def blog_post(name: str = Form(...), desc: str = Form(...), files: list[UploadFile] = [], request: Request = None):
    token = request.cookies.get("access_token")
    verify_token(token)
    img_urls = []
    for f in files:
        res = await upload_blob(f)
        img_urls.append(res["url"])
    supabase.table("blogs").insert({"name": name, "description": desc, "image": json.dumps(img_urls)}).execute()
    new_data = supabase.table("blogs").select("*").execute().data
    await redis_client.set("blogs", json.dumps(new_data))
    return JSONResponse({"status": "success", "uploaded": img_urls})


@app.post("/api/work-u")
@limiter.limit("10/minute")
async def work_post(name: str = Form(...), desc: str = Form(...), file: UploadFile = None, request: Request = None):
    token = request.cookies.get("access_token")
    verify_token(token)
    res = await upload_blob(file)
    supabase.table("works").insert({"name": name, "description": desc, "image": str(res["url"])}).execute()
    new_data = supabase.table("works").select("*").execute().data
    await redis_client.set("works", json.dumps(new_data))
    return JSONResponse({"status": "success", "uploaded": res["url"]})
