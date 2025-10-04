import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/utils/fetch";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type PostOrWork = {
  id: number;
  name: string;
  description: string;
  image?: string[] | string;
  updatedAt?: string;
  slug?: string;
};

async function Get<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`Supabase error fetching from ${table}:`, error);
    return [];
  }
  return (data as T[]) || [];
}

function calculatePriority(path: string) {
  const depth = path.split("/").filter(Boolean).length;
  return Math.max(0.1, +(1 - depth * 0.1).toFixed(1));
}

export async function GET(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("host") || "localhost:3000";
  const BASE_URL = `${protocol}://${host}`;

  const [posts, works] = await Promise.all([
    Get<PostOrWork>("blogs"),
    Get<PostOrWork>("works")
  ]);

  const mapItems = (items: PostOrWork[], prefix: string) =>
    items.map(item => ({
      ...item,
      slug: slugify(item.name),
      updatedAt: item.updatedAt || new Date().toISOString(),
      prefix
    }));

  const allPosts = mapItems(posts, "blogs");
  const allWorks = mapItems(works, "works");

  const staticPages = ["", "about", "blogs", "works"];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach(page => {
    const path = `/${page}`;
    sitemap += `<url>
      <loc>${BASE_URL}${path}</loc>
      <priority>${calculatePriority(path)}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>\n`;
  });

  [...allPosts, ...allWorks].forEach(item => {
    const path = `/${item.prefix}/${item.slug}`;
    sitemap += `<url>
      <loc>${BASE_URL}${path}</loc>
      <priority>${calculatePriority(path)}</priority>
      <lastmod>${new Date(item.updatedAt!).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>\n`;
  });

  sitemap += `</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" }
  });
}
