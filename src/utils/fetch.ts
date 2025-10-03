import { supabase } from "@/lib/supabase";

type value = {
  id: number;
  name: string;
  description: string;
  image?: string[] | string;
  [key: string]: unknown;
};

export type Author = {
  id: number
  name: string
  description: string
  pfp: string | null
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getSlug(slug: string, table: string): Promise<value | null> {
  try {
    const { data, error } = await supabase.from(table).select("*");

    if (error || !data) {
      console.error(`Supabase error fetching from ${table}:`, error);
      return null;
    }

    const slugItems: value[] = data;

    slugItems.forEach(item => {
      if (typeof item.image === "string") {
        try {
          item.image = JSON.parse(item.image);
        } catch {
          item.image = [];
        }
      }
    });

    return slugItems.find(item => slugify(item.name) === slug) || null;
  } catch (err) {
    console.error(`Failed to fetch slug from ${table}:`, err);
    return null;
  }
}

export async function Get<T>(table: string): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select("*")

    if (error) {
      console.error(`Supabase error fetching from ${table}:`, error)
      return []
    }

    return data as T[] ?? []
  } catch (err) {
    console.error(`Unexpected error fetching from ${table}:`, err)
    return []
  }
}

export async function bioG(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("author")
      .select("description")
      .eq("id", 1)
      .single()

    if (error || !data) {
      console.error("Supabase error fetching bio:", error)
      return "null"
    }

    return data.description ?? "null"
  } catch (err) {
    console.error("Unexpected error fetching bio:", err)
    return "null"
  }
}

export async function pfpG(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("author")
      .select("pfp")
      .eq("id", 1)
      .single()

    if (error || !data) {
      console.error("Supabase error fetching pfp:", error)
      return null
    }

    return data.pfp ?? null
  } catch (err) {
    console.error("Unexpected error fetching pfp:", err)
    return null
  }
}

