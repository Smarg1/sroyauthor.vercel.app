'use server';

import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';

import type {
  Blog,
  Book,
  Contribution,
  MetadataKey,
  MetadataValue,
  SearchRow,
} from '@/lib/types/app.types';

const REVALIDATE = 19_800;
const SEARCH_REVALIDATE = 8;

const DEFAULT_PAGE_SIZE = 2;
const MAX_PAGE_SIZE = 100;
const FETCH_TIMEOUT = 8_000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const EDGE_SEARCH_URL = `${SUPABASE_URL}/functions/v1/search`;

type TableName = 'blogs' | 'books' | 'contributions';

type PageResult<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type FeedConfig = {
  table: TableName;
  select: string;
};

type SearchResponse = {
  data: {
    count: number;
    results: SearchRow[];
  };
};

type BlogRow = {
  slug: string;
  title: string;
  description: string;
  created_at: string;
  cover_url: string;
  tags: string[];
  content?: string;
};

type BookRow = {
  slug: string;
  title: string;
  description: string;
  created_at: string;
  cover_url: string;
  isbn: string;
};

type ContributionRow = {
  slug: string;
  title: string;
  description: string;
  created_at: string;
  cover_url: string;
};

type MetadataRow = {
  value: string | null;
};

const blogs: FeedConfig = {
  table: 'blogs',
  select: 'slug,title,description,created_at,cover_url,tags',
};

const books: FeedConfig = {
  table: 'books',
  select: 'slug,title,description,created_at,cover_url,isbn',
};

const contributions: FeedConfig = {
  table: 'contributions',
  select: 'slug,title,description,created_at,cover_url',
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const cover = (value: string): string => value.trim() || '/not-found.svg';

const getPageMeta = (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  const safePage = Math.max(page, 1);
  const safeSize = clamp(pageSize, 1, MAX_PAGE_SIZE);

  return {
    page: safePage,
    pageSize: safeSize,
    from: (safePage - 1) * safeSize,
    to: safePage * safeSize - 1,
  };
};

const buildPage = <T>(items: T[], page: number, pageSize: number, total: number): PageResult<T> => {
  const totalPages = Math.ceil(total / pageSize);

  return {
    rows: items,
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const cache = <T>(key: string, tag: string, fn: () => Promise<T>, short = false): Promise<T> =>
  unstable_cache(fn, [key], {
    revalidate: short ? SEARCH_REVALIDATE : REVALIDATE,
    tags: [tag],
  })();

const withTimeout = async <T>(promise: Promise<T>): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT)),
  ]);

const mapBlog = (row: BlogRow): Blog => ({
  type: 'blog',
  slug: row.slug,
  title: row.title,
  description: row.description,
  createdAt: row.created_at,
  coverUrl: cover(row.cover_url),
  content: row.content ?? '',
  tags: row.tags,
});

const mapBook = (row: BookRow): Book => ({
  type: 'book',
  slug: row.slug,
  title: row.title,
  description: row.description,
  createdAt: row.created_at,
  coverUrl: cover(row.cover_url),
  isbn: row.isbn,
});

const mapContribution = (row: ContributionRow): Contribution => ({
  type: 'contribution',
  slug: row.slug,
  title: row.title,
  description: row.description,
  createdAt: row.created_at,
  coverUrl: cover(row.cover_url),
});

