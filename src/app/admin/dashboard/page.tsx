"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Styles from "@/styles/api.module.css";
import Button from "@/components/Button/Button";

// JWT-enabled fetch helper
async function jwtFetch(input: RequestInfo, init?: RequestInit) {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}

const buttons = [
  { label: "Vercel Analytics", href: "https://vercel.com/smarg1-projects-cb8d1e0a/sroyauthor/analytics?environment=all" },
  { label: "Vercel Performance Insights", href: "https://vercel.com/smarg1-projects-cb8d1e0a/sroyauthor/speed-insights" },
  { label: "Vercel Observations", href: "https://vercel.com/smarg1-projects-cb8d1e0a/sroyauthor/observability" },
  { label: "Blob Image Database", href: "https://vercel.com/smarg1-projects-cb8d1e0a/~/stores/blob/store_R9QjyxEYq4yjgV2K/browser" },
  { label: "Supabase Text Database", href: "" },
  { label: "Google Search Performance", href: "https://search.google.com/search-console?utm_source=about-page&resource_id=https://sroyauthor.vercel.app/" },
  { label: "Uptime Incident Status", href: "https://stats.uptimerobot.com/Rzrhg2rzDw" },
];

export default function AdminDashboard() {
  // ===== Image Upload State =====
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [dotCount, setDotCount] = useState(0);

  // ===== Bio Upload State =====
  const [bioText, setBioText] = useState("");
  const [bioStatus, setBioStatus] = useState("");

  // ===== Blog Upload State =====
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  const [blogFiles, setBlogFiles] = useState<File[]>([]);
  const [blogStatus, setBlogStatus] = useState("");

  // ===== Work Upload State =====
  const [workTitle, setWorkTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [workFile, setWorkFile] = useState<File | null>(null);
  const [workStatus, setWorkStatus] = useState("");

  const router = useRouter();
  
  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => setDotCount((prev) => (prev + 1) % 4), 500);
    return () => clearInterval(interval);
  }, [uploading]);

  // ===== Handlers =====
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : "");
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus("Please select a file first");

    setUploading(true);
    setStatus("Uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await jwtFetch("/api/pfp-u", { method: "POST", body: formData });
      setStatus(res.ok ? "Upload successful" : "Upload failed");
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioText.trim()) return setBioStatus("Please enter some text.");

    setBioStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", bioText);

      const res = await jwtFetch("/api/bio-u", { method: "POST", body: formData });
      setBioStatus(res.ok ? "Bio uploaded successfully" : "Upload failed");
    } catch (err) {
      console.error(err);
      setBioStatus("Something went wrong");
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogDesc.trim()) return setBlogStatus("Please fill all fields.");

    setBlogStatus("Uploading...");
    const formData = new FormData();
    formData.append("name", blogTitle);
    formData.append("desc", blogDesc);
    blogFiles.forEach((f) => formData.append("files", f));

    try {
      const res = await jwtFetch("/api/blog-u", { method: "POST", body: formData });
      setBlogStatus(res.ok ? "Blog uploaded successfully" : "Upload failed");
    } catch (err) {
      console.error(err);
      setBlogStatus("Something went wrong");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push("/admin");
  };


  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim() || !workDesc.trim() || !workFile) return setWorkStatus("Please fill all fields and select an image.");

    setWorkStatus("Uploading...");
    const formData = new FormData();
    formData.append("name", workTitle);
    formData.append("desc", workDesc);
    formData.append("file", workFile);

    try {
      const res = await jwtFetch("/api/work-u", { method: "POST", body: formData });
      setWorkStatus(res.ok ? "Work uploaded successfully" : "Upload failed");
    } catch (err) {
      console.error(err);
      setWorkStatus("Something went wrong");
    }
  };

  // ===== JSX =====
  return (
    <>
      <h1 className={Styles.greet}>Welcome Back, Sangita Roy</h1>
      <p className={Styles.greet}>Use Admin Account for analytics Access | Do Not Change Values Manually</p>
      <Button onClick={handleLogout} label="Logout"/>

      <div className={Styles.maindiv}>
        {buttons.map((btn) => (
          <Button key={btn.label} label={btn.label} href={btn.href} />
        ))}
      </div>

      {/* Profile Picture Upload */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Bio Pic:</h2>
        <form className={Styles.uploadForm} onSubmit={handleImageSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <button type="submit">Upload</button>
          {status && <p className={Styles.uploadStatus}>{status}{uploading && ".".repeat(dotCount)}</p>}
          {preview && <Image src={preview} alt="Preview" width={300} height={200} className={Styles.imagePreview} />}
        </form>
      </div>

      {/* Bio Upload */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Bio:</h2>
        <form className={Styles.uploadForm} onSubmit={handleBioSubmit}>
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Enter bio text here..."
            rows={6}
            className={Styles.textarea}
            required
          />
          <button type="submit">Upload</button>
          {bioStatus && <p className={Styles.uploadStatus}>{bioStatus}</p>}
        </form>
      </div>

      {/* Work Upload */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Work:</h2>
        <form className={Styles.uploadForm} onSubmit={handleWorkSubmit}>
          <input value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} placeholder="Work title" required />
          <textarea
            value={workDesc}
            onChange={(e) => setWorkDesc(e.target.value)}
            placeholder="Work description"
            className={Styles.textarea}
            rows={4}
            required
          />
          <input type="file" accept="image/*" onChange={(e) => setWorkFile(e.target.files?.[0] || null)} required />
          <button type="submit">Upload</button>
          {workStatus && <p className={Styles.uploadStatus}>{workStatus}</p>}
        </form>
      </div>

      {/* Blog Upload */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Blog:</h2>
        <form className={Styles.uploadForm} onSubmit={handleBlogSubmit}>
          <input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="Blog title" required />
          <textarea
            value={blogDesc}
            onChange={(e) => setBlogDesc(e.target.value)}
            placeholder="Blog description"
            className={Styles.textarea}
            rows={4}
            required
          />
          <input type="file" accept="image/*" multiple onChange={(e) => setBlogFiles(Array.from(e.target.files || []))} />
          <button type="submit">Upload</button>
          {blogStatus && <p className={Styles.uploadStatus}>{blogStatus}</p>}
        </form>
      </div>
    </>
  );
}
