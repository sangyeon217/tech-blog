"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; text: string; level: number };

function getHeadingText(heading: HTMLElement) {
  // rehype-autolink-headings가 붙인 앵커(#) 텍스트 제거
  const headingClone = heading.cloneNode(true) as HTMLElement;
  headingClone.querySelectorAll(".heading-anchor, .sr-only").forEach((element) => element.remove());
  return (headingClone.textContent ?? "").trim();
}

export default function TableOfContents({
  containerSelector = "#post-article",
  minLevel = 1,
  maxLevel = 3,
}: {
  containerSelector?: string;
  minLevel?: number;
  maxLevel?: number;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const initObserver = (tocList: Item[]) => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.01 }
    );

    tocList.forEach((item) => {
      const headingElement = document.getElementById(item.id);
      if (headingElement) observer.observe(headingElement);
    });

    observerRef.current = observer;
  };

  useEffect(() => {
    const root = document.querySelector(containerSelector);
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")) as HTMLElement[];
    const tocList = headings
      .filter((heading) => {
        const level = Number(heading.tagName[1]);
        return heading.id && level >= minLevel && level <= maxLevel;
      })
      .map((heading) => ({
        id: heading.id,
        text: getHeadingText(heading),
        level: Number(heading.tagName[1]),
      }));

    setItems(tocList);
    initObserver(tocList);

    return () => observerRef.current?.disconnect();
  }, [containerSelector, minLevel, maxLevel]);

  const onJump = (id: string) => {
    const headingElement = document.getElementById(id);
    if (!headingElement) return;

    setActiveId(id);
    observerRef.current?.disconnect();

    headingElement.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);

    setTimeout(() => {
      const headings = Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"));
      const tocList = headings
        .filter((h) => {
          const level = Number(h.tagName[1]);
          return h.id && level >= minLevel && level <= maxLevel;
        })
        .map((h) => ({
          id: h.id,
          text: getHeadingText(h),
          level: Number(h.tagName[1]),
        }));

      initObserver(tocList);
    }, 1000);
  };

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-24 hidden lg:block">
      <h2
        className="mb-2 text-xs font-semibold uppercase tracking-wider
        bg-white/80 dark:bg-black/60 backdrop-blur
        text-gray-500 dark:text-gray-400
        py-1"
      >
        Table of Contents
      </h2>
      <ol className="space-y-1.5 text-sm">
        {items.map((item) => {
          const indent = (item.level - minLevel) * 12;
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onJump(item.id)}
                style={{ marginLeft: indent }}
                className={`block w-full truncate rounded-md px-2 py-1 text-left 
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  ${
                    isActive
                      ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                aria-current={isActive ? "location" : undefined}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
