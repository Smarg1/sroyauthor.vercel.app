'use server';

import { redis } from '@/lib/redis';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/Slugify';

// ===================== Types ===================== //
export interface Work {
  id: number;
  name: string;
  description: string;
  image: string | null;
}

export interface Author {
  id: number;
  description: string;
  pfp: string;
}

export interface Blog {
  id: number;
  name: string;
  description: string;
  image: string | string[] | null;
}

// ===================== Helpers ===================== //
function normalizeImage(image: string | string[] | null | undefined): string | string[] {
  if (!image) return '/not-found.svg';
  if (Array.isArray(image)) return image.length > 0 ? image : ['/not-found.svg'];
  try {
    const parsed = JSON.parse(image);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((v) => String(v));
    }
    return String(parsed);
  } catch {
    return image;
  }
}
// ===================== Core Fetch Function ===================== //
async function getTableData<T extends object>(
  table: string,
  columns: string,
  transform?: (item: T) => T,
): Promise<T[]> {
  const cacheKey = `table:${table}:${columns}`;
  const cached = await redis.get<T[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase.from(table).select(columns);

  if (error || !data) {
    console.error('[fetchData] Supabase error fetching %s:', table, error);
    return [];
  }

  const rows = Array.isArray(data)
    ? (data as unknown as Record<string, unknown>[])
    : [];

  const processed = rows.map((item) => {
    const obj = { ...item } as Record<string, unknown>;

    if ('image' in obj && typeof obj.image === 'string') {
      obj.image = normalizeImage(obj.image as string | null | undefined);
    }

    return transform ? transform(obj as T) : (obj as T);
  });

  await redis.set(cacheKey, processed, { ex: 600 });
  return processed;
}

// ===================== Public Fetchers ===================== //
export async function getWorks(): Promise<Work[]> {
  return getTableData<Work>('works', 'id, name, description, image', (item) => ({
    ...item,
    image: item.image,
  }));
}

export async function getAuthor(): Promise<Author | null> {
  const authors = await getTableData<Author>('author', 'id, description, pfp');
  return authors.length > 0 ? authors[0] : null;
}

export async function getBlogs(): Promise<Blog[]> {
  return getTableData<Blog>(
    'blogs',
    'id, name, description, image',
    (item) => ({
      ...item,
      image: normalizeImage(item.image),
    }),
  );
}

// ===================== Fetch Single Item by Slug ===================== //
export async function getSlug<T extends Work | Blog>(
  slug: string,
  table: 'works' | 'blogs',
): Promise<T | null> {
  const items = await getTableData<T>(table, 'id, name, description, image');
  const match = items.find((item) => slugify(item.name) === slug);
  return match ?? null;
}
