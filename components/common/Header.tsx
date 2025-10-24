import Link from "next/link";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 
      bg-white/90 dark:bg-zinc-900/80 
      backdrop-blur 
      border-b border-gray-200 dark:border-zinc-700 
      transition-colors"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="relative text-lg font-bold 
          text-gray-800 dark:text-gray-100 
          transition-all duration-500 
          hover:text-transparent hover:bg-clip-text 
          hover:bg-gradient-to-r 
          from-emerald-400 via-sky-400 to-indigo-500"
        >
          Sangyeon&apos;s Tech Blog
        </Link>

        <div
          className="flex items-center gap-4 text-2xl 
          text-gray-700 dark:text-gray-300 
          transition-colors"
        >
          <a
            href="https://github.com/sangyeon217"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <AiFillGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/sangyeon-song-301383202/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <AiFillLinkedin />
          </a>
        </div>
      </div>
    </header>
  );
}
