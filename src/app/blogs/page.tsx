"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/norm.module.css";
import Heading from "@/components/Heading/Heading";
import Card from "@/components/Card/Card";
import { Get, slugify, value } from "@/utils/fetch";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<value[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await Get<value>("blogs");
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
              <Card
                key={blog.id}
                href={`/blogs/${slug}`}
                imageSrc={Array.isArray(blog.image) ? blog.image[0] ?? "/not-found.png" : blog.image ?? "/not-found.png"}
                imageAlt={blog.name}
                title={blog.name}
                description={blog.description}
              />
            );
          })
        )}
      </div>
    </>
  );
}
