# Imports
import flask
from flask import request, abort, render_template, url_for
from flask_compress import Compress
from werkzeug.middleware.proxy_fix import ProxyFix

# Config & Setup
app = flask.Flask(__name__)
#   app.secret_key = os.environ.get('SECRET_KEY', 'fallback-secret-key')
Compress(app)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    CACHE_TYPE='SimpleCache',
    CACHE_DEFAULT_TIMEOUT=60
)

error_page = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error {{ error_code }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f0f0f0;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 100px auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #ff6f61;
            font-size: 48px;
        }
        .error-message {
            font-size: 18px;
            color: #555;
        }
        .error-details {
            font-size: 14px;
            color: #888;
            margin-top: 20px;
        }
        a {
            text-decoration: none;
            color: #1e90ff;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Error {{ error_code }}</h1>
        <p class="error-message">{{ error_message }}</p>
        <p class="error-details">
            Please try again later or <a href="{{ url_for('main') }}">go back to the homepage</a>.
        </p>
    </div>
</body>
</html>
"""

# Serve Block
@app.before_request
def block_sensitive_files():
    forbidden_extensions = ('.git', '.env', '.bak', '.swp')
    forbidden_prefixes = ('.',)
    path = request.path.lower()
    if any(path.endswith(ext) for ext in forbidden_extensions) or any(path.lstrip('/').startswith(p) for p in forbidden_prefixes):
        abort(403)

@app.after_request
def set_headers(response):
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; "
        "style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; "
        "font-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; "
        "object-src 'none'; "
        "base-uri 'none'; "
        "form-action 'none'; "
        "upgrade-insecure-requests"
    )
    return response

@app.route('/', methods=['GET'])
def main():
    return render_template('index.html')

@app.errorhandler(Exception)
def handle_error(error):
    error_code = getattr(error, 'code', 500)
    error_message = str(error).split(': ')[-1].strip()
    return render_template(error_page, error_code=error_code, error_message=error_message), error_code

# App Start
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=3000, threaded=True)