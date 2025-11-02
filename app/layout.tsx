import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";
import BuyMeCoffeeWidget from "@/components/common/BuyMeCoffeeWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sangyeon's Tech Blog",
  description: "상연의 기술 블로그 입니다.",
  openGraph: {
    type: "website",
    title: "Sangyeon's Tech Blog",
    description: "상연의 기술 블로그 입니다.",
    url: "https://sangyeon.vercel.app",
    images: [{ url: "/images/profile.jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sangyeon's Tech Blog",
    description: "상연의 기술 블로그 입니다.",
    images: ["/images/profile.jpeg"],
  },
  alternates: { canonical: "https://sangyeon.vercel.app" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className="flex min-h-screen flex-col dark:bg-black transition-colors">
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}

        <Suspense>
          <AnalyticsTracker />
        </Suspense>

        <Header />
        <main className="flex-1 w-full mx-auto max-w-6xl p-6">{children}</main>
        <Footer />

        <BuyMeCoffeeWidget />
      </body>
    </html>
  );
}
