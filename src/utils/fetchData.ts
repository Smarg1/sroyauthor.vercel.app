'use server';

import { unstable_cache } from 'next/cache';

import type {
  Blog,
  Book,
  Contribution,
  MetadataKey,
  MetadataValue,
} from '@/lib/types/app.types';
import type { Database } from '@/lib/types/db.types';

import { createSupabaseServerClient } from '@/lib/supabase';

/* ------------------------------------------------------------------ */
/* Schema aliases                                                     */
/* ------------------------------------------------------------------ */

type Api = Database['api'];
type ContentNodeRow = Api['Tables']['content_nodes']['Row'];

type ContentNodePreview = Pick<
  ContentNodeRow,
  'created_at' | 'description' | 'slug' | 'title'
>;

/* ------------------------------------------------------------------ */
/* Core mapper                                                        */
/* ------------------------------------------------------------------ */

function mapNode(node: ContentNodePreview) {
  return {
    slug: node.slug,
    title: node.title,
    description: node.description,
    date: node.created_at,
  };
}

const REVALIDATE_TIME = 1800;

/* ------------------------------------------------------------------ */
/* Metadata                                                           */
/* ------------------------------------------------------------------ */

async function _getMetadataValue(key: MetadataKey): Promise<MetadataValue | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('metadata')
    .select('value')
    .eq('key', key)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data?.value ?? null;
}

export const getMetadataValue = unstable_cache(_getMetadataValue, ['metadata'], {
  revalidate: REVALIDATE_TIME,
  tags: ['metadata'],
});

/* ------------------------------------------------------------------ */
/* Blogs                                                              */
/* ------------------------------------------------------------------ */

async function _getBlogs(): Promise<Blog[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from('blogs').select(`
    content,
    tags,
    image,
    content_nodes!inner (
      slug,
      title,
      description,
      created_at
    )
  `);

  if (error) throw error;

  return data.map((row) => ({
    ...mapNode(row.content_nodes),
    type: 'blogs' as const,
    content: row.content,
    tags: row.tags,
    image: row.image,
  }));
}

export const getBlogs = unstable_cache(_getBlogs, ['blogs'], {
  revalidate: REVALIDATE_TIME,
  tags: ['blogs'],
});

async function _getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
      content,
      tags,
      image,
      content_nodes!inner (
        slug,
        title,
        description,
        created_at
      )
    `,
    )
    .eq('content_nodes.slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...mapNode(data.content_nodes),
    type: 'blogs' as const,
    content: data.content,
    tags: data.tags,
    image: data.image,
  };
}

export const getBlogBySlug = unstable_cache(_getBlogBySlug, ['blog-slug'], {
  revalidate: REVALIDATE_TIME,
  tags: ['blogs'],
});

/* ------------------------------------------------------------------ */
/* Books                                                              */
/* ------------------------------------------------------------------ */

async function _getBooks(): Promise<Book[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from('books').select(`
    isbn,
    image,
    content_nodes!inner (
      slug,
      title,
      description,
      created_at
    )
  `);

  if (error) throw error;

  return data.map((row) => ({
    ...mapNode(row.content_nodes),
    type: 'books' as const,
    isbn: row.isbn,
    image: row.image,
  }));
}

export const getBooks = unstable_cache(_getBooks, ['books'], {
  revalidate: REVALIDATE_TIME,
  tags: ['books'],
});

async function _getBookBySlug(slug: string): Promise<Book | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('books')
    .select(
      `
      isbn,
      image,
      content_nodes!inner (
        slug,
        title,
        description,
        created_at
      )
    `,
    )
    .eq('content_nodes.slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...mapNode(data.content_nodes),
    type: 'books' as const,
    isbn: data.isbn,
    image: data.image,
  };
}

export const getBookBySlug = unstable_cache(_getBookBySlug, ['book-slug'], {
  revalidate: REVALIDATE_TIME,
  tags: ['books'],
});

/* ------------------------------------------------------------------ */
/* Contributions                                                      */
/* ------------------------------------------------------------------ */

async function _getContributions(): Promise<Contribution[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from('contributions').select(`
    image,
    content_nodes!inner (
      slug,
      title,
      description,
      created_at
    )
  `);

  if (error) throw error;

  return data.map((row) => ({
    ...mapNode(row.content_nodes),
    type: 'contributions' as const,
    image: row.image,
  }));
}

export const getContributions = unstable_cache(_getContributions, ['contributions'], {
  revalidate: REVALIDATE_TIME,
  tags: ['contributions'],
});

async function _getContributionBySlug(slug: string): Promise<Contribution | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('contributions')
    .select(
      `
      image,
      content_nodes!inner (
        slug,
        title,
        description,
        created_at
      )
    `,
    )
    .eq('content_nodes.slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...mapNode(data.content_nodes),
    type: 'contributions' as const,
    image: data.image,
  };
}

export const getContributionBySlug = unstable_cache(
  _getContributionBySlug,
  ['contribution-slug'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['contributions'],
  },
);
