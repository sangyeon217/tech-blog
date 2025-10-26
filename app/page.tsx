import { getCategories, getPosts } from "@/lib/contentful";
import Error from "@/components/common/Error";
import Introduction from "@/components/home/Introduction";
import CategoryList from "@/components/home/CategoryList";
import PostList from "@/components/home/PostList";

type SearchParams = { category?: string };
type Props = { searchParams?: SearchParams };

export const revalidate = 60;

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const currentCategory = params?.category ?? "All";

  const [categoriesRes, postsRes] = await Promise.all([
    getCategories(),
    getPosts({ category: currentCategory }),
  ]);

  const displayCategories =
    categoriesRes.success && postsRes.success && postsRes.data.items.length > 0;

  return (
    <>
      <Introduction />
      {displayCategories && (
        <CategoryList categories={categoriesRes.data} current={currentCategory} />
      )}
      {postsRes.success ? <PostList posts={postsRes.data.items} /> : <Error />}
    </>
  );
}
