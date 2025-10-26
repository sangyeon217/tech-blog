import { createClient, type EntriesQueries } from "contentful";
import type { CategoryItem, PostCollection, PostSkeleton, PostEntry, FetchResult } from "./types";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const DELIVERY_TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN!;
const PREVIEW_TOKEN = process.env.CONTENTFUL_PREVIEW_TOKEN!;
const IS_PREVIEW_MODE = process.env.CONTENTFUL_PREVIEW_ENABLED === "true";

let cachedClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (cachedClient) return cachedClient;

  cachedClient = createClient({
    space: SPACE_ID,
    environment: ENVIRONMENT,
    accessToken: IS_PREVIEW_MODE ? PREVIEW_TOKEN : DELIVERY_TOKEN,
    host: IS_PREVIEW_MODE ? "preview.contentful.com" : "cdn.contentful.com",
  });

  return cachedClient;
}

/**
 * 카테고리 목록 조회
 */
export async function getCategories(): Promise<FetchResult<CategoryItem[]>> {
  const client = getClient();

  try {
    const response = await client.getEntries<PostSkeleton>({
      content_type: "post",
      select: ["fields.category"],
      limit: 1000,
      locale: "ko-KR",
    });

    const categoryMap = new Map<string, number>();
    response.items.forEach((post) => {
      const categories = post?.fields?.category ?? [];
      categories.forEach((c) => categoryMap.set(c, (categoryMap.get(c) ?? 0) + 1));
    });

    const categoryList: CategoryItem[] = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      success: true,
      data: [{ name: "All", count: response.total }, ...categoryList],
    };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * 게시글 목록 조회
 */
export async function getPosts({
  category = "All",
  page = 1,
  size = 6,
}: {
  category?: string;
  page?: number;
  size?: number;
}): Promise<FetchResult<PostCollection>> {
  const client = getClient();

  const query: EntriesQueries<PostSkeleton, undefined> = {
    content_type: "post",
    order: ["-fields.publishedAt"],
    include: 2,
    limit: size,
    skip: (page - 1) * size,
    locale: "ko-KR",
    select: [
      "fields.slug",
      "fields.title",
      "fields.description",
      "fields.category",
      "fields.thumbnail",
      "fields.publishedAt",
    ],
    ...(category && category !== "All" ? { "fields.category[all]": category } : {}),
  };

  try {
    const response = await client.getEntries<PostSkeleton>(query);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * 게시글 조회
 */
export async function getPostBySlug(slug: string): Promise<FetchResult<PostEntry | null>> {
  const client = getClient();

  try {
    const response = await client.getEntries<PostSkeleton>({
      content_type: "post",
      "fields.slug": slug,
      limit: 1,
      include: 2,
      locale: "ko-KR",
    });
    return { success: true, data: response.items[0] ?? null };
  } catch (error) {
    return { success: false, error };
  }
}
