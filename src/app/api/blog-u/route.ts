import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const title = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const files = formData.getAll("files[]") as File[];

    if (!title || !desc) return NextResponse.json({ error: "Missing title or description" }, { status: 400 });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      const arrayBuffer = await file.arrayBuffer();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("img-blob")
        .upload(uniqueFileName, Buffer.from(arrayBuffer), { contentType: file.type });

      if (uploadError || !uploadData) throw uploadError || new Error("Upload failed");

      const { data: publicData } = supabase.storage
        .from("img-blob")
        .getPublicUrl(uploadData.path);

      if (publicData?.publicUrl) uploadedUrls.push(publicData.publicUrl);
    }

    const { error: dbError } = await supabase
      .from("blogs")
      .insert({ name: title, description: desc, image: uploadedUrls });

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ success: true, message: "Blog uploaded", images: uploadedUrls });
  } catch (err) {
    console.error("Blog upload failed:", err);
    return NextResponse.json({ error: "Failed to upload blog" }, { status: 500 });
  }
}
