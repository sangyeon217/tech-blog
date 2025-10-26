import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/contentful";
import Error from "@/components/common/Error";
import PostHead from "@/components/post/PostHead";
import PostBody from "@/components/post/PostBody";

type Params = { slug: string };
type Props = { params: Params };

export const revalidate = 60;

export default async function Post({ params }: Props) {
  const { slug } = await params;

  const postRes = await getPostBySlug(slug);
  if (!postRes.success) return <Error />;

  const post = postRes.data;
  if (!post) return notFound();

  return (
    <>
      <PostHead post={post} />
      <PostBody markdown={String(post.fields.content)} />
    </>
  );
}
