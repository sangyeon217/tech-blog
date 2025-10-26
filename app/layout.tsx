import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sangyeon's Tech Blog",
  description: "상연의 기술 블로그 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className="flex min-h-screen flex-col dark:bg-black transition-colors">
        <Header />
        <main className="flex-1 w-full mx-auto max-w-6xl p-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
