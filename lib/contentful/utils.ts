import type { Asset, EntryFieldTypes } from "contentful";
import type { PostEntry, PostStatus } from "./types";

export function getThumbnailUrl(thumbnail?: EntryFieldTypes.AssetLink | unknown): string | null {
  const thumbnailUrl = (thumbnail as Asset)?.fields?.file?.url;
  if (!thumbnailUrl || typeof thumbnailUrl !== "string") return null;
  return thumbnailUrl.startsWith("//") ? `https:${thumbnailUrl}` : thumbnailUrl;
}

export function getPostStatus(post: PostEntry): PostStatus | null {
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  const now = Date.now();
  const publishedAt = new Date(String(post.fields.publishedAt)).getTime();

  if (now - publishedAt <= WEEK_MS) {
    return "NEW";
  }

  const updatedAt = new Date(String(post.sys.updatedAt)).getTime();
  if (now - updatedAt <= WEEK_MS) {
    return "UPDATED";
  }

  return null;
}

export function formatPublishedAt(
  publishedAt: string,
  {
    locale = "ko-KR",
    dateStyle = "medium",
  }: { locale?: string; dateStyle?: Intl.DateTimeFormatOptions["dateStyle"] } = {}
): string {
  return new Date(publishedAt).toLocaleDateString(locale, {
    dateStyle,
    timeZone: "Asia/Seoul",
  });
}
