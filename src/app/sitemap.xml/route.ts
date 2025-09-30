import { NextResponse } from "next/server";
import { slugify } from "@/hooks/slugify";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

type PostOrWork = {
  id: number;
  name: string;
  description: string;
  image: string[] | string;
  updatedAt?: string;
  slug?: string;
};

// --- Safe image parser ---
function parseImages(input: string | string[]): string[] {
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [input];
  }
}

// --- Fetch blogs ---
async function fetchPosts(): Promise<PostOrWork[]> {
  const res = await fetch(`${BASE_URL}/api/blog`, { cache: "no-store" });
  if (!res.ok) return [];
  const posts: PostOrWork[] = await res.json();
  return posts.map(post => ({
    ...post,
    image: parseImages(post.image),
    slug: slugify(post.name),
    updatedAt: post.updatedAt || new Date().toISOString(),
  }));
}

// --- Fetch works ---
async function fetchWorks(): Promise<PostOrWork[]> {
  const res = await fetch(`${BASE_URL}/api/work`, { cache: "no-store" });
  if (!res.ok) return [];
  const works: PostOrWork[] = await res.json();
  return works.map(work => ({
    ...work,
    image: parseImages(work.image),
    slug: slugify(work.name),
    updatedAt: work.updatedAt || new Date().toISOString(),
  }));
}

// --- Calculate priority ---
function calculatePriority(path: string) {
  const depth = path.split("/").filter(Boolean).length;
  const priority = 1 - depth * 0.1;
  return priority < 0.1 ? 0.1 : +priority.toFixed(1);
}

// --- GET handler ---
export async function GET() {
  const staticPages = ["", "about", "blogs", "works"];

  const posts = await fetchPosts();
  const works = await fetchWorks();

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // --- Static pages ---
  staticPages.forEach(page => {
    const path = `/${page}`;
    sitemap += `<url>
      <loc>${BASE_URL}${path}</loc>
      <priority>${calculatePriority(path)}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>\n`;
  });

  // --- Blog posts ---
  posts.forEach(post => {
    sitemap += `<url>
      <loc>${BASE_URL}/blogs/${post.slug}</loc>
      <priority>${calculatePriority(`/blogs/${post.slug}`)}</priority>
      <lastmod>${new Date(post.updatedAt!).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>\n`;
  });

  // --- Works ---
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
