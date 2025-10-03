import Link from "next/link";
import styles from "@/styles/norm.module.css";
import Heading from "@/components/Heading/Heading";
import { Get, slugify, Author } from "@/utils/fetch";

export default async function BlogsPage() {
  const blogs = await Get<Author>("blogs");

  return (
    <>
      <div className={styles.heading}>
        <Heading text="Blogs" />
      </div>

      <div className={styles.container}>
        {blogs.length === 0 ? (
          <p className={styles.bp}>You are all caught up!</p>
        ) : (
          blogs.map(blog => {
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
          })
        )}
      </div>
    </>
  );
}
