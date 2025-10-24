import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Introduction from "../components/main/Introduction";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-zinc-50 dark:bg-black transition-colors">
      <Header />
      <main className="w-full max-w-6xl mx-auto p-6 flex-grow">
        <Introduction />
      </main>
      <Footer />
    </div>
  );
}
