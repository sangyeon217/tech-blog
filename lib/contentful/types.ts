import {
  type EntrySkeletonType,
  type EntryFieldTypes,
  type Entry,
  type EntryCollection,
} from "contentful";

export interface PostSkeleton extends EntrySkeletonType {
  contentTypeId: "post";
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    category?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    content: EntryFieldTypes.Text;
    thumbnail: EntryFieldTypes.AssetLink;
    thumbnailDominantColor?: EntryFieldTypes.Symbol;
    publishedAt: EntryFieldTypes.Date;
  };
}

export type CategoryItem = { name: string; count: number };
export type PostCollection = EntryCollection<PostSkeleton>;
export type PostEntry = Entry<PostSkeleton>;

export type FetchResult<T> = { success: true; data: T } | { success: false; error: unknown };
