import Link from "next/link";
import type { CategoryItem } from "@/lib/contentful";

type Props = { categories: CategoryItem[]; current?: string };

export default function CategoryList({ categories, current }: Props) {
  return (
    <nav className="mb-4 flex flex-wrap gap-2">
      {categories.map((category) => {
        const selected = category.name === current;
        const href =
          category.name === "All" ? "/" : `/?category=${encodeURIComponent(category.name)}`;
        return (
          <Link
            key={category.name}
            href={href}
            aria-current={selected ? "page" : undefined}
            prefetch={false}
            className={[
              "group flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition-colors",
              selected
                ? "bg-black text-white border-black dark:bg-zinc-200 dark:text-black dark:border-zinc-200"
                : "bg-white text-black border-neutral-300 hover:border-black dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-500",
            ].join(" ")}
          >
            <span>{category.name}</span>
            <span
              className={[
                "text-xs px-1.5 rounded-full transition-colors",
                selected
                  ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                  : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 dark:bg-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-600",
              ].join(" ")}
            >
              {category.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
