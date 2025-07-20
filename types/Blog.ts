//types/Blog.ts

export type Blog = {
  id: string;
  title: string;
  content: string;
  image_link: string | null;
  published_at: string | null;
  created_at: string;
  uid: string;
  updated_at: string;
  published: boolean;
};

export interface LocalBlog extends Blog {
  category: string;
  categoryColor?: string;
  excerpt: string;
  date: string;
}