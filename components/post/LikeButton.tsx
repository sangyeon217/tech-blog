"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";

type Props = { slug: string };

export default function LikeButton({ slug }: Props) {
  const storageKey = useMemo(() => `liked:${slug}`, [slug]);
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setCount(data.count ?? 0);
      } finally {
        setLoading(false);
      }
      setLiked(localStorage.getItem(storageKey) === "1");
    };
    init();
  }, [slug, storageKey]);

  const rollbackLike = () => {
    setLiked(false);
    localStorage.removeItem(storageKey);
  };

  const onLike = async () => {
    if (liked) return;

    setLiked(true);
    setCount((c) => (typeof c === "number" ? c + 1 : 1));
    localStorage.setItem(storageKey, "1");

    try {
      const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: "POST",
      });

      if (!res.ok) {
        rollbackLike();
        return;
      }

      const data = await res.json();
      setCount(data.count ?? 0);
    } catch {
      rollbackLike();
    }
  };

  return (
    <button
      onClick={onLike}
      disabled={liked || loading}
      aria-label="좋아요"
      className={`inline-flex items-center gap-2 px-3 py-1.5 
        rounded-full border text-sm transition-all cursor-pointer 
        ${
          liked
            ? "border-red-300 bg-red-100 text-red-600 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400"
            : "border-gray-300 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        }`}
    >
      <Heart
        aria-hidden="true"
        className={`w-4 h-4 transition-transform duration-200 
          ${
            liked ? "scale-125 text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-300"
          }`}
        strokeWidth={1.8}
        fill={liked ? "currentColor" : "none"}
      />

      <span className={`transition-transform duration-200 ${liked ? "scale-110" : ""}`}>
        {loading ? "..." : count ?? 0}
      </span>

      <span className="sr-only">{liked ? "이미 좋아요를 눌렀습니다" : "좋아요 누르기"}</span>
    </button>
  );
}
