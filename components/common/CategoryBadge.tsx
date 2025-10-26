"use client";

import Link from "next/link";

type Props = {
  category: string;
  classes?: string;
  prefetch?: boolean;
};

export default function CategoryBadge({ category, classes, prefetch = false }: Props) {
  return (
    <Link
      href={`/?category=${encodeURIComponent(category)}`}
      prefetch={prefetch}
      aria-label={`카테고리 ${category}로 이동`}
      className={classes}
    >
      {category}
    </Link>
  );
}
