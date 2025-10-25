import type { PostEntry } from "@/lib/contentful";
import PostItem from "./PostItem";

type PostListProps = { posts: PostEntry[] };

export default function PostList({ posts }: PostListProps) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500 dark:text-gray-400 text-sm">
        게시글이 없습니다.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <li key={post.sys.id} className="h-full">
          <PostItem post={post} />
        </li>
      ))}
    </ul>
  );
}
