import { getPosts } from "@/lib/contentful";

export default async function sitemap() {
  const baseUrl = "https://sangyeon217.vercel.app";

  try {
    const postsRes = await getPosts({ category: "All" });

    if (
      !postsRes.success ||
      !Array.isArray(postsRes.data.items) ||
      postsRes.data.items.length === 0
    ) {
      return [{ url: baseUrl, lastModified: new Date().toISOString() }];
    }

    return [
      { url: baseUrl, lastModified: new Date().toISOString() },
      ...postsRes.data.items.map((post) => ({
        url: `${baseUrl}/posts/${post.fields.slug}`,
        lastModified: new Date(String(post.fields.publishedAt)).toISOString(),
      })),
    ];
  } catch {
    return [{ url: baseUrl, lastModified: new Date().toISOString() }];
  }
}
