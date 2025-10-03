"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Styles from "@/styles/api.module.css";
import Button from "@/components/Button/Button";
import { supabase } from "@/lib/supabase";

const buttons = [
  { label: "Vercel Analytics", href: "https://vercel.com/smarg1-projects-cb8d1e0a/sroyauthor/analytics?environment=all" },
  { label: "Vercel Performance Insights", href: "https://vercel.com/smarg1-projects-cb8d1e0a/sroyauthor/speed-insights" },
  { label: "Vercel Observations", href: "https://vercel.com/smarg1-projects-cb8d1e0a/sroyauthor/observability" },
  { label: "Blob Image Database", href: "https://vercel.com/smarg1-projects-cb8d1e0a/~/stores/blob/store_R9QjyxEYq4yjgV2K/browser" },
  { label: "Supabase Text Database", href: "https://supabase.com/dashboard/org/vercel_icfg_7Y8Y7mFxpazP5AJABYDBYUm3" },
  { label: "Google Search Performance", href: "https://search.google.com/search-console?utm_source=about-page&resource_id=https://sroyauthor.vercel.app/" },
  { label: "Uptime Incident Status", href: "https://stats.uptimerobot.com/Rzrhg2rzDw" },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Profile Pic
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  // Bio
  const [bioText, setBioText] = useState("");
  const [bioStatus, setBioStatus] = useState("");

  // Work
  const [workTitle, setWorkTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [workFile, setWorkFile] = useState<File | null>(null);
  const [workStatus, setWorkStatus] = useState("");

  // Blog
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  const [blogFiles, setBlogFiles] = useState<File[]>([]);
  const [blogStatus, setBlogStatus] = useState("");

  // -------------------------------
  // Verify user
  // -------------------------------
  useEffect(() => {
    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/admin");
        return;
      }
      setUserEmail(data.user.email ?? "Admin");
      setLoading(false);
    };
    verifyUser();
  }, [router]);

  // -------------------------------
  // Upload animation dots
  // -------------------------------
  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => setDotCount((prev) => (prev + 1) % 4), 500);
    return () => clearInterval(interval);
  }, [uploading]);

  // -------------------------------
  // File change
  // -------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : "");
  };

  // -------------------------------
  // Helper: Upload FormData to API
  // -------------------------------
  const uploadToApi = async (endpoint: string, formData: FormData) => {
    setUploading(true);
    try {
      const res = await fetch(endpoint, { method: "POST", body: formData, credentials: "include" });
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (err) {
      console.error(err);
      return { ok: false, data: { error: "Something went wrong" } };
    } finally {
      setUploading(false);
    }
  };

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");
    const { ok, data } = await uploadToApi("/api/pfp-u", formData);
    setStatus(ok ? "Upload successful" : `Upload failed: ${data.error || "Unknown error"}`);
    if (ok) {
      setFile(null);
      setPreview("");
    }
  };

  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBio = bioText.trim();
    if (!cleanBio) return setBioStatus("Please enter some text.");

    const formData = new FormData();
    formData.append("description", cleanBio);

    setBioStatus("Uploading...");
    const { ok, data } = await uploadToApi("/api/bio-u", formData);
    setBioStatus(ok ? "Bio uploaded successfully" : `Upload failed: ${data.error || "Unknown error"}`);
    if (ok) setBioText("");
  };

  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = workTitle.trim();
    const desc = workDesc.trim();
    if (!title || !desc || !workFile) return setWorkStatus("Please fill all fields and select an image.");

    const formData = new FormData();
    formData.append("name", title);
    formData.append("desc", desc);
    formData.append("file", workFile);

    setWorkStatus("Uploading...");
    const { ok, data } = await uploadToApi("/api/work-u", formData);
    setWorkStatus(ok ? "Work uploaded successfully" : `Upload failed: ${data.error || "Unknown error"}`);
    if (ok) {
      setWorkTitle("");
      setWorkDesc("");
      setWorkFile(null);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = blogTitle.trim();
    const desc = blogDesc.trim();
    if (!title || !desc) return setBlogStatus("Please fill all fields.");

    const formData = new FormData();
    formData.append("name", title);
    formData.append("desc", desc);
    blogFiles.forEach((f) => formData.append("files[]", f));

    setBlogStatus("Uploading...");
    const { ok, data } = await uploadToApi("/api/blog-u", formData);
    setBlogStatus(ok ? "Blog uploaded successfully" : `Upload failed: ${data.error || "Unknown error"}`);
    if (ok) {
      setBlogTitle("");
      setBlogDesc("");
      setBlogFiles([]);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      await supabase.auth.signOut();
      router.push("/admin");
    } catch {
      console.error("Logout failed");
    }
  };

  if (loading) return <p className={Styles.greet}>Checking authentication...</p>;

  return (
    <>
      <h1 className={Styles.greet}>Welcome Back, {userEmail}</h1>
      <p className={Styles.greet}>Use Admin Account for analytics access | Do Not Change Values Manually</p>
      <Button onClick={handleLogout} label="Logout" />

      <div className={Styles.maindiv}>
        {buttons.map((btn) => <Button key={btn.label} label={btn.label} href={btn.href} />)}
      </div>

      {/* Profile Pic */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Bio Pic:</h2>
        <form className={Styles.uploadForm} onSubmit={handleImageSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <button type="submit">Upload</button>
          {status && <p className={Styles.uploadStatus}>{status}{uploading && ".".repeat(dotCount)}</p>}
          {preview && <Image src={preview} alt="Preview" width={300} height={200} className={Styles.imagePreview} />}
        </form>
      </div>

      {/* Bio */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Bio:</h2>
        <form className={Styles.uploadForm} onSubmit={handleBioSubmit}>
          <textarea value={bioText} onChange={(e) => setBioText(e.target.value)} rows={6} className={Styles.textarea} placeholder="Enter bio..." required />
          <button type="submit">Upload</button>
          {bioStatus && <p className={Styles.uploadStatus}>{bioStatus}</p>}
        </form>
      </div>

      {/* Work */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Work:</h2>
        <form className={Styles.uploadForm} onSubmit={handleWorkSubmit}>
          <input value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} placeholder="Work title" required />
          <textarea value={workDesc} onChange={(e) => setWorkDesc(e.target.value)} rows={4} className={Styles.textarea} placeholder="Work description" required />
          <input type="file" accept="image/*" onChange={(e) => setWorkFile(e.target.files?.[0] || null)} required />
          <button type="submit">Upload</button>
          {workStatus && <p className={Styles.uploadStatus}>{workStatus}</p>}
        </form>
      </div>

      {/* Blog */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Blog:</h2>
        <form className={Styles.uploadForm} onSubmit={handleBlogSubmit}>
          <input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="Blog title" required />
          <textarea value={blogDesc} onChange={(e) => setBlogDesc(e.target.value)} rows={4} className={Styles.textarea} placeholder="Blog description" required />
          <input type="file" accept="image/*" multiple onChange={(e) => setBlogFiles(Array.from(e.target.files || []))} />
          <button type="submit">Upload</button>
          {blogStatus && <p className={Styles.uploadStatus}>{blogStatus}</p>}
        </form>
      </div>
    </>
  );
}