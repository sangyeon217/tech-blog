"use client";

import { useEffect, useRef } from "react";

export default function Comment() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", "sangyeon217/tech-blog");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-light");

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
