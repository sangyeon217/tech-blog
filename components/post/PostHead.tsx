import Image from "next/image";
import { type PostEntry, getThumbnailUrl, formatPublishedAt } from "@/lib/contentful";
import LikeButton from "./LikeButton";

type Props = { post: PostEntry };

export default function PostHead({ post }: Props) {
  const { title, slug, publishedAt, thumbnail, thumbnailDominantColor } = post.fields;
  const thumbnailUrl = getThumbnailUrl(thumbnail);

  return (
    <header className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{String(title)}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={String(publishedAt)}>
              {formatPublishedAt(String(publishedAt), { dateStyle: "full" })}
            </time>
          </div>
        </div>

        <div className="md:pt-1">
          <LikeButton slug={String(slug)} />
        </div>
      </div>

      {thumbnailUrl && (
        <div
          className="relative w-full h-56 md:h-80 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
          style={{ backgroundColor: String(thumbnailDominantColor) }}
        >
          <Image
            src={thumbnailUrl}
            alt={String(title)}
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-contain"
            priority
          />
        </div>
      )}
    </header>
  );
}
