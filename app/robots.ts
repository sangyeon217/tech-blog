export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://sangyeon.vercel.app/sitemap.xml",
  };
}
