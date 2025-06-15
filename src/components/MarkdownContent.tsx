import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ src, alt = "", ...props }) {
            if (!src || typeof src !== "string") return null;

            // 노션 이미지 URL 처리
            const notionImageUrl =
              src.startsWith(
                "https://prod-files-secure.s3.us-west-2.amazonaws.com/"
              ) || src.startsWith("https://s3.us-west-2.amazonaws.com/");

            if (notionImageUrl) {
              return (
                <div className="relative w-full my-4">
                  <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={400}
                    className="rounded-md border max-w-full h-auto"
                    style={{ objectFit: "contain" }}
                    priority={false}
                  />
                </div>
              );
            }

            // 일반 이미지 URL 처리
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="my-4 rounded-md border max-w-full h-auto"
                loading="lazy"
                {...props}
              />
            );
          },
          div: ({ className, children, ...props }) => {
            if (className?.includes("notion-column-list")) {
              const match = className.match(/notion-columns-(\d+)/);
              const columns = match ? parseInt(match[1], 10) : 1;
              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: "16px",
                  }}
                  {...props}
                >
                  {children}
                </div>
              );
            } else if (className?.includes("notion-column-item")) {
              return <div {...props}>{children}</div>;
            }
            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
