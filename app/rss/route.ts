import RSS from "rss";
import { getPosts } from "@/lib/contentful";

export async function GET() {
  try {
    const postsRes = await getPosts({ category: "All" });

    if (!postsRes || postsRes.success === false) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
         <rss version="2.0">
           <channel>
             <title>Sangyeon's Tech Blog</title>
             <description>RSS feed unavailable</description>
             <link>https://sangyeon.vercel.app</link>
             <item>
               <title>Feed temporarily unavailable</title>
               <description>Unable to fetch posts at the moment.</description>
               <pubDate>${new Date().toUTCString()}</pubDate>
             </item>
           </channel>
         </rss>`,
        {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
          status: 503,
        }
      );
    }

    const posts = postsRes.data;
    if (!posts || posts.items.length === 0) {
      const emptyFeed = new RSS({
        title: "Sangyeon's Tech Blog",
        description: "아직 게시글이 없습니다.",
        site_url: "https://sangyeon.vercel.app",
        feed_url: "https://sangyeon.vercel.app/rss.xml",
      });

      return new Response(emptyFeed.xml({ indent: true }), {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    const feed = new RSS({
      title: "Sangyeon's Tech Blog",
      description: "상연의 기술 블로그입니다.",
      site_url: "https://sangyeon.vercel.app",
      feed_url: "https://sangyeon.vercel.app/rss.xml",
    });

    posts.items.forEach((post) => {
      const { title, slug, description, publishedAt } = post.fields;

      feed.item({
        title: String(title),
        description: String(description || ""),
        url: `https://sangyeon.vercel.app/posts/${slug}`,
        date: new Date(String(publishedAt)).toUTCString(),
      });
    });

    return new Response(feed.xml({ indent: true }), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
       <rss version="2.0">
         <channel>
           <title>Sangyeon's Tech Blog</title>
           <description>Feed generation failed due to a server error.</description>
           <link>https://sangyeon.vercel.app</link>
           <item>
             <title>Feed unavailable</title>
             <description>Please try again later.</description>
             <pubDate>${new Date().toUTCString()}</pubDate>
           </item>
         </channel>
       </rss>`,
      {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
        status: 500,
      }
    );
  }
}
