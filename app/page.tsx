import Header from "../components/common/Header";
import Introduction from "../components/main/Introduction";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      <Header />
      <main className="w-full max-w-6xl p-6">
        <Introduction />
      </main>
    </div>
  );
}
