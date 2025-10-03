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
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("img-blob")
      .upload(uniqueFileName, Buffer.from(arrayBuffer), { contentType: file.type });

    if (uploadError || !uploadData) throw uploadError || new Error("Upload failed");

    const { data: publicData } = supabase.storage
      .from("img-blob")
      .getPublicUrl(uploadData.path);

    if (!publicData?.publicUrl) throw new Error("Failed to get public URL");

    const url = publicData.publicUrl;

    const { error: dbError } = await supabase
      .from("author")
      .update({ pfp: url })
      .eq("id", 1);

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ success: true, url });
  } catch (err: unknown) {
    console.error("Failed to update profile picture:", err);
    return NextResponse.json({ error: "Failed to update profile picture" }, { status: 500 });
  }
}
