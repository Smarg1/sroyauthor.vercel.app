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

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  const [bioText, setBioText] = useState("");
  const [bioStatus, setBioStatus] = useState("");

  const [workTitle, setWorkTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [workFile, setWorkFile] = useState<File | null>(null);
  const [workStatus, setWorkStatus] = useState("");

  const [blogTitle, setBlogTitle] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  const [blogFiles, setBlogFiles] = useState<File[]>([]);
  const [blogStatus, setBlogStatus] = useState("");

  // Verify user
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

  // Upload dots animation
  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => setDotCount((prev) => (prev + 1) % 4), 500);
    return () => clearInterval(interval);
  }, [uploading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : "");
  };

  // ----------------- Core Upload Functions -----------------

  const uploadProfilePic = async () => {
    if (!file) return setStatus("Please select a file first");
    setUploading(true);
    setStatus("Uploading...");
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Unauthorized");

      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      const arrayBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("img-blob")
        .upload(uniqueFileName, Buffer.from(arrayBuffer), { contentType: file.type });

      if (uploadError || !uploadData) throw uploadError || new Error("Upload failed");

      const { data: publicData } = supabase.storage.from("img-blob").getPublicUrl(uploadData.path);
      if (!publicData?.publicUrl) throw new Error("Failed to get public URL");

      await supabase.from("author").update({ pfp: publicData.publicUrl }).eq("id", 1);

      setStatus("Upload successful");
      setFile(null);
      setPreview("");
    } catch (err: unknown) {
      let message = "Failed to upload profile picture";
      if (err instanceof Error) message = err.message;
      console.error(err);
      setStatus(message);
    } finally {
      setUploading(false);
    }
  };

  const uploadBio = async () => {
    const cleanBio = bioText.trim();
    if (!cleanBio) return setBioStatus("Please enter some text.");
    setUploading(true);
    setBioStatus("Uploading...");
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Unauthorized");

      await supabase.from("author").update({ description: cleanBio }).eq("id", 1);
      setBioStatus("Bio uploaded successfully");
      setBioText("");
    } catch (err: unknown) {
      let message = "Failed to upload bio";
      if (err instanceof Error) message = err.message;
      console.error(err);
      setBioStatus(message);
    } finally {
      setUploading(false);
    }
  };

  const uploadWork = async () => {
    const title = workTitle.trim();
    const desc = workDesc.trim();
    if (!title || !desc || !workFile) return setWorkStatus("Please fill all fields and select an image.");
    setUploading(true);
    setWorkStatus("Uploading...");
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Unauthorized");

      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${workFile.name}`;
      const arrayBuffer = await workFile.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("img-blob")
        .upload(uniqueFileName, Buffer.from(arrayBuffer), { contentType: workFile.type });

      if (uploadError || !uploadData) throw uploadError || new Error("Upload failed");

      const { data: publicData } = supabase.storage.from("img-blob").getPublicUrl(uploadData.path);
      if (!publicData?.publicUrl) throw new Error("Failed to get public URL");

      await supabase.from("works").insert({ name: title, description: desc, image: publicData.publicUrl });

      setWorkStatus("Work uploaded successfully");
      setWorkTitle("");
      setWorkDesc("");
      setWorkFile(null);
    } catch (err: unknown) {
      let message = "Failed to upload work";
      if (err instanceof Error) message = err.message;
      console.error(err);
      setWorkStatus(message);
    } finally {
      setUploading(false);
    }
  };

  const uploadBlog = async () => {
    const title = blogTitle.trim();
    const desc = blogDesc.trim();
    if (!title || !desc) return setBlogStatus("Please fill all fields.");
    setUploading(true);
    setBlogStatus("Uploading...");
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Unauthorized");

      const uploadedUrls: string[] = [];
      for (const file of blogFiles) {
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("img-blob")
          .upload(uniqueFileName, Buffer.from(arrayBuffer), { contentType: file.type });
        if (uploadError || !uploadData) throw uploadError || new Error("Upload failed");

        const { data: publicData } = supabase.storage.from("img-blob").getPublicUrl(uploadData.path);
        if (!publicData?.publicUrl) continue;

        uploadedUrls.push(publicData.publicUrl);
      }

      await supabase.from("blogs").insert({ name: title, description: desc, image: uploadedUrls });
      setBlogStatus("Blog uploaded successfully");
      setBlogTitle("");
      setBlogDesc("");
      setBlogFiles([]);
    } catch (err: unknown) {
      let message = "Failed to upload blog";
      if (err instanceof Error) message = err.message;
      console.error(err);
      setBlogStatus(message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/admin");
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Logout failed:", err.message);
      else console.error("Logout failed:", err);
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
        <form className={Styles.uploadForm} onSubmit={(e) => { e.preventDefault(); uploadProfilePic(); }}>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <button type="submit">Upload</button>
          {status && <p className={Styles.uploadStatus}>{status}{uploading && ".".repeat(dotCount)}</p>}
          {preview && <Image src={preview} alt="Preview" width={300} height={200} className={Styles.imagePreview} />}
        </form>
      </div>

      {/* Bio */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Bio:</h2>
        <form className={Styles.uploadForm} onSubmit={(e) => { e.preventDefault(); uploadBio(); }}>
          <textarea value={bioText} onChange={(e) => setBioText(e.target.value)} rows={6} className={Styles.textarea} placeholder="Enter bio..." required />
          <button type="submit">Upload</button>
          {bioStatus && <p className={Styles.uploadStatus}>{bioStatus}</p>}
        </form>
      </div>

      {/* Work */}
      <div className={Styles.formdiv}>
        <h2 className={Styles.text}>Upload Work:</h2>
        <form className={Styles.uploadForm} onSubmit={(e) => { e.preventDefault(); uploadWork(); }}>
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
        <form className={Styles.uploadForm} onSubmit={(e) => { e.preventDefault(); uploadBlog(); }}>
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