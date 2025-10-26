import Image from "next/image";
import { type PostEntry, getThumbnailUrl, formatPublishedAt } from "@/lib/contentful";

type Props = { post: PostEntry };

export default function PostHead({ post }: Props) {
  const { title, category, publishedAt, thumbnail } = post.fields;
  const categories = category ?? [];
  const thumbnailUrl = getThumbnailUrl(thumbnail);

  return (
    <header className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{String(title)}</h1>

        {Array.isArray(categories) && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <span
                key={category}
                aria-label={`카테고리 ${category}`}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700"
              >
                <span aria-hidden="true">#</span>
                {category}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={String(publishedAt)}>
            {formatPublishedAt(String(publishedAt), { dateStyle: "full" })}
          </time>
        </div>
      </div>

      {thumbnailUrl && (
        <div className="relative w-full h-56 md:h-80 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <Image
            src={thumbnailUrl}
            alt={String(title)}
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>
      )}
    </header>
  );
}
