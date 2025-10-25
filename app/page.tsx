import { getCategories, getPosts } from "@/lib/contentful";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Introduction from "@/components/main/Introduction";
import CategoryList from "@/components/main/CategoryList";
import PostList from "@/components/main/PostList";

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
    <div className="flex min-h-screen flex-col justify-between bg-zinc-50 dark:bg-black transition-colors">
      <Header />
      <main className="w-full max-w-6xl mx-auto p-6 flex-grow">
        <Introduction />

        {displayCategories && (
          <CategoryList categories={categoriesRes.data} current={currentCategory} />
        )}

        {!postsRes.success ? (
          <div className="py-24 text-center text-gray-500 dark:text-gray-400">
            게시글을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
          </div>
        ) : (
          <PostList posts={postsRes.data.items} />
        )}
      </main>
      <Footer />
    </div>
  );
}
