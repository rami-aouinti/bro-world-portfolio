import type { GithubProjectPerformance } from "~/types/github";

const PROJECT_PERFORMANCE: Record<string, GithubProjectPerformance> = {
  "bro-world-portfolio": {
    generatedAt: "2025-01-10T08:45:00.000Z",
    reportUrl: "https://pagespeed.web.dev/analysis/https-bro-world-dev/",
    mobile: {
      performance: 90,
      accessibility: 100,
      bestPractices: 96,
      seo: 100,
    },
    desktop: {
      performance: 90,
      accessibility: 100,
      bestPractices: 96,
      seo: 100,
    },
  },
  "nuxt-content-toolkit": {
    generatedAt: "2024-11-06T11:10:00.000Z",
    reportUrl: "https://pagespeed.web.dev/analysis/https-toolkit-bro-world-dev/",
    mobile: {
      performance: 88,
      accessibility: 98,
      bestPractices: 96,
      seo: 100,
    },
    desktop: {
      performance: 96,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    },
  },
};

export function getProjectPerformance(slug: string): GithubProjectPerformance | null {
  return PROJECT_PERFORMANCE[slug] ?? null;
}
