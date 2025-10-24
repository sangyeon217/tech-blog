import Introduction from "../components/main/Introduction";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      <main className="w-full max-w-6xl p-6">
        <Introduction />
      </main>
    </div>
  );
}
