import styles from "@/styles/norm.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getSlug } from "@/utils/fetch";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params; 

  const blog = await getSlug(slug, "blogs");

  if (!blog) return notFound();

  return (
    <div className={styles.bcontainer}>
      <h1 className={styles.bhead}>{blog.name}</h1>
      <p className={styles.bp}>{blog.description}</p>
      {Array.isArray(blog.image) && blog.image.length > 0 ? (
        blog.image.map((src, i) => (
          <Image key={i} src={src} alt={`${blog.name}-${i}`} className={styles.img} crossOrigin="anonymous"/>
        ))
      ) : (null)}
    </div>
  );
}