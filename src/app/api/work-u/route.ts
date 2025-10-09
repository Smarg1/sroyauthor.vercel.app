import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  // Get access token from cookies
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Create Supabase client with user token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const file = formData.get("file") as File;

    // Validate input
    if (!name || !desc || !file) {
      return NextResponse.json({ error: "Missing fields or file" }, { status: 400 });
    }

    // Upload file to storage
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

    // Insert into works table
    const { error: dbError } = await supabase
      .from("works")
      .insert({
        name,
        description: desc,
        image: url,
      });

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ success: true, message: "Work uploaded", url });
  } catch (err) {
    console.error("Failed to upload work:", err);
    return NextResponse.json({ error: "Failed to upload work" }, { status: 500 });
  }
}
