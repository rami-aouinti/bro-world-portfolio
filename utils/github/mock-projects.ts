import type { GithubProjectLanguagesResponse } from "~/types/github";

type MockGithubProject = {
  slug: string;
  name: string;
  description: string;
  url: string;
  homepage?: string;
  topics: string[];
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
  languages: GithubProjectLanguagesResponse;
};

const MOCK_GITHUB_PROJECTS: MockGithubProject[] = [
  {
    slug: "bro-world-portfolio",
    name: "bro-world-portfolio",
    description:
      "Nuxt 4 portfolio showcasing internationalisation, content tooling, and animated UI components.",
    url: "https://github.com/rami-aouinti/bro-world-portfolio",
    homepage: "https://bro-world.dev",
    topics: ["nuxt", "portfolio", "vue", "vuetify"],
    stars: 128,
    forks: 14,
    watchers: 9,
    openIssues: 2,
    createdAt: "2024-01-12T10:15:00.000Z",
    updatedAt: "2025-01-10T08:45:00.000Z",
    languages: {
      TypeScript: 58000,
      Vue: 19000,
      SCSS: 9000,
      Markdown: 5000,
    },
  },
  {
    slug: "bro-world-backend",
    name: "bro-world-backend",
    description:
      "Symfony API platform powering the portfolio CMS with JWT authentication and content storage.",
    url: "https://github.com/rami-aouinti/bro-world-backend",
    topics: ["symfony", "api", "php", "backend"],
    stars: 86,
    forks: 11,
    watchers: 7,
    openIssues: 1,
    createdAt: "2023-11-03T14:00:00.000Z",
    updatedAt: "2024-12-18T17:30:00.000Z",
    languages: {
      PHP: 72000,
      Twig: 8000,
      "Shell": 3000,
      Dockerfile: 2000,
    },
  },
  {
    slug: "nuxt-content-toolkit",
    name: "nuxt-content-toolkit",
    description:
      "Reusable Nuxt modules and composables for managing localized content and developer tooling.",
    url: "https://github.com/rami-aouinti/nuxt-content-toolkit",
    homepage: "https://toolkit.bro-world.dev",
    topics: ["nuxt", "tooling", "localization", "content"],
    stars: 54,
    forks: 6,
    watchers: 4,
    openIssues: 0,
    createdAt: "2024-05-22T09:20:00.000Z",
    updatedAt: "2024-11-06T11:10:00.000Z",
    languages: {
      TypeScript: 36000,
      JavaScript: 12000,
      JSON: 4000,
    },
  },
];

function computeLanguageShare(languages: GithubProjectLanguagesResponse) {
  const total = Object.values(languages).reduce((sum, value) => sum + value, 0);

  return Object.entries(languages)
    .map(([name, value]) => ({
      name,
      share: total ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.share - a.share);
}

export function getMockGithubProjects() {
  return MOCK_GITHUB_PROJECTS.map((project) => ({
    slug: project.slug,
    name: project.name,
    description: project.description,
    url: project.url,
    homepage: project.homepage ?? null,
    topics: project.topics,
    stars: project.stars,
    forks: project.forks,
    updatedAt: project.updatedAt,
    primaryLanguage: Object.keys(project.languages)[0] ?? null,
  }));
}

export function getMockGithubProjectDetail(slug: string) {
  const project = MOCK_GITHUB_PROJECTS.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  return {
    slug: project.slug,
    name: project.name,
    description: project.description,
    url: project.url,
    homepage: project.homepage ?? null,
    topics: project.topics,
    stars: project.stars,
    forks: project.forks,
    openIssues: project.openIssues,
    watchers: project.watchers,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    primaryLanguage: Object.keys(project.languages)[0] ?? null,
    languages: computeLanguageShare(project.languages),
  };
}
