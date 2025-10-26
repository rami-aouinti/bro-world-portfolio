import type { BlogPost } from "~/types/blog";

const AUTHOR_AVATAR = "https://avatars.githubusercontent.com/u/130002255?v=4";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "architecture-evolution",
    slug: "scaling-nuxt-architecture",
    title: "Scaling a Nuxt 3 Architecture for Global Content Delivery",
    excerpt:
      "Lessons learned from rethinking a Nuxt 3 monorepo to support localized content, caching strategies, and CI pipelines.",
    description:
      "A deep dive into the architectural decisions that helped us scale Nuxt 3 applications for multilingual audiences without compromising developer velocity.",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1526378722443-4aa0e0280927?auto=format&fit=crop&w=2000&q=80",
    category: "architecture",
    tags: ["nuxt", "cdn", "devops"],
    readingTimeMinutes: 9,
    publishedAt: "2024-03-18T09:00:00.000Z",
    updatedAt: "2024-04-02T10:15:00.000Z",
    featured: true,
    author: {
      name: "Rami Aouinti",
      role: "Lead Software Engineer",
      avatar: AUTHOR_AVATAR,
    },
    stats: {
      views: 4820,
      reactions: 168,
    },
    sections: [
      {
        type: "paragraph",
        text: "Internationalising the Bro-World platform forced us to revisit early technical decisions. We needed an architecture that could serve localized assets quickly without duplicating deployments.",
      },
      {
        type: "heading",
        level: 2,
        title: "Diagnosing the bottlenecks",
        anchor: "diagnosing-the-bottlenecks",
      },
      {
        type: "paragraph",
        text: "Our initial setup relied heavily on server-side rendering, which added noticeable latency for visitors outside Europe. We profiled requests to understand how middleware, API calls, and rendering competed for resources.",
      },
      {
        type: "list",
        ordered: true,
        title: "Key metrics we tracked",
        items: [
          "Time-to-first-byte across five regions",
          "Cache hit ratio on the CDN edge",
          "Cold start frequency for lambda functions",
        ],
      },
      {
        type: "paragraph",
        text: "Instrumenting observability early meant we could quantify the impact of every improvement. From there, it was time to redesign deployment boundaries.",
      },
      {
        type: "heading",
        level: 2,
        title: "Restructuring the delivery pipeline",
        anchor: "restructuring-the-delivery-pipeline",
      },
      {
        type: "paragraph",
        text: "We separated static content from dynamic responses and leaned into edge caching. Nuxt's Nitro server made it painless to export island components and hydrate them selectively on the client.",
      },
      {
        type: "quote",
        text: "Optimise for change, not perfection. The architecture should make iterations cheaper, not lock you into a single choice.",
        attribution: "Team retrospective note",
      },
      {
        type: "code",
        language: "bash",
        caption: "Preview build pipeline",
        code: "pnpm install\npnpm lint\npnpm test\npnpm build --filter web --preset=production",
      },
      {
        type: "paragraph",
        text: "By the time we rolled out the new pipeline, deployment times dropped by 43% and new locales shipped in hours instead of days.",
        highlight: true,
      },
    ],
  },
  {
    id: "observability-playbook",
    slug: "observability-playbook-for-scale",
    title: "Building an Observability Playbook Before the Incident Happens",
    excerpt:
      "A pragmatic approach to logging, tracing, and alerting that keeps distributed systems debuggable as the team grows.",
    description:
      "Implementing observability guardrails across services ensured that onboarding engineers could ship features confidently without breaking production.",
    coverImage:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=80",
    category: "platform",
    tags: ["observability", "logging", "sre"],
    readingTimeMinutes: 7,
    publishedAt: "2024-02-11T08:00:00.000Z",
    author: {
      name: "Rami Aouinti",
      role: "Lead Software Engineer",
      avatar: AUTHOR_AVATAR,
    },
    stats: {
      views: 3714,
      reactions: 142,
    },
    sections: [
      {
        type: "paragraph",
        text: "Every incident debrief surfaced the same theme: we lacked a single source of truth for runtime behaviour. The playbook we created now lives alongside the code and keeps the team aligned.",
      },
      {
        type: "heading",
        level: 2,
        title: "Start with critical user journeys",
        anchor: "critical-user-journeys",
      },
      {
        type: "paragraph",
        text: "We mapped key scenarios—registration, checkout, and workspace management—to make sure telemetry covered the paths that generate revenue.",
      },
      {
        type: "list",
        items: [
          "Define canonical log formats with request identifiers",
          "Adopt distributed tracing that spans Nuxt server routes and background jobs",
          "Document alert runbooks with owner, severity, and mitigation steps",
        ],
      },
      {
        type: "paragraph",
        text: "This foundation allowed us to automate regression detection and create dashboards that the product team actually uses.",
      },
      {
        type: "quote",
        text: "If the dashboard requires a senior engineer to explain it, it will never be used during an incident.",
        attribution: "Platform engineering guidelines",
      },
      {
        type: "paragraph",
        text: "Once the scaffolding was in place, we ran game days to validate alarms and to rehearse our response process.",
      },
    ],
  },
  {
    id: "ai-assisted-ui",
    slug: "shipping-ai-assisted-interfaces",
    title: "Shipping AI-assisted Interfaces Without Overwhelming the User",
    excerpt:
      "Design principles we applied when integrating AI copilots into Bro-World's productivity tools.",
    description:
      "AI features must feel like collaboration, not automation. Here is how we aligned product, design, and engineering to deliver it.",
    coverImage:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80",
    category: "product",
    tags: ["ai", "ux", "product"],
    readingTimeMinutes: 6,
    publishedAt: "2023-12-09T10:45:00.000Z",
    author: {
      name: "Rami Aouinti",
      role: "Lead Software Engineer",
      avatar: AUTHOR_AVATAR,
    },
    stats: {
      views: 2985,
      reactions: 101,
    },
    sections: [
      {
        type: "paragraph",
        text: "We experimented with prompt-driven UI flows that adapt based on the user's intent. The secret was to keep the first interaction obvious and add depth progressively.",
      },
      {
        type: "heading",
        level: 2,
        title: "Designing for trust",
        anchor: "designing-for-trust",
      },
      {
        type: "paragraph",
        text: "Every suggestion includes a clear explanation of why it appeared. People can accept, reject, or fine-tune results without leaving the current context.",
      },
      {
        type: "paragraph",
        text: "We also instrumented telemetry to capture when prompts feel confusing so the product team can iterate quickly.",
      },
      {
        type: "list",
        title: "Guardrails we shipped",
        items: [
          "Context-aware onboarding that fades away after repeated success",
          "Immediate feedback options to report irrelevant suggestions",
          "A safe-mode toggle that reduces AI initiative in sensitive workflows",
        ],
      },
    ],
  },
  {
    id: "performance-case-study",
    slug: "improving-performance-with-edge-rendering",
    title: "Improving Performance With Edge Rendering and Smart Caching",
    excerpt:
      "A case study detailing how we moved personalised dashboards to the edge to reduce latency for remote teams.",
    description:
      "Edge rendering let us deliver dynamic dashboards with cached data layers, keeping latency under 90ms globally.",
    coverImage:
      "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1600&q=80",
    category: "performance",
    tags: ["edge", "performance", "caching"],
    readingTimeMinutes: 8,
    publishedAt: "2023-10-21T07:30:00.000Z",
    author: {
      name: "Rami Aouinti",
      role: "Lead Software Engineer",
      avatar: AUTHOR_AVATAR,
    },
    stats: {
      views: 4126,
      reactions: 156,
    },
    sections: [
      {
        type: "paragraph",
        text: "We analysed where requests spent time and realised most of the delay happened before our application even started executing.",
      },
      {
        type: "heading",
        level: 2,
        title: "Profiling the baseline",
        anchor: "profiling-the-baseline",
      },
      {
        type: "paragraph",
        text: "Synthetic monitoring told a different story than real traffic. Edge rendering brought those numbers together by removing transcontinental hops.",
      },
      {
        type: "quote",
        text: "Caching is only effective when you know what not to cache.",
        attribution: "Performance review",
      },
      {
        type: "paragraph",
        text: "We implemented background regeneration for expensive queries so that users always see fresh data without paying the cold start cost.",
      },
    ],
  },
];

export function findBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}
