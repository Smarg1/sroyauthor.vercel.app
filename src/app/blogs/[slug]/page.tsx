import styles from "@/styles/norm.module.css";
import { slugify } from "@/hooks/slugify";
import { notFound } from "next/navigation";
import Image from "next/image";

type Blog = {
  id: number;
  name: string;
  description: string;
  image: string[] | string; 
};

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const res = await fetch(`${process.env.BASE_URL}/api/blog`);
  const blogs: Blog[] = await res.json();
  blogs.forEach(blog => {
    if (typeof blog.image === "string") {
      try {
        blog.image = JSON.parse(blog.image);
      } catch {
        blog.image = [];
      }
    }
  });
  return blogs.find(blog => slugify(blog.name) === slug) || null;
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params; 

  const blog = await getBlogBySlug(slug);

  if (!blog) return notFound();

  return (
    <div className={styles.bcontainer}>
      <h1 className={styles.bhead}>{blog.name}</h1>
      <p className={styles.bp}>{blog.description}</p>
      <div className={styles.blogImages}>
        {Array.isArray(blog.image) && blog.image.length > 0 ? (
          blog.image.map((src, i) => (
            <Image key={i} src={src} alt={`${blog.name}-${i}`} className={styles.img} fill={true} crossOrigin="anonymous"/>
          ))
        ) : (null)}
      </div>
    </div>
  );
}