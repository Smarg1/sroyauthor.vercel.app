import { NextRequest, NextResponse } from "next/server";
import { Get, slugify } from "@/utils/fetch";

type PostOrWork = {
  id: number;
  name: string;
  description: string;
  image?: string[] | string;
  updatedAt?: string;
  slug?: string;
};

function calculatePriority(path: string) {
  const depth = path.split("/").filter(Boolean).length;
  const priority = 1 - depth * 0.1;
  return priority < 0.1 ? 0.1 : +priority.toFixed(1);
}

export async function GET(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("host");
  const BASE_URL = host ? `${protocol}://${host}` : "http://localhost:3000";

  const posts: PostOrWork[] = (await Get<PostOrWork>("blogs")).map(post => ({
    ...post,
    slug: slugify(post.name),
    updatedAt: post.updatedAt || new Date().toISOString(),
  }));

  const works: PostOrWork[] = (await Get<PostOrWork>("works")).map(work => ({
    ...work,
    slug: slugify(work.name),
    updatedAt: work.updatedAt || new Date().toISOString(),
  }));

  const staticPages = ["", "about", "blogs", "works"];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach(page => {
    const path = `/${page}`;
    sitemap += `<url>
      <loc>${BASE_URL}${path}</loc>
      <priority>${calculatePriority(path)}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>\n`;
  });

  posts.forEach(post => {
    sitemap += `<url>
      <loc>${BASE_URL}/blogs/${post.slug}</loc>
      <priority>${calculatePriority(`/blogs/${post.slug}`)}</priority>
      <lastmod>${new Date(post.updatedAt!).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>\n`;
  });

  works.forEach(work => {
    sitemap += `<url>
      <loc>${BASE_URL}/works/${work.slug}</loc>
      <priority>${calculatePriority(`/works/${work.slug}`)}</priority>
      <lastmod>${new Date(work.updatedAt!).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>\n`;
  });

  sitemap += `</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
