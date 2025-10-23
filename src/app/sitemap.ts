import type { MetadataRoute } from "next";
import { slugify } from "@/utils/Slugify";
import { getBlogs, getWorks } from "@/utils/fetchData";
import type { Blog, Work } from "@/utils/fetchData";

const BASE_URL = "https://sroyauthor.vercel.app";

function calculatePriority(path: string) {
  const depth = path.split("/").filter(Boolean).length;
  const priority = 1 - depth * 0.1;
  return priority < 0.1 ? 0.1 : +priority.toFixed(1);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nowISO = new Date().toISOString();

  const [blogsData, worksData] = await Promise.all([getBlogs(), getWorks()]);

  const staticPages: MetadataRoute.Sitemap = ["", "about", "blogs", "works"].map(
    (page) => ({
      url: `${BASE_URL}/${page}`,
      lastModified: nowISO,
      priority: calculatePriority(`/${page}`),
      changefreq: "weekly",
    })
  );

  const blogs: MetadataRoute.Sitemap = blogsData.map((blog: Blog) => ({
    url: `${BASE_URL}/blogs/${slugify(blog.name)}`,
    lastModified: nowISO,
    priority: calculatePriority(`/blogs/${slugify(blog.name)}`),
    changefreq: "weekly",
  }));

  const works: MetadataRoute.Sitemap = worksData.map((work: Work) => ({
    url: `${BASE_URL}/works/${slugify(work.name)}`,
    lastModified: nowISO,
    priority: calculatePriority(`/works/${slugify(work.name)}`),
    changefreq: "weekly",
  }));

  return [...staticPages, ...blogs, ...works];
}
