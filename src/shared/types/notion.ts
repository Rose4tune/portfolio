export enum PostType {
  blog = "blog",
  project = "project",
  book = "book",
}

export interface PostBase {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  content?: string;
}

export interface BlogPost extends PostBase {
  date: string;
  excerpt?: string;
}

export interface ProjectPost extends PostBase {
  date: object;
  date_end?: string;
  status?: string;
  techStack?: string[];
}

export interface BookPost extends PostBase {
  author?: string;
  rating?: number;
}
