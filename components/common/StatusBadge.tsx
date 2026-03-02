import type { PostStatus } from "@/lib/contentful";

const STATUS_BG_COLOR: Record<PostStatus, string> = {
  NEW: "bg-red-500 dark:bg-red-600",
  UPDATED: "bg-blue-500 dark:bg-blue-600",
};

const STATUS_BG_COLOR_TRANSLUCENT: Record<PostStatus, string> = {
  NEW: "bg-red-500/90 dark:bg-red-600/90",
  UPDATED: "bg-blue-500/90 dark:bg-blue-600/90",
};

type Props = {
  type: PostStatus;
  className?: string;
  isTranslucent?: boolean;
};

export default function StatusBadge({ type, className = "", isTranslucent = false }: Props) {
  const bgClass = isTranslucent ? STATUS_BG_COLOR_TRANSLUCENT[type] : STATUS_BG_COLOR[type];

  return (
    <span
      role="status"
      className={`inline-flex items-center justify-center text-xs font-semibold text-white px-2 py-0.5 rounded-full ${bgClass} ${className}`}
    >
      {type}
    </span>
  );
}
