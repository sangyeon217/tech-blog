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

  const rollback = (prevLiked: boolean, prevCount: number | null) => {
    setLiked(prevLiked);
    setCount(prevCount);
    if (prevLiked) {
      localStorage.setItem(storageKey, "1");
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  const toggleLike = async () => {
    if (loading) return;

    const prevLiked = liked;
    const prevCount = count;

    if (!liked) {
      setLiked(true);
      setCount((c) => (typeof c === "number" ? c + 1 : 1));
      localStorage.setItem(storageKey, "1");
      setLoading(true);

      try {
        const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("Failed to like");

        const data = await res.json();
        setCount(data.count ?? 0);
      } catch {
        rollback(prevLiked, prevCount);
      } finally {
        setLoading(false);
      }

      return;
    }

    setLiked(false);
    setCount((c) => (typeof c === "number" ? Math.max(0, c - 1) : 0));
    localStorage.removeItem(storageKey);
    setLoading(true);

    try {
      const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to unlike");

      const data = await res.json();
      setCount(data.count ?? 0);
    } catch {
      rollback(prevLiked, prevCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
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
        {loading ? "..." : count && count > 0 ? count : "좋아요"}
      </span>

      <span className="sr-only">{liked ? "이미 좋아요를 눌렀습니다" : "좋아요 누르기"}</span>
    </button>
  );
}
