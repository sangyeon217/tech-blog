import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getThumbnailUrl } from "@/lib/contentful";
import Error from "@/components/common/Error";
import PostHead from "@/components/post/PostHead";
import PostBody from "@/components/post/PostBody";

type Params = { slug: string };
type Props = { params: Params };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const postRes = await getPostBySlug(slug);

  if (!postRes.success || !postRes.data) {
    return {
      title: "게시글을 찾을 수 없습니다 - Sangyeon's Tech Blog",
      description: "요청하신 게시글이 존재하지 않습니다.",
    };
  }

  const post = postRes.data;
  const { title, description, thumbnail } = post.fields;

  const ogTitle = `${title} - Sangyeon's Tech Blog`;
  const ogDescription = String(description ?? "상연의 기술 블로그 입니다.");
  const ogImage = getThumbnailUrl(thumbnail) ?? "/images/profile.jpeg";
  const ogUrl = `https://sangyeon.vercel.app/posts/${slug}`;

  return {
    title: ogTitle,
    description: ogDescription,
    openGraph: {
      type: "article",
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    alternates: { canonical: ogUrl },
  };
}

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
