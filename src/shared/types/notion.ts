export enum PostType {
  blog = "blog",
  project = "project",
  book = "book",
}

export interface PostBase {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt?: string;
  content?: string;
}

export interface BlogPost extends PostBase {
  excerpt?: string;
}

export interface ProjectPost extends PostBase {
  date_end?: string;
  status?: string;
  techStack?: string[];
  coverImage?: string;
}

export interface BookPost extends PostBase {
  author?: string;
  rating?: number;
}
