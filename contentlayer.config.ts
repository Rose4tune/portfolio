import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: false },
    projectType: { type: "string", required: false },
    published: { type: "boolean", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    github: { type: "string", required: false },
    demo: { type: "string", required: false },
    image: { type: "string", required: false },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Project],
});
