"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string; statusCode?: number };
}

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";
    document.body.style.backgroundColor = "#f3ebe0";
    document.body.style.fontFamily = "var(--font-quicksand), sans-serif";
    document.body.style.color = "#5b4636";
    document.body.style.textAlign = "center";
    return () => {
      document.body.style = "";
    };
  }, [error]);

  const statusCode = error.statusCode ?? 500;

  const sanitizeMessage = (msg?: string) => {
    if (!msg) return "Oops… something went wrong.";
    const div = document.createElement("div");
    div.textContent = msg;
    return div.innerHTML;
  };

  return (
    <>
      <h1
        style={{
          fontSize: "5rem",
          margin: "0",
          color: "#8b5e3c",
        }}
      >
        {statusCode}
      </h1>
      <p
        style={{
          fontSize: "1.5rem",
          margin: "1rem 0 2rem",
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeMessage(error.message) }}
      />
      <Link
        href="/"
        style={{
          textDecoration: "none",
          color: "#f3ebe0",
          backgroundColor: "#8b5e3c",
          fontWeight: "bold",
          fontSize: "1.2rem",
          padding: "0.6rem 1.8rem",
          borderRadius: "8px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#5b4636";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#8b5e3c";
        }}
      >
        Back to Home
      </Link>
    </>
  );
}
