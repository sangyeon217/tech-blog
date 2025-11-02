"use client";

import React, { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { BsCopy, BsCheck } from "react-icons/bs";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import TableOfContents from "./TableOfContents";
import Comment from "./Comment";
import { useClipboard } from "@/hooks/useClipboard";

const CODE_LANG_LABEL_MAP: Record<string, string> = {
  typescript: "TS",
  ts: "TS",
  javascript: "JS",
  js: "JS",
  tsx: "TSX",
  jsx: "JSX",
  bash: "SH",
  sh: "SH",
  shell: "SH",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  md: "MD",
  markdown: "MD",
  html: "HTML",
  css: "CSS",
  python: "PY",
  py: "PY",
  java: "JAVA",
};

type Props = { markdown: string };
type CodeProps = { className?: string };
type CodeElement = React.ReactElement<CodeProps>;

const components: Components = {
  a: ({ href = "", children, ...props }) => {
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ node, ...props }) => <table className="custom-table" {...props} />,
  pre: ({ node, ...props }) => <PreWithCopy {...props} />,
};

const detailsSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary"],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    details: [
      ...((defaultSchema.attributes?.details as string[] | undefined) ?? []),
      "open",
      "className",
    ],
    summary: [...((defaultSchema.attributes?.summary as string[] | undefined) ?? []), "className"],
  },
};

const extractLangLabel = (node: React.ReactNode): string | null => {
  if (!React.isValidElement<CodeProps>(node)) return null;
  const className = node.props.className ?? "";
  const language = className.match(/language-([a-z0-9+#-]+)/i);
  if (!language) return null;
  const raw = language[1].toLowerCase();
  return CODE_LANG_LABEL_MAP[raw] ?? raw.toUpperCase();
};

const PreWithCopy = (props: React.HTMLAttributes<HTMLPreElement>) => {
  const preRef = useRef<HTMLPreElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  const firstChild = React.Children.toArray(props.children)[0] as CodeElement | undefined;
  const langLabel = useMemo(() => (firstChild ? extractLangLabel(firstChild) : null), [firstChild]);

  useClipboard({
    btnRef,
    getText: () => preRef.current?.querySelector("code")?.textContent ?? "",
    onCopied: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
    onError: () => alert("Failed to copy. Please try again!"),
  });

  return (
    <pre
      ref={preRef}
      {...props}
      className={[props.className, "relative group pt-7 pr-12 pb-3 mb-4"].filter(Boolean).join(" ")}
    >
      {langLabel && (
        <span
          className="pointer-events-none absolute left-3 top-3 select-none
          rounded-md px-1.5 py-[2px] text-[10px] font-medium leading-none
          bg-white/10 text-gray-100 ring-1 ring-white/10
          dark:bg-white/10 backdrop-blur-sm"
        >
          {langLabel}
        </span>
      )}

      <button
        ref={btnRef}
        type="button"
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy code"}
        className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md
        px-2 py-1 text-xs font-medium
        bg-white/10 text-gray-200 ring-1 ring-white/15
        cursor-pointer hover:bg-white/20 hover:scale-105 active:scale-95
        transition-transform transition-colors duration-150
        opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {copied ? <BsCheck /> : <BsCopy />}
        {copied ? "Copied!" : "Copy"}
      </button>
      {props.children}
    </pre>
  );
};

export default function PostBody({ markdown }: Props) {
  return (
    <section className="mt-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article
          id="post-article"
          className={`
            prose prose-neutral dark:prose-invert max-w-none custom-tasklist 

            /* Headings */
            prose-headings:font-extrabold prose-headings:relative prose-headings:tracking-tight
            prose-headings:[&:hover_.heading-anchor]:opacity-100
            prose-headings:[&_.heading-anchor:hover]:opacity-100
            prose-headings:[scroll-margin-top:calc(var(--header-h,64px)+12px)]
            prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-6
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-5
            prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mb-4
            prose-h4:text-lg md:prose-h4:text-xl prose-h4:mb-3
            prose-h5:text-base md:prose-h5:text-lg prose-h5:mb-2
            prose-h6:text-sm md:prose-h6:text-base prose-h6:mb-2 

            /* Blockquote */
            prose-blockquote:border-l-4 prose-blockquote:pl-4

            /* Links */
            prose-a:underline-offset-4 hover:prose-a:text-blue-600

            /* Inline code */
            prose-code:before:content-none prose-code:after:content-none
            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
            prose-code:text-pink-600 dark:prose-code:text-pink-400
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800

            /* Code blocks */
            prose-pre:bg-[#0f172a] prose-pre:text-gray-100
            prose-pre:rounded-xl prose-pre:shadow-sm prose-pre:overflow-x-auto
            prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:[overflow-wrap:anywhere]

            /* Images */
            prose-img:rounded-xl
            prose-img:max-w-full prose-img:h-auto
            prose-img:mx-auto prose-img:my-4
        `}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              [rehypeSanitize, detailsSchema],
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "append",
                  properties: {
                    className: [
                      "heading-anchor",
                      "ml-2",
                      "no-underline",
                      "opacity-0",
                      "transition-opacity",
                      "duration-150",
                      "text-gray-400",
                      "hover:text-gray-600",
                      "select-none",
                    ],
                  },
                  content: () => ({
                    type: "text",
                    value: "#",
                  }),
                },
              ],
              [rehypeHighlight, { ignoreMissing: true }],
            ]}
            components={components}
          >
            {markdown}
          </ReactMarkdown>

          <hr className="my-12" />

          <section id="comments" aria-label="Comments" className="not-prose mt-8 max-w-3xl">
            <Comment />
          </section>
        </article>
        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </section>
  );
}