async function fetchPage<Row, Item>(
  config: FeedConfig,
  mapper: (row: Row) => Item,
  page?: number,
  pageSize?: number,
): Promise<PageResult<Item>> {
  const meta = getPageMeta(page, pageSize);

  const { data, error, count } = await supabase
    .from(config.table)
    .select(config.select, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(meta.from, meta.to);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as Row[];

  return buildPage(rows.map(mapper), meta.page, meta.pageSize, count ?? 0);
}

async function fetchAll<Row, Item>(
  config: FeedConfig,
  mapper: (row: Row) => Item,
): Promise<Item[]> {
  const items: Item[] = [];
  let page = 1;

  while (true) {
    const result = await fetchPage<Row, Item>(config, mapper, page, 1000);

    items.push(...result.rows);

    if (!result.hasNext) {
      break;
    }

    page++;
  }

  return items;
}

async function fetchOne<Row, Item>(
  table: TableName,
  select: string,
  slug: string,
  mapper: (row: Row) => Item,
): Promise<Item | null> {
  const { data, error } = await supabase.from(table).select(select).eq('slug', slug).single();

  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return mapper(data as Row);
}

/**
 * Returns paginated blogs ordered by newest first.
 *
 * @param page Page number starting at 1.
 * @param pageSize Number of records per page.
 * @returns Paginated blog collection.
 */
export async function getBlogs(page?: number, pageSize?: number) {
  return cache(`blogs:${page ?? 1}:${pageSize ?? 20}`, 'blogs', () =>
    fetchPage<BlogRow, Blog>(blogs, mapBlog, page, pageSize),
  );
}

/**
 * Returns every blog record.
 *
 * @returns Full blog collection.
 */
export async function getAllBlogs() {
  return cache('blogs:all', 'blogs', () => fetchAll<BlogRow, Blog>(blogs, mapBlog));
}

/**
 * Returns one blog by slug.
 *
 * @param slug Unique blog slug.
 * @returns Blog or null.
 */
export async function getBlogBySlug(slug: string) {
  return cache(`blog:${slug}`, 'blogs', () =>
    fetchOne<BlogRow, Blog>(
      'blogs',
      'slug,title,description,created_at,cover_url,tags,content',
      slug,
      mapBlog,
    ),
  );
}

/**
 * Returns paginated books ordered by newest first.
 *
 * @param page Page number starting at 1.
 * @param pageSize Number of records per page.
 * @returns Paginated book collection.
 */
export async function getBooks(page?: number, pageSize?: number) {
  return cache(`books:${page ?? 1}:${pageSize ?? 20}`, 'books', () =>
    fetchPage<BookRow, Book>(books, mapBook, page, pageSize),
  );
}

/**
 * Returns every book record.
 *
 * @returns Full book collection.
 */
export async function getAllBooks() {
  return cache('books:all', 'books', () => fetchAll<BookRow, Book>(books, mapBook));
}

/**
 * Returns one book by slug.
 *
 * @param slug Unique book slug.
 * @returns Book or null.
 */
export async function getBookBySlug(slug: string) {
  return cache(`book:${slug}`, 'books', () =>
    fetchOne<BookRow, Book>(
      'books',
      'slug,title,description,created_at,cover_url,isbn',
      slug,
      mapBook,
    ),
  );
}

/**
 * Returns paginated contributions ordered by newest first.
 *
 * @param page Page number starting at 1.
 * @param pageSize Number of records per page.
 * @returns Paginated contribution collection.
 */
export async function getContributions(page?: number, pageSize?: number) {
  return cache(`contributions:${page ?? 1}:${pageSize ?? 20}`, 'contributions', () =>
    fetchPage<ContributionRow, Contribution>(contributions, mapContribution, page, pageSize),
  );
}

/**
 * Returns every contribution record.
 *
 * @returns Full contribution collection.
 */
export async function getAllContributions() {
  return cache('contributions:all', 'contributions', () =>
    fetchAll<ContributionRow, Contribution>(contributions, mapContribution),
  );
}

/**
 * Returns one contribution by slug.
 *
 * @param slug Unique contribution slug.
 * @returns Contribution or null.
 */
export async function getContributionBySlug(slug: string) {
  return cache(`contribution:${slug}`, 'contributions', () =>
    fetchOne<ContributionRow, Contribution>(
      'contributions',
      'slug,title,description,created_at,cover_url',
      slug,
      mapContribution,
    ),
  );
}

/**
 * Returns metadata value for a key.
 *
 * @param key Metadata key.
 * @returns Metadata value or null.
 */
export async function getMetadataValue(key: MetadataKey) {
  return cache(`metadata:${key}`, 'metadata', async (): Promise<MetadataValue> => {
    const { data, error } = await supabase.from('metadata').select('value').eq('key', key).single();

    if (error) {
      throw error;
    }

    return (data as MetadataRow).value;
  });
}

/**
 * Searches indexed content through the edge function.
 *
 * @param q Search query.
 * @param page Page number starting at 1.
 * @param pageSize Number of results per page.
 * @returns Paginated search results.
 */
export async function searchContent(q: string, page = 1, pageSize = 20) {
  return cache(
    `search:${q}:${page}:${pageSize}`,
    'search',
    async () => {
      const response = await withTimeout(
        fetch(EDGE_SEARCH_URL, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q,
            page,
            pageSize,
          }),
          next: {
            revalidate: SEARCH_REVALIDATE,
          },
        }),
      );

      if (!response.ok) {
        throw new Error('search_failed');
      }

      const json = (await response.json()) as SearchResponse;

      return buildPage(json.data.results, page, pageSize, json.data.count);
    },
    true,
  );
}
