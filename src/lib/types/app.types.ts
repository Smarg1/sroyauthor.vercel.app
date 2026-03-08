import type { Database } from './db.types';

/* ----------------------------- */
/* Schema Alias                  */
/* ----------------------------- */

type Api = Database['api'];

/* ----------------------------- */
/* Core Enum                     */
/* ----------------------------- */

export type ObjectTypeEnum = Api['Enums']['work'];

/* ----------------------------- */
/* Base Content Node             */
/* ----------------------------- */

type ContentNodeRow = Api['Tables']['content_nodes']['Row'];

export interface ContentNodeBase {
  date: ContentNodeRow['created_at'];
  description?: ContentNodeRow['description'];
  slug: ContentNodeRow['slug'];
  title: ContentNodeRow['title'];
}

/* ----------------------------- */
/* Blog                          */
/* ----------------------------- */

type BlogRow = Api['Tables']['blogs']['Row'];

export type Blog = ContentNodeBase & {
  content: BlogRow['content'];
  image: BlogRow['image']; // string | null
  tags: BlogRow['tags'];
  type: 'blogs';
};

/* ----------------------------- */
/* Book                          */
/* ----------------------------- */

type BookRow = Api['Tables']['books']['Row'];

export type Book = ContentNodeBase & {
  image: BookRow['image']; // string
  isbn: BookRow['isbn'];
  type: 'books';
};

/* ----------------------------- */
/* Contribution                  */
/* ----------------------------- */

type ContributionRow = Api['Tables']['contributions']['Row'];

export type Contribution = ContentNodeBase & {
  image: ContributionRow['image']; // string
  type: 'contributions';
};

/* ----------------------------- */
/* Union View                    */
/* ----------------------------- */

export type ObjectView = Blog | Book | Contribution;

/* ----------------------------- */
/* Metadata                      */
/* ----------------------------- */

type MetadataRow = Api['Tables']['metadata']['Row'];

export type MetadataKey = MetadataRow['key'];
export type MetadataValue = MetadataRow['value'];

export interface MetadataRecord {
  key: MetadataKey;
  value: MetadataValue;
}
