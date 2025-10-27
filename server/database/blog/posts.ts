import type { BlogPost } from "~/types/blog";

const DEMO_AUTHOR_AVATAR =
  "https://api.dicebear.com/7.x/initials/svg?seed=Demo%20Author";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "welcome-to-the-demo-blog",
    slug: "welcome-to-the-demo-blog",
    title: "Welcome to the Demo Blog",
    excerpt:
      "A quick introduction to the sample blog that ships with the portfolio starter.",
    description:
      "Use these demo posts to showcase the blog layout, typography and content building blocks before publishing your own stories.",
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80",
    category: "announcements",
    tags: ["getting-started", "demo"],
    readingTimeMinutes: 4,
    publishedAt: "2024-01-05T09:00:00.000Z",
    updatedAt: "2024-01-12T10:15:00.000Z",
    featured: true,
    author: {
      name: "Demo Author",
      role: "Content Team",
      avatar: DEMO_AUTHOR_AVATAR,
    },
    stats: {
      views: 1240,
      reactions: 38,
    },
    sections: [
      {
        type: "paragraph",
        text: "This starter blog ships with a lightweight dataset so you can explore the admin dashboard, content editor and public layout right away.",
      },
      {
        type: "list",
        title: "What's inside",
        items: [
          "Reusable sections for paragraphs, quotes, and checklists",
          "Sample metadata for categories and tags",
          "Placeholder analytics showing how stats are rendered",
        ],
      },
      {
        type: "paragraph",
        text: "Feel free to replace these posts with your own articles once you are ready to publish.",
      },
    ],
  },
  {
    id: "productivity-checklist",
    slug: "productivity-checklist",
    title: "A Productivity Checklist for Busy Teams",
    excerpt:
      "Use this fictional checklist to demonstrate how actionable content can be presented in the blog.",
    description:
      "Explore how numbered lists, bullet points and highlighted quotes appear within the Nuxt blog theme.",
    coverImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80",
    category: "guides",
    tags: ["checklist", "teamwork"],
    readingTimeMinutes: 6,
    publishedAt: "2024-02-22T08:30:00.000Z",
    featured: false,
    author: {
      name: "Demo Author",
      role: "Content Team",
      avatar: DEMO_AUTHOR_AVATAR,
    },
    stats: {
      views: 980,
      reactions: 24,
    },
    sections: [
      {
        type: "paragraph",
        text: "Nothing here is tied to a real project. The content simply illustrates how practical tips could be formatted in production.",
      },
      {
        type: "heading",
        level: 2,
        title: "Team essentials",
        anchor: "team-essentials",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Start the week with a short planning session",
          "Outline blockers in a shared document",
          "Celebrate wins at the end of each sprint",
        ],
      },
      {
        type: "quote",
        text: "Consistency beats intensity when it comes to productivity habits.",
        attribution: "Demo Playbook",
      },
    ],
  },
  {
    id: "design-system-refresh",
    slug: "design-system-refresh",
    title: "Planning a Design System Refresh",
    excerpt:
      "This imaginary case study shows how to communicate visual updates in long-form content.",
    description:
      "Combine imagery, subheadings and highlighted callouts to guide the reader through design decisions.",
    coverImage:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=2000&q=80",
    category: "case-study",
    tags: ["design", "process"],
    readingTimeMinutes: 7,
    publishedAt: "2024-03-18T11:15:00.000Z",
    updatedAt: "2024-03-20T07:45:00.000Z",
    featured: false,
    author: {
      name: "Demo Author",
      role: "Content Team",
      avatar: DEMO_AUTHOR_AVATAR,
    },
    stats: {
      views: 1455,
      reactions: 52,
    },
    sections: [
      {
        type: "paragraph",
        text: "The refresh starts by documenting the current state of your components and identifying areas that need polish.",
      },
      {
        type: "heading",
        level: 2,
        title: "Highlight the wins",
        anchor: "highlight-the-wins",
      },
      {
        type: "paragraph",
        text: "Use screenshots or visual references to show what improved and where future iterations should focus.",
      },
      {
        type: "paragraph",
        highlight: true,
        text: "This highlighted paragraph draws the reader's attention to a key insight without relying on real project details.",
      },
    ],
  },
];
