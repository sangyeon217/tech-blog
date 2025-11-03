export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: [
      "https://sangyeon217.vercel.app/sitemap.xml",
      "https://sangyeon217.vercel.app/rss.xml",
    ],
  };
}
