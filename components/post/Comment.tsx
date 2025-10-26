"use client";

import { useEffect, useRef } from "react";

const getUtterancesTheme = (isDark = false) => (isDark ? "github-dark" : "github-light");

export default function Comment() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.querySelector("iframe.utterances-frame")) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("repo", "sangyeon217/tech-blog");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute(
      "theme",
      getUtterancesTheme(window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    ref.current.appendChild(script);

    // 시스템 테마 변경 시 Utterances 테마 전환
    const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const iframe = ref.current?.querySelector<HTMLIFrameElement>("iframe.utterances-frame");
      iframe?.contentWindow?.postMessage(
        { type: "set-theme", theme: getUtterancesTheme(e.matches) },
        "https://utteranc.es"
      );
    };

    themeMediaQuery.addEventListener("change", onChange);
    return () => themeMediaQuery.removeEventListener("change", onChange);
  }, []);

  return <div ref={ref} />;
}
