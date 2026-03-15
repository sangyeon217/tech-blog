"use client";

import { MessageCircle } from "lucide-react";

export default function CommentButton() {
  const scrollToComments = () => {
    const commentElement = document.getElementById("comments");
    if (!commentElement) return;

    commentElement.scrollIntoView({ behavior: "smooth", block: "start" });
    commentElement.setAttribute("tabindex", "-1");
    commentElement.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={scrollToComments}
      aria-label="댓글로 이동"
      className="inline-flex items-center gap-2 px-3 py-1.5
        rounded-full border text-sm transition-all cursor-pointer
        border-gray-300 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <MessageCircle aria-hidden="true" className="w-4 h-4 text-gray-500 dark:text-gray-300" />
      <span>댓글</span>
    </button>
  );
}
