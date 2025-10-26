import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import TableOfContents from "./TableOfContents";

type Props = { markdown: string };

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
            prose-pre:rounded-xl prose-pre:shadow-sm prose-pre:overflow-x-auto prose-pre:shadow-sm

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
        </article>
        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </section>
  );
}
