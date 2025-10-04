"use client"

import Link from "next/link";
import styles from "@/styles/norm.module.css";
import Heading from "@/components/Heading/Heading";
import { useState, useEffect } from "react";
import { Get, slugify, Author } from "@/utils/fetch";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Author[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await Get<Author>("blogs");
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

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
