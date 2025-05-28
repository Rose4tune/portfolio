import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    published: { type: "boolean", default: true },
    description: { type: "string", required: true },
  },
  computedFields: {
    slug: { type: "string", resolve: (post) => post._raw.flattenedPath },
  },
}));

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    projectType: {
      type: "string",
      required: true,
      options: ["team", "personal"],
    },
    tags: { type: "list", of: { type: "string" }, default: [] },
    published: { type: "boolean", default: true },
    description: { type: "string", required: true },
  },
  computedFields: {
    slug: { type: "string", resolve: (project) => project._raw.flattenedPath },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Post, Project],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
        },
      ],
      [rehypeAutolinkHeadings, { properties: { className: ["anchor"] } }],
    ],
  },
});
