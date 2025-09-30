"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "var(--font-quicksand), sans-serif",
        color: "#5b4636",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          margin: "0",
          color: "#8b5e3c",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.5rem",
          margin: "1rem 0 2rem",
        }}
      >
        Hmmm… we couldn’t find the page you’re looking for.
      </p>
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
    </div>
  );
}
