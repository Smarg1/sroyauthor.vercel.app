/* -------------------------------------------------------------------------- */
/* CORE                                                                       */
/* -------------------------------------------------------------------------- */

export type ObjectType = 'blog' | 'book' | 'contribution';

export type Cursor = string | number | null;

export type FeedResult<T> = {
  items: T[];
  nextCursor: Cursor;
  hasNext: boolean;
};

/* -------------  */
/* BASE CONTENT   */
/* -------------- */

export type BaseContent = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  coverUrl: string;
};

/* -------------  */
/* DOMAIN TYPES   */
/* -------------- */

export type Blog = BaseContent & {
  type: 'blog';
  content: string;
  tags: string[];
};

export type Book = BaseContent & {
  type: 'book';
  isbn: string;
};

export type Contribution = BaseContent & {
  type: 'contribution';
};

export type ContentItem = Blog | Book | Contribution;

/* --------- */
/* SEARCH    */
/* --------- */

export type SearchRow = {
  id?: number;
  slug: string;
  title: string;
  description: string;
  type: ObjectType;
  cover_url?: string;
  order?: number;
};

export type SearchResult = {
  id?: number;
  slug: string;
  title: string;
  description: string;
  type: ObjectType;
  cover: string;
};

export type PageResult<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginationResult<T> = PageResult<T>;

/* --------- */
/* METADATA  */
/* --------- */

export type MetadataKey = string;

export type MetadataValue = string | null;

export type MetadataRecord = {
  key: MetadataKey;
  value: MetadataValue;
};

export type ObjectTypeEnum = ObjectType;

export type ObjectView = {
  slug: string;
  title: string;
  description?: string | null;
  image?: string | null;
  date?: string | null;
  type: ObjectTypeEnum;
  isbn?: string | undefined;
};
