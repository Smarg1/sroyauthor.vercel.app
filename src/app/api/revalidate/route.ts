'use server';

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase";

export async function GET(_req: Request) {
  try {
    const keysToClear = ["author:bio", "author:pfp", "table:blogs", "table:works"];
    await Promise.all(keysToClear.map((key) => redis.del(key)));

    const [authorRes, blogsRes, worksRes] = await Promise.all([
      supabase.from("author").select("description, pfp").eq("id", 1).single(),
      supabase.from("blogs").select("*"),
      supabase.from("works").select("*"),
    ]);

    const bio = authorRes.data?.description ?? "null";
    const pfp = authorRes.data?.pfp ?? null;
    const blogs = blogsRes.data ?? [];
    const works = worksRes.data ?? [];

    const pipeline = redis.pipeline();
    pipeline.set("author:bio", bio, { ex: 21600 });
    if (pfp) pipeline.set("author:pfp", pfp, { ex: 21600 });
    pipeline.set("table:blogs", blogs, { ex: 600 });
    pipeline.set("table:works", works, { ex: 600 });
    await pipeline.exec();

    return NextResponse.json({
      success: true,
      message: "Cache revalidated successfully.",
      refreshed: {
        bio: !!bio,
        pfp: !!pfp,
        blogs: blogs.length,
        works: works.length,
      },
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
