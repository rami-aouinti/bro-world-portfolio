export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export type BlogPostSection =
  | {
      type: "heading";
      level: 2 | 3 | 4;
      title: string;
      anchor?: string;
    }
  | {
      type: "paragraph";
      text: string;
      highlight?: boolean;
    }
  | {
      type: "list";
      ordered?: boolean;
      title?: string;
      items: string[];
    }
  | {
      type: "quote";
      text: string;
      attribution?: string;
    }
  | {
      type: "code";
      language: string;
      code: string;
      caption?: string;
    };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  coverImage: string;
  heroImage?: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  author: BlogAuthor;
  stats: {
    views: number;
    reactions: number;
  };
  sections: BlogPostSection[];
}

export interface BlogPostPreview extends Omit<BlogPost, "sections"> {}

export interface BlogPostsMeta {
  total: number;
  categories: { id: string; label: string; count: number }[];
  tags: { id: string; label: string; count: number }[];
  featured: BlogPostPreview | null;
}

export interface BlogPostsResponse {
  data: BlogPostPreview[];
  meta: BlogPostsMeta;
}

export interface BlogPostResponse {
  data: BlogPost;
}
