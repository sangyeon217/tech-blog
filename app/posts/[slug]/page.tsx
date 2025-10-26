import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/contentful";
import PostHead from "@/components/post/PostHead";
import PostBody from "@/components/post/PostBody";

type Params = { slug: string };
type Props = { params: Params };

export const revalidate = 60;

export default async function Post({ params }: Props) {
  const { slug } = await params;

  const postRes = await getPostBySlug(slug);

  if (!postRes.success) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-xl font-semibold">오류가 발생했어요</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          게시글을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
      </main>
    );
  }

  const post = postRes.data;
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-6xl p-6">
      <PostHead post={post} />
      <PostBody markdown={String(post.fields.content)} />
    </main>
  );
}
