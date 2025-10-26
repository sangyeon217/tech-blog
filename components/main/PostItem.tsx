import Image from "next/image";
import Link from "next/link";
import { type PostEntry, getThumbnailUrl, formatPublishedAt } from "@/lib/contentful";

type Props = { post: PostEntry };

export default function PostItem({ post }: Props) {
  const { title, slug, description, publishedAt } = post.fields;
  const categories = (post.fields.category ?? []) as string[];
  const thumbnailUrl = getThumbnailUrl(post.fields.thumbnail);

  return (
    <article
      className="relative h-full rounded-xl overflow-hidden 
      border border-gray-200 bg-white shadow-sm 
      transition-all duration-200
      hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300
      dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <Link
        href={`/posts/${slug}`}
        aria-label={`${title} 포스트로 이동`}
        className="absolute inset-0 z-10 pointer-events-auto
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white
        dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
        prefetch={false}
      />
      <div className="relative z-20 pointer-events-none">
        <div className="relative h-[200px] w-full bg-gray-50 dark:bg-zinc-800">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={String(title)}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-zinc-500">
              No Thumbnail
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
            {String(title)}
          </h3>

          <div className="mt-2 min-h-[2.5rem]">
            {description && (
              <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                {String(description)}
              </p>
            )}
          </div>

          <div className="mt-3 min-h-[1.5rem] flex flex-wrap gap-1">
            {Array.isArray(categories) &&
              categories.length > 0 &&
              categories.map((category) => {
                const href = `/?category=${encodeURIComponent(category)}`;
                return (
                  <Link
                    key={category}
                    href={href}
                    prefetch={false}
                    className="relative z-30 pointer-events-auto inline-flex h-6 items-center rounded-md px-2 text-xs leading-none
                      text-zinc-700 bg-zinc-100 hover:bg-zinc-200
                      dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700
                      transition-colors"
                  >
                    {category}
                  </Link>
                );
              })}
          </div>

          <time
            dateTime={String(publishedAt)}
            className="mt-3 block text-xs text-zinc-500 dark:text-zinc-400"
          >
            {formatPublishedAt(String(publishedAt))}
          </time>
        </div>
      </div>
    </article>
  );
}
