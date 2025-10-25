import type { Asset, EntryFieldTypes } from "contentful";

export function getThumbnailUrl(thumbnail?: EntryFieldTypes.AssetLink | unknown): string | null {
  const thumbnailUrl = (thumbnail as Asset)?.fields?.file?.url;
  if (!thumbnailUrl || typeof thumbnailUrl !== "string") return null;
  return thumbnailUrl.startsWith("//") ? `https:${thumbnailUrl}` : thumbnailUrl;
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
