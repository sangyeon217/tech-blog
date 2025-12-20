"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>("#post-article");
    if (!target) return;

    const updateProgress = () => {
      const rect = target.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const elementTop = scrollTop + rect.top;
      const elementHeight = target.offsetHeight;
      const viewportHeight = window.innerHeight;

      const header = document.querySelector<HTMLElement>("header");
      const headerHeight = header?.offsetHeight ?? 0;

      const start = elementTop - headerHeight;
      const end = elementTop + elementHeight - viewportHeight + headerHeight;

      if (end <= start) {
        setProgress(100);
        return;
      }

      if (scrollTop <= start) {
        setProgress(0);
      } else if (scrollTop >= end) {
        setProgress(100);
      } else {
        const ratio = (scrollTop - start) / (end - start);
        setProgress(ratio * 100);
      }
    };

    const onScroll = () => {
      updateProgress();
    };

    const onResize = () => {
      updateProgress();
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-60 h-1 bg-neutral-200/70 dark:bg-neutral-800/80">
      <div className="h-full bg-blue-500 dark:bg-blue-400" style={{ width: `${progress}%` }} />
    </div>
  );
}
