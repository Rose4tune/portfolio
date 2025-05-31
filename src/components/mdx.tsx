import { MDXRemote } from "next-mdx-remote/rsc";
import { cn } from "@/lib/utils";

interface MdxProps {
  code: string;
  className?: string;
}

export function Mdx({ code, className }: MdxProps) {
  return (
    <div className={cn("prose dark:prose-invert", className)}>
      <MDXRemote source={code} />
    </div>
  );
}
