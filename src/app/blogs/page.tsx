import Link from "next/link";
import styles from "@/styles/norm.module.css";
import Heading from "@/components/Heading/Heading";
import { slugify } from "@/hooks/slugify";

type Blog = {
  id: number;
  name: string;
  description: string;
  image: string[];
};

async function getBlogs(): Promise<Blog[]> {
  const res = await fetch(`${process.env.BASE_URL}/api/blog`);
  return res.json();
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
    <div className={styles.heading}><Heading text="Blogs"/></div>
    <div className={styles.container}>
      {blogs.map(blog => {
        const slug = slugify(blog.name);
        return (
          <Link
            key={blog.id}
            href={`/blogs/${slug}`}
            style={{ textDecoration: "none" }}
          >
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{blog.name}</h2>
              <p className={styles.cardDesc}>{blog.description}</p>
            </div>
          </Link>
        );
        })}
      </div>
    </>
  );
}