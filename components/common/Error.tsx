"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AiOutlineReload } from "react-icons/ai";

export default function Error() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    startTransition(() => router.refresh());
  };

  return (
    <div role="alert" aria-live="polite" className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">오류가 발생했어요</h1>
        <button
          type="button"
          onClick={handleRetry}
          disabled={isPending}
          title="다시 시도"
          className="rounded-full border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-zinc-900"
        >
          <AiOutlineReload
            size={18}
            className={`transition-transform duration-300 ${
              isPending ? "animate-spin text-gray-400" : ""
            }`}
          />
        </button>
      </div>
      <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        콘텐츠를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
    </div>
  );
}
