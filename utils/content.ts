import type { ContentRecord } from "~/types/content";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "~/utils/i18n/locales";

export type LocalizedContentRecord = Record<LocaleCode, ContentRecord>;

function createMockContentRecord(record: ContentRecord): ContentRecord {
  const navlinks = record.navlinks.map((link) => ({
    ...link,
  }));

  const profile = {
    ...record.profile,
    firstname: "Alex",
    lastname: "Dev",
    role: "Fullstack Developer",
  };

  const hero = {
    badge: "Development preview",
    headline: "This is mock hero content",
    subline: "Placeholder copy is shown while working in development mode.",
  };

  const service = {
    label: record.service.label,
    headline: "Mock service catalogue",
    subline: "These entries illustrate the layout while the real content is hidden.",
    services: record.service.services.map((item, index) => ({
      ...item,
      name: `Service ${index + 1}`,
      description: `Description for mock service ${index + 1}.`,
      thumbnails: item.thumbnails ?? "",
    })),
  };

  const work = {
    label: record.work.label,
    headline: "Highlighted mock projects",
    subline: "Use these placeholder projects to validate UI behaviour locally.",
    works: record.work.works.map((item, index) => ({
      ...item,
      name: `Project ${index + 1}`,
      description: `Description for mock project ${index + 1}.`,
      live_demo: "#",
      type: "Internal project",
    })),
  };

  const about = {
    label: record.about.label,
    introduce: [
      "This biography is mock data rendered in development builds.",
      "Replace it with your story by editing the production dataset.",
    ],
    hobbies: ["Reading documentation", "Experimenting with prototypes"],
  };

  const cta = {
    label: record.cta.label,
    description: "Mock call-to-action content shown during development.",
  };

  const skills = {
    label: record.skills.label,
    headline: "Mock skills overview",
    subline: "These placeholder skills help you iterate on the UI.",
    categories: record.skills.categories.map((category, categoryIndex) => ({
      ...category,
      name: `Category ${categoryIndex + 1}`,
      description: `Description for mock category ${categoryIndex + 1}.`,
      skills: category.skills.map((skill, skillIndex) => ({
        ...skill,
        name: `Skill ${skillIndex + 1}`,
        level: "Intermediate",
        summary: `Summary for mock skill ${skillIndex + 1}.`,
        projects: skill.projects ?? [],
      })),
    })),
    languages: record.skills.languages?.map((_, index) => `Language ${index + 1}`) ?? [],
    languageProficiencies:
      record.skills.languageProficiencies?.map((item, index) => ({
        ...item,
        name: `Language ${index + 1}`,
        proficiency: item.proficiency,
      })) ?? [],
  };

  const experiences = {
    label: record.experiences.label,
    headline: "Mock professional experience",
    positions: record.experiences.positions.map((position, index) => ({
      ...position,
      role: `Role ${index + 1}`,
      company: `Company ${index + 1}`,
      timeframe: "Jan 2020 — Present",
      achievements: position.achievements.map(
        (_, achievementIndex) => `Achievement ${index + 1}.${achievementIndex + 1} placeholder.`,
      ),
    })),
  };

  const education = {
    label: record.education.label,
    headline: "Mock education history",
    schools: record.education.schools.map((school, index) => ({
      ...school,
      degree: `Degree ${index + 1}`,
      institution: `Institution ${index + 1}`,
      timeframe: "2015 — 2019",
      details: `Details about mock education entry ${index + 1}.`,
    })),
  };

  const sourceContact = record.contact ?? {
    label: "Contact",
    headline: "Mock contact information",
    contact: [
      {
        degree: "Email",
        institution: "example@dev.local",
        timeframe: "Anytime",
        details: "Mock contact entry available in development only.",
      },
    ],
  };

  const contact = {
    label: sourceContact.label,
    headline: "Mock contact information",
    contact: sourceContact.contact.map((entry, index) => ({
      ...entry,
      degree: `Channel ${index + 1}`,
      institution: `Contact option ${index + 1}`,
      timeframe: "Always available",
      details: `Mock contact details ${index + 1}.`,
    })),
  };

  return {
    navlinks,
    profile,
    hero,
    service,
    work,
    about,
    cta,
    skills,
    experiences,
    education,
    contact,
  } satisfies ContentRecord;
}

function createMockLocalizedContent(source: LocalizedContentRecord): LocalizedContentRecord {
  return Object.fromEntries(
    Object.entries(source).map(([locale, record]) => [
      locale,
      createMockContentRecord(record as ContentRecord),
    ]),
  ) as LocalizedContentRecord;
}

const EN_CONTENT: ContentRecord = {
  navlinks: [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "About",
      url: "/about",
    },
    {
      label: "Skills",
      url: "/skills",
    },
    {
      label: "Experience",
      url: "/experience",
    },
    {
      label: "Education",
      url: "/education",
    },
    {
      label: "Work",
      url: "/work",
    },
    {
      label: "GitHub",
      url: "/projects",
    },
    {
      label: "Services",
      url: "/service",
    },
    {
      label: "Blog",
      url: "/blog",
    },
    {
      label: "Contact",
      url: "/contact",
    },
  ],
  profile: {
    firstname: "Mohamed Rami",
    lastname: "Aouinti",
    role: "FullStack Developer (PHP & Vue)",
    avatar: "/images/profile.jpg",
  },
  hero: {
    badge: "Ready for new challenges",
    headline: "Hi, I'm Rami FullStack Developer (PHP & Vue)",
    subline:
      "I craft secure, high-performance backends with PHP 8, Symfony, REST APIs, Docker, and CI/CD pipelines.",
  },
  service: {
    label: "Services",
    headline: "Reliable backend architectures for your critical applications.",
    subline:
      "I design scalable services, optimize databases, and safeguard quality through testing, monitoring, and automation.",
    services: [
      {
        name: "API & microservice development",
        icon: "Scroll",
        description:
          "Architect and ship RESTful APIs, microservices, and third-party integrations with Symfony.",
        thumbnails: "",
      },
      {
        name: "Database modeling & performance",
        icon: "MobileProgramming",
        description:
          "Model relational schemas, tune complex SQL queries, and leverage caching layers like Redis.",
        thumbnails: "",
      },
      {
        name: "Quality assurance & DevOps",
        icon: "PenTool2",
        description:
          "Automate testing, CI/CD pipelines, and observability to enable confident releases.",
        thumbnails: "",
      },
    ],
  },
  work: {
    label: "Projects",
    headline: "Highlighted projects and engagements.",
    subline:
      "From e-commerce platforms to microservice ecosystems, I deliver robust backends that help teams grow.",
    works: [
      {
        name: "Microservices for TKDeutschland",
        slug: "microservices-tkdeutschland",
        live_demo: "#",
        description:
          "Built secure, scalable services, integrated third-party APIs, and designed authentication workflows.",
        thumbnails: "creativeagency-landingpage.webp",
        type: "Symfony 6 · REST APIs",
      },
      {
        name: "E-commerce platforms for Hinke GmbH",
        slug: "ecommerce-plattformen-hinke-gmbh",
        live_demo: "#",
        description:
          "Implemented advanced e-commerce features, configured analytics, and continuously optimized performance.",
        thumbnails: "furnilux-landingpage.webp",
        type: "Full Stack · Shopware",
      },
      {
        name: "Shopware integrations for Wizmo GmbH",
        slug: "shopware-integrationen-wizmo-gmbh",
        live_demo: "#",
        description:
          "Developed RESTful APIs, plugin extensions, and data tooling for international clients.",
        thumbnails: "cafestreet-landingpage.webp",
        type: "PHP · Laravel",
      },
      {
        name: "Monitoring & analytics automation",
        slug: "monitoring-analytics-automatisierung",
        live_demo: "#",
        description:
          "Configured Google Analytics, built trustworthy dashboards, and uncovered actionable technical improvements.",
        thumbnails: "letsfood-landingpage.webp",
        type: "Analytics · Automation",
      },
      {
        name: "Performance tuning for legacy systems",
        slug: "leistungsoptimierung-legacy-systeme",
        live_demo: "#",
        description:
          "Refactored existing codebases, reduced response times, and boosted maintainability.",
        thumbnails: "loginregister-design.webp",
        type: "Refactoring · Testing",
      },
      {
        name: "Dockerized development environments",
        slug: "dockerisierte-entwicklungsumgebungen",
        live_demo: "#",
        description:
          "Established containerized workflows to standardize CI/CD and accelerate releases.",
        thumbnails: "iratoon-mobileapp.webp",
        type: "Docker · CI/CD",
      },
    ],
  },
  about: {
    label: "About",
    introduce: [
      "I am Mohamed Rami Aouinti, a backend developer ((PHP & Vue)) with several years of experience designing, optimizing, and maintaining modern web applications.",
      "My toolkit spans PHP 8, Symfony, Laravel, MySQL and PostgreSQL data modeling, plus scalable CI/CD pipelines.",
      "I focus on rigor, quality, and teamwork to deliver reliable, future-proof products.",
    ],
    hobbies: ["Reading technical books", "Playing chess", "Exploring new cuisines"],
  },
  cta: {
    label: "Build something remarkable together",
    description:
      "Need a clear, effective interface? I help transform your vision into simple, fast, user-centered experiences.",
  },
  skills: {
    label: "Skills",
    headline: "Tools and technologies I rely on to ship dependable interfaces.",
    subline:
      "From core web technologies to design systems, these are the skills I apply every day to craft engaging digital experiences.",
    categories: [
      {
        slug: "it-kenntnisse-programmiersprachen",
        name: "IT-Kenntnisse Programmiersprachen",
        description: "Programming languages and UI foundations powering dependable user journeys.",
        skills: [
          {
            slug: "php-8",
            name: "PHP 8",
            level: "Expert",
            rating: 5,
            summary:
              "Modern PHP 8 development for modular services, clean architecture, and automated quality gates.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "javascript",
            name: "JavaScript",
            level: "Advanced",
            rating: 4,
            summary:
              "Interactive interfaces and integration scripts that keep legacy frontends maintainable and fast.",
            projects: [
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "monitoring-analytics-automatisierung" },
            ],
          },
          {
            slug: "jquery",
            name: "jQuery",
            level: "Advanced",
            rating: 3,
            summary:
              "Progressive enhancements and migrations that modernize legacy plugins without regressions.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
          {
            slug: "typescript",
            name: "TypeScript",
            level: "Advanced",
            rating: 4,
            summary:
              "Strongly typed tooling to secure complex dashboards and asynchronous workflows.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "vue",
            name: "Vue",
            level: "Advanced",
            rating: 4,
            summary: "Composable SPAs and admin consoles with maintainable state management.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "vuetify-3",
            name: "Vuetify 3",
            level: "Advanced",
            rating: 4,
            summary:
              "Rapid UI delivery with accessible components tailored for enterprise dashboards.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "html5",
            name: "HTML5",
            level: "Expert",
            rating: 5,
            summary: "Semantic markup and accessibility-first layouts for high-traffic products.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "xml",
            name: "XML",
            level: "Advanced",
            rating: 3,
            summary: "Data exchange formats for ERP integrations and catalog synchronisation.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "css3",
            name: "CSS3",
            level: "Expert",
            rating: 5,
            summary: "Responsive layouts, design systems, and cross-browser consistency at scale.",
            projects: [
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "leistungsoptimierung-legacy-systeme" },
            ],
          },
        ],
      },
      {
        slug: "frameworks",
        name: "Frameworks",
        description: "Backend frameworks and ecosystems for robust web platforms.",
        skills: [
          {
            slug: "symfony-6",
            name: "Symfony 6",
            level: "Expert",
            rating: 5,
            summary: "Domain-driven backends, reusable bundles, and rock-solid API platforms.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "laravel-6-8",
            name: "Laravel 6 & 8",
            level: "Advanced",
            rating: 4,
            summary: "Event-driven services, queues, and feature-rich ecommerce tooling.",
            projects: [{ slug: "shopware-integrationen-wizmo-gmbh" }],
          },
          {
            slug: "zendframework-2",
            name: "ZendFramework 2",
            level: "Advanced",
            rating: 3,
            summary: "Stabilising and extending legacy modules while preparing migration paths.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
        ],
      },
      {
        slug: "cms",
        name: "CMS",
        description: "Content and commerce platforms customised for B2B and B2C brands.",
        skills: [
          {
            slug: "oxid-esales-shop-6",
            name: "Oxid esales Shop 6",
            level: "Advanced",
            rating: 4,
            summary: "Module development, ERP links, and catalogue automation for Oxid stores.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "shopware-5-6",
            name: "Shopware 5.6",
            level: "Advanced",
            rating: 4,
            summary: "Plugin customisation and performance tuning for established storefronts.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "shopware-6",
            name: "Shopware 6",
            level: "Expert",
            rating: 5,
            summary: "Headless commerce builds, API integrations, and marketplace extensions.",
            projects: [
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "drupal",
            name: "Drupal",
            level: "Advanced",
            rating: 3,
            summary: "Custom modules, multilingual setups, and editorial workflows.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
          {
            slug: "typo3",
            name: "Typo3",
            level: "Advanced",
            rating: 3,
            summary: "Structured content models and integration with enterprise services.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
          {
            slug: "wordpress",
            name: "WordPress",
            level: "Advanced",
            rating: 4,
            summary: "Custom themes, ACF workflows, and secure publishing pipelines.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
        ],
      },
      {
        slug: "database",
        name: "Database",
        description: "Data stores and caching layers tuned for performance and reliability.",
        skills: [
          {
            slug: "sql",
            name: "SQL",
            level: "Expert",
            rating: 5,
            summary:
              "Schema design, query optimisation, and migration strategies for OLTP systems.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "ecommerce-plattformen-hinke-gmbh" },
            ],
          },
          {
            slug: "dql",
            name: "DQL",
            level: "Advanced",
            rating: 4,
            summary: "Doctrine query tuning powering complex reporting modules.",
            projects: [{ slug: "shopware-integrationen-wizmo-gmbh" }],
          },
          {
            slug: "mongodb",
            name: "MongoDB",
            level: "Advanced",
            rating: 3,
            summary: "Document stores for event logs and analytics back-ends.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "redis",
            name: "Redis",
            level: "Advanced",
            rating: 4,
            summary: "Caching, queues, and rate-limiting for responsive services.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "dockerisierte-entwicklungsumgebungen" },
            ],
          },
        ],
      },
      {
        slug: "api-platform-and-integration",
        name: "API Platform & Integration",
        description:
          "Tools that power REST APIs, event-driven flows, and secure authentication pipelines.",
        skills: [
          {
            slug: "api-platform",
            name: "API Platform",
            level: "Expert",
            rating: 5,
            summary:
              "Schema-first APIs with pagination, filtering, and OpenAPI documentation baked in.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "doctrine-orm",
            name: "Doctrine ORM",
            level: "Expert",
            rating: 5,
            summary:
              "Entity design, migrations, and repositories optimised for complex business domains.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "ecommerce-plattformen-hinke-gmbh" },
            ],
          },
          {
            slug: "symfony-messenger",
            name: "Symfony Messenger",
            level: "Advanced",
            rating: 4,
            summary:
              "Asynchronous processing with RabbitMQ, Redis, and Doctrine transports for resilient jobs.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "dockerisierte-entwicklungsumgebungen" },
            ],
          },
          {
            slug: "lexik-jwt-authentication",
            name: "LexikJWTAuthenticationBundle",
            level: "Advanced",
            rating: 4,
            summary: "Stateless authentication with refresh tokens and role-based access control.",
            projects: [{ slug: "microservices-tkdeutschland" }],
          },
        ],
      },
      {
        slug: "quality-and-testing",
        name: "Quality & Testing",
        description: "Test suites and static analysis that keep releases confident and maintainable.",
        skills: [
          {
            slug: "phpunit",
            name: "PHPUnit",
            level: "Expert",
            rating: 5,
            summary: "Unit, integration, and contract tests integrated into CI workflows.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "pest",
            name: "Pest",
            level: "Advanced",
            rating: 4,
            summary: "Expressive test syntax to cover APIs, queues, and domain services.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "behat",
            name: "Behat",
            level: "Advanced",
            rating: 4,
            summary: "Behaviour-driven tests describing business scenarios in plain language.",
            projects: [{ slug: "shopware-integrationen-wizmo-gmbh" }],
          },
          {
            slug: "phpstan",
            name: "PHPStan",
            level: "Advanced",
            rating: 4,
            summary: "Static analysis enforcing type safety and guarding against regressions.",
            projects: [{ slug: "dockerisierte-entwicklungsumgebungen" }],
          },
          {
            slug: "php-cs-fixer",
            name: "PHP CS Fixer",
            level: "Advanced",
            rating: 4,
            summary: "Automated code style enforcement across multi-team repositories.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
        ],
      },
      {
        slug: "devops-and-delivery",
        name: "DevOps & Delivery",
        description: "Automation, containerisation, and CI/CD for predictable deployments.",
        skills: [
          {
            slug: "docker",
            name: "Docker",
            level: "Expert",
            rating: 5,
            summary: "Multi-service containers for local development, testing, and production parity.",
            projects: [{ slug: "dockerisierte-entwicklungsumgebungen" }],
          },
          {
            slug: "docker-compose",
            name: "Docker Compose",
            level: "Advanced",
            rating: 4,
            summary: "Composable service orchestration simplifying collaborative environments.",
            projects: [
              { slug: "dockerisierte-entwicklungsumgebungen" },
              { slug: "microservices-tkdeutschland" },
            ],
          },
          {
            slug: "github-actions",
            name: "GitHub Actions",
            level: "Advanced",
            rating: 4,
            summary: "CI pipelines covering builds, tests, quality gates, and automated releases.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "gitlab-ci",
            name: "GitLab CI",
            level: "Advanced",
            rating: 4,
            summary: "Container-based pipelines orchestrating deployments and QA stages.",
            projects: [{ slug: "microservices-tkdeutschland" }],
          },
        ],
      },
      {
        slug: "monitoring-and-observability",
        name: "Monitoring & Observability",
        description: "Dashboards, tracing, and alerts keeping services healthy in production.",
        skills: [
          {
            slug: "sentry",
            name: "Sentry",
            level: "Advanced",
            rating: 4,
            summary: "Real-time error tracking with release health metrics and alert routing.",
            projects: [
              { slug: "monitoring-analytics-automatisierung" },
              { slug: "leistungsoptimierung-legacy-systeme" },
            ],
          },
          {
            slug: "elastic-stack",
            name: "Elastic Stack",
            level: "Advanced",
            rating: 4,
            summary: "Centralised logs and dashboards for audit trails and performance insights.",
            projects: [{ slug: "microservices-tkdeutschland" }],
          },
          {
            slug: "grafana",
            name: "Grafana",
            level: "Advanced",
            rating: 4,
            summary: "Operational dashboards combining metrics, traces, and alerting.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
        ],
      },
    ],
    languages: ["English", "French", "German", "Arabic"],
    languageProficiencies: [
      { name: "Arabic", proficiency: 100 },
      { name: "French", proficiency: 100 },
      { name: "English", proficiency: 80 },
      { name: "German", proficiency: 80 },
    ],
  },
  experiences: {
    label: "Experience",
    headline: "Professional journey and the impact delivered to teams and clients.",
    positions: [
      {
        slug: "backend-developer-tkdeutschland-gmbh",
        role: "Backend Developer",
        company: "TKDeutschland GmbH",
        timeframe: "Feb 2024 — Present",
        achievements: [
          "Engineering robust Symfony 6 backends tailored to complex product requirements.",
          "Designing and shipping RESTful APIs and microservices with strong security and scalability guarantees.",
          "Modeling databases, tuning SQL queries, and integrating third-party APIs and services.",
          "Implementing authentication and authorization flows backed by comprehensive unit and integration tests.",
          "Leading performance tuning, monitoring, and debugging initiatives across production environments.",
        ],
      },
      {
        slug: "senior-full-stack-developer-hinke-gmbh",
        role: "Senior Full Stack Developer",
        company: "Hinke GmbH",
        timeframe: "Nov 2021 — Jan 2024",
        achievements: [
          "Analyzed business requirements and translated them into actionable technical specifications.",
          "Architected full-stack solutions, integrated third-party APIs, and maintained shared libraries.",
          "Led feature development while coordinating version control workflows with cross-functional teams.",
          "Implemented and customized Google Analytics tracking to surface business-critical insights.",
          "Safeguarded application reliability through continuous testing, monitoring, and performance hardening.",
        ],
      },
      {
        slug: "junior-full-stack-developer-wizmo-gmbh",
        role: "Junior Full Stack Web Developer",
        company: "Wizmo GmbH",
        timeframe: "Aug 2018 — Apr 2021",
        achievements: [
          "Delivered custom Shopware plugins and REST APIs powering global e-commerce operations.",
          "Built and maintained Vue.js frontends with HTML, CSS, and JavaScript for intuitive buyer journeys.",
          "Optimized application performance through caching strategies and targeted code refactors.",
          "Managed SQL queries and schema changes to keep business data accurate and responsive.",
          "Collaborated with designers, product managers, and engineers to launch high-quality features on schedule.",
        ],
      },
    ],
  },
  education: {
    label: "Education",
    headline: "Academic background and continuous learning.",
    schools: [
      {
        slug: "msc-telecommunications-information-technology",
        degree: "MSc in Telecommunications and Information Technology",
        institution: "Beuth Hochschule für Technik, Berlin",
        timeframe: "Oct 2016 — Aug 2018",
        details:
          "Specialised in advanced telecommunications systems, network infrastructure, and applied information technology engineering.",
      },
      {
        slug: "engineering-computer-networks-telecommunications-insat",
        degree: "Engineering Degree in Computer Networks and Telecommunications",
        institution: "Université INSAT, Tunis",
        timeframe: "Sep 2008 — Aug 2013",
        details:
          "Comprehensive curriculum covering computer networking, telecommunications, and information technology fundamentals.",
      },
    ],
  },
};

const FR_CONTENT: ContentRecord = {
  navlinks: [
    {
      label: "Accueil",
      url: "/",
    },
    {
      label: "À propos",
      url: "/about",
    },
    {
      label: "Compétences",
      url: "/skills",
    },
    {
      label: "Expériences",
      url: "/experience",
    },
    {
      label: "Formations",
      url: "/education",
    },
    {
      label: "Projets",
      url: "/work",
    },
    {
      label: "Projets GitHub",
      url: "/projects",
    },
    {
      label: "Services",
      url: "/service",
    },
    {
      label: "Blog",
      url: "/blog",
    },
    {
      label: "Contact",
      url: "/contact",
    },
  ],
  profile: {
    firstname: "Mohamed Rami",
    lastname: "Aouinti",
    role: "Développeur backend ((PHP & Vue))",
    avatar: "/images/profile.jpg",
  },
  hero: {
    badge: "Prêt pour de nouveaux défis",
    headline: "Bonjour, je suis Rami développeur backend ((PHP & Vue))",
    subline:
      "Je conçois des backends sécurisés et performants avec PHP 8, Symfony, des API REST, Docker et des pipelines CI/CD.",
  },
  service: {
    label: "Services",
    headline: "Des architectures backend fiables pour vos applications critiques.",
    subline:
      "Je conçois des services évolutifs, j’optimise les bases de données et je sécurise la qualité via les tests, le monitoring et l’automatisation.",
    services: [
      {
        name: "Développement d’API et de microservices",
        icon: "Scroll",
        description:
          "Architecturer et livrer des API REST, des microservices et des intégrations tierces avec Symfony.",
        thumbnails: "",
      },
      {
        name: "Modélisation et performance des bases de données",
        icon: "MobileProgramming",
        description:
          "Modéliser des schémas relationnels, optimiser des requêtes SQL complexes et exploiter des caches comme Redis.",
        thumbnails: "",
      },
      {
        name: "Assurance qualité et DevOps",
        icon: "PenTool2",
        description:
          "Automatiser les tests, les pipelines CI/CD et l’observabilité pour livrer en toute confiance.",
        thumbnails: "",
      },
    ],
  },
  work: {
    label: "Projets",
    headline: "Projets et missions marquants.",
    subline:
      "Des plateformes e-commerce aux écosystèmes de microservices, je livre des backends robustes qui font grandir les équipes.",
    works: [
      {
        name: "Microservices pour TKDeutschland",
        slug: "microservices-tkdeutschland",
        live_demo: "#",
        description:
          "Conception de services sécurisés et scalables, intégration d’API tierces et mise en place de parcours d’authentification.",
        thumbnails: "creativeagency-landingpage.webp",
        type: "Symfony 6 · API REST",
      },
      {
        name: "Plateformes e-commerce pour Hinke GmbH",
        slug: "ecommerce-plattformen-hinke-gmbh",
        live_demo: "#",
        description:
          "Mise en œuvre de fonctionnalités e-commerce avancées, configuration d’analytics et optimisation continue des performances.",
        thumbnails: "furnilux-landingpage.webp",
        type: "Full Stack · Shopware",
      },
      {
        name: "Intégrations Shopware pour Wizmo GmbH",
        slug: "shopware-integrationen-wizmo-gmbh",
        live_demo: "#",
        description:
          "Développement d’API REST, d’extensions de plugins et d’outils de données pour des clients internationaux.",
        thumbnails: "cafestreet-landingpage.webp",
        type: "PHP · Laravel",
      },
      {
        name: "Automatisation de la mesure et du monitoring",
        slug: "monitoring-analytics-automatisierung",
        live_demo: "#",
        description:
          "Configuration de Google Analytics, création de tableaux de bord fiables et identification d’améliorations techniques actionnables.",
        thumbnails: "letsfood-landingpage.webp",
        type: "Analytics · Automatisation",
      },
      {
        name: "Optimisation de performances pour systèmes legacy",
        slug: "leistungsoptimierung-legacy-systeme",
        live_demo: "#",
        description:
          "Refonte de codebases existantes, réduction des temps de réponse et amélioration de la maintenabilité.",
        thumbnails: "loginregister-design.webp",
        type: "Refactorisation · Tests",
      },
      {
        name: "Environnements de développement Dockerisés",
        slug: "dockerisierte-entwicklungsumgebungen",
        live_demo: "#",
        description:
          "Mise en place de workflows conteneurisés pour standardiser la CI/CD et accélérer les livraisons.",
        thumbnails: "iratoon-mobileapp.webp",
        type: "Docker · CI/CD",
      },
    ],
  },
  about: {
    label: "À propos",
    introduce: [
      "Je suis Mohamed Rami Aouinti, développeur backend ((PHP & Vue)) avec plusieurs années d’expérience dans la conception, l’optimisation et la maintenance d’applications web modernes.",
      "Mon quotidien combine PHP 8, Symfony, Laravel, la modélisation de données MySQL et PostgreSQL ainsi que des pipelines CI/CD évolutifs.",
      "J’accorde une grande importance à la rigueur, à la qualité et au travail d’équipe pour livrer des produits fiables et pérennes.",
    ],
    hobbies: [
      "Lecture d’ouvrages techniques",
      "Parties d’échecs",
      "Découverte de nouvelles cuisines",
    ],
  },
  cta: {
    label: "Construisons quelque chose de remarquable ensemble",
    description:
      "Besoin d’une interface claire et efficace ? Je transforme votre vision en expériences simples, rapides et centrées sur l’utilisateur.",
  },
  skills: {
    label: "Compétences",
    headline: "Outils et technologies que j’utilise pour livrer des interfaces fiables.",
    subline:
      "Des technologies web essentielles aux design systems, voici les compétences que j’active chaque jour pour créer des expériences numériques engageantes.",
    categories: [
      {
        slug: "it-kenntnisse-programmiersprachen",
        name: "IT-Kenntnisse Programmiersprachen",
        description: "Langages et fondamentaux UI pour des parcours utilisateurs fiables.",
        skills: [
          {
            slug: "php-8",
            name: "PHP 8",
            level: "Expert",
            rating: 5,
            summary:
              "Développement PHP 8 moderne pour des services modulaires et une qualité automatisée.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "javascript",
            name: "JavaScript",
            level: "Avancé",
            rating: 4,
            summary:
              "Interfaces interactives et scripts d’intégration qui modernisent des frontends legacy.",
            projects: [
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "monitoring-analytics-automatisierung" },
            ],
          },
          {
            slug: "jquery",
            name: "jQuery",
            level: "Avancé",
            rating: 3,
            summary:
              "Améliorations progressives et migrations qui sécurisent les plugins historiques.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
          {
            slug: "typescript",
            name: "TypeScript",
            level: "Avancé",
            rating: 4,
            summary:
              "Typage statique pour fiabiliser tableaux de bord et flux asynchrones complexes.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "vue",
            name: "Vue",
            level: "Avancé",
            rating: 4,
            summary: "SPAs et consoles d’administration composables avec état maîtrisé.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "vuetify-3",
            name: "Vuetify 3",
            level: "Avancé",
            rating: 4,
            summary:
              "Livraison rapide d’interfaces accessibles adaptées aux tableaux de bord métiers.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "html5",
            name: "HTML5",
            level: "Expert",
            rating: 5,
            summary: "Markup sémantique et accessibilité pour des produits à forte audience.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "xml",
            name: "XML",
            level: "Avancé",
            rating: 3,
            summary: "Formats d’échange pour intégrations ERP et synchronisation de catalogues.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "css3",
            name: "CSS3",
            level: "Expert",
            rating: 5,
            summary: "Mises en page responsives, design systems et cohérence multi-navigateurs.",
            projects: [
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "leistungsoptimierung-legacy-systeme" },
            ],
          },
        ],
      },
      {
        slug: "frameworks",
        name: "Frameworks",
        description: "Frameworks backend pour des plateformes web robustes.",
        skills: [
          {
            slug: "symfony-6",
            name: "Symfony 6",
            level: "Expert",
            rating: 5,
            summary: "Backends orientés domaine, bundles réutilisables et API stables.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "laravel-6-8",
            name: "Laravel 6 & 8",
            level: "Avancé",
            rating: 4,
            summary: "Services événementiels, files et outils e-commerce riches.",
            projects: [{ slug: "shopware-integrationen-wizmo-gmbh" }],
          },
          {
            slug: "zendframework-2",
            name: "ZendFramework 2",
            level: "Avancé",
            rating: 3,
            summary:
              "Stabilisation et extensions de modules legacy avec trajectoires de migration.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
        ],
      },
      {
        slug: "cms",
        name: "CMS",
        description: "Plateformes de contenu et e-commerce adaptées aux marques B2B/B2C.",
        skills: [
          {
            slug: "oxid-esales-shop-6",
            name: "Oxid esales Shop 6",
            level: "Avancé",
            rating: 4,
            summary: "Développement de modules, liaisons ERP et automatisation de catalogue.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "shopware-5-6",
            name: "Shopware 5.6",
            level: "Avancé",
            rating: 4,
            summary: "Personnalisation de plugins et optimisation de performances.",
            projects: [{ slug: "ecommerce-plattformen-hinke-gmbh" }],
          },
          {
            slug: "shopware-6",
            name: "Shopware 6",
            level: "Expert",
            rating: 5,
            summary: "Commerce headless, intégrations API et extensions marketplace.",
            projects: [
              { slug: "ecommerce-plattformen-hinke-gmbh" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "drupal",
            name: "Drupal",
            level: "Avancé",
            rating: 3,
            summary: "Modules sur mesure, multilingue et workflows éditoriaux.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
          {
            slug: "typo3",
            name: "Typo3",
            level: "Avancé",
            rating: 3,
            summary: "Modèles de contenu structurés et intégrations avec services métier.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
          {
            slug: "wordpress",
            name: "WordPress",
            level: "Avancé",
            rating: 4,
            summary: "Thèmes personnalisés, ACF et pipelines de publication sécurisés.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
        ],
      },
      {
        slug: "database",
        name: "Database",
        description: "Bases de données et caches optimisés pour la performance et la fiabilité.",
        skills: [
          {
            slug: "sql",
            name: "SQL",
            level: "Expert",
            rating: 5,
            summary: "Modélisation, optimisation de requêtes et stratégies de migration OLTP.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "ecommerce-plattformen-hinke-gmbh" },
            ],
          },
          {
            slug: "dql",
            name: "DQL",
            level: "Avancé",
            rating: 4,
            summary: "Optimisation de requêtes Doctrine pour des modules de reporting complexes.",
            projects: [{ slug: "shopware-integrationen-wizmo-gmbh" }],
          },
          {
            slug: "mongodb",
            name: "MongoDB",
            level: "Avancé",
            rating: 3,
            summary: "Bases documentaires pour journaux d’événements et backends analytiques.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "redis",
            name: "Redis",
            level: "Avancé",
            rating: 4,
            summary: "Cache, files et rate-limiting pour des services réactifs.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "dockerisierte-entwicklungsumgebungen" },
            ],
          },
        ],
      },
      {
        slug: "api-platform-and-integration",
        name: "API Platform & Intégration",
        description:
          "Outils qui alimentent les API REST, les flux événementiels et l’authentification sécurisée.",
        skills: [
          {
            slug: "api-platform",
            name: "API Platform",
            level: "Expert",
            rating: 5,
            summary:
              "API schema-first avec pagination, filtres et documentation OpenAPI intégrée.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "doctrine-orm",
            name: "Doctrine ORM",
            level: "Expert",
            rating: 5,
            summary:
              "Modélisation des entités, migrations et dépôts adaptés à des domaines métiers complexes.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "ecommerce-plattformen-hinke-gmbh" },
            ],
          },
          {
            slug: "symfony-messenger",
            name: "Symfony Messenger",
            level: "Avancé",
            rating: 4,
            summary:
              "Traitements asynchrones avec RabbitMQ, Redis et transports Doctrine pour des jobs résilients.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "dockerisierte-entwicklungsumgebungen" },
            ],
          },
          {
            slug: "lexik-jwt-authentication",
            name: "LexikJWTAuthenticationBundle",
            level: "Avancé",
            rating: 4,
            summary: "Authentification stateless avec refresh tokens et contrôle d’accès par rôles.",
            projects: [{ slug: "microservices-tkdeutschland" }],
          },
        ],
      },
      {
        slug: "quality-and-testing",
        name: "Qualité & Tests",
        description:
          "Suites de tests et analyses statiques qui garantissent des livraisons fiables et maintenables.",
        skills: [
          {
            slug: "phpunit",
            name: "PHPUnit",
            level: "Expert",
            rating: 5,
            summary: "Tests unitaires, d’intégration et contractuels intégrés aux pipelines CI.",
            projects: [
              { slug: "microservices-tkdeutschland" },
              { slug: "shopware-integrationen-wizmo-gmbh" },
            ],
          },
          {
            slug: "pest",
            name: "Pest",
            level: "Avancé",
            rating: 4,
            summary: "Syntaxe expressive pour couvrir API, files de messages et services métier.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "behat",
            name: "Behat",
            level: "Avancé",
            rating: 4,
            summary: "Tests BDD décrivant les scénarios métiers en langage naturel.",
            projects: [{ slug: "shopware-integrationen-wizmo-gmbh" }],
          },
          {
            slug: "phpstan",
            name: "PHPStan",
            level: "Avancé",
            rating: 4,
            summary: "Analyse statique pour renforcer la sécurité des types et prévenir les régressions.",
            projects: [{ slug: "dockerisierte-entwicklungsumgebungen" }],
          },
          {
            slug: "php-cs-fixer",
            name: "PHP CS Fixer",
            level: "Avancé",
            rating: 4,
            summary: "Mise en forme automatique du code sur des dépôts multi-équipes.",
            projects: [{ slug: "leistungsoptimierung-legacy-systeme" }],
          },
        ],
      },
      {
        slug: "devops-and-delivery",
        name: "DevOps & Delivery",
        description: "Automatisation, conteneurisation et CI/CD pour des déploiements prédictibles.",
        skills: [
          {
            slug: "docker",
            name: "Docker",
            level: "Expert",
            rating: 5,
            summary:
              "Conteneurs multi-services pour le développement local, les tests et la parité production.",
            projects: [{ slug: "dockerisierte-entwicklungsumgebungen" }],
          },
          {
            slug: "docker-compose",
            name: "Docker Compose",
            level: "Avancé",
            rating: 4,
            summary:
              "Orchestration de services modulaires simplifiant les environnements collaboratifs.",
            projects: [
              { slug: "dockerisierte-entwicklungsumgebungen" },
              { slug: "microservices-tkdeutschland" },
            ],
          },
          {
            slug: "github-actions",
            name: "GitHub Actions",
            level: "Avancé",
            rating: 4,
            summary:
              "Pipelines CI couvrant builds, tests, contrôles qualité et releases automatisées.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
          {
            slug: "gitlab-ci",
            name: "GitLab CI",
            level: "Avancé",
            rating: 4,
            summary: "Pipelines conteneurisés orchestrant déploiements et étapes QA.",
            projects: [{ slug: "microservices-tkdeutschland" }],
          },
        ],
      },
      {
        slug: "monitoring-and-observability",
        name: "Monitoring & Observabilité",
        description: "Tableaux de bord, traces et alertes pour garder les services sains en production.",
        skills: [
          {
            slug: "sentry",
            name: "Sentry",
            level: "Avancé",
            rating: 4,
            summary: "Suivi d’erreurs en temps réel avec indicateurs de santé et routage d’alertes.",
            projects: [
              { slug: "monitoring-analytics-automatisierung" },
              { slug: "leistungsoptimierung-legacy-systeme" },
            ],
          },
          {
            slug: "elastic-stack",
            name: "Elastic Stack",
            level: "Avancé",
            rating: 4,
            summary: "Centralisation des logs et tableaux de bord pour audit et performance.",
            projects: [{ slug: "microservices-tkdeutschland" }],
          },
          {
            slug: "grafana",
            name: "Grafana",
            level: "Avancé",
            rating: 4,
            summary: "Tableaux opérationnels combinant métriques, traces et alerting.",
            projects: [{ slug: "monitoring-analytics-automatisierung" }],
          },
        ],
      },
    ],
    languages: ["Français", "Anglais", "Allemand", "Arabe"],
    languageProficiencies: [
      { name: "Arabe", proficiency: 100 },
      { name: "Français", proficiency: 100 },
      { name: "Anglais", proficiency: 80 },
      { name: "Allemand", proficiency: 80 },
    ],
  },
  experiences: {
    label: "Expériences",
    headline: "Parcours professionnel et impact apporté aux équipes et clients.",
    positions: [
      {
        slug: "backend-developer-tkdeutschland-gmbh",
        role: "Développeur backend",
        company: "TKDeutschland GmbH",
        timeframe: "Févr. 2024 — Aujourd’hui",
        achievements: [
          "Conception de backends robustes sous Symfony 6 pour répondre à des exigences produits complexes.",
          "Mise en œuvre d’API REST et de microservices alliant sécurité, performance et scalabilité.",
          "Modélisation des bases de données, optimisation des requêtes SQL et intégration d’API et services tiers.",
          "Déploiement de parcours d’authentification et d’autorisation assortis de tests unitaires et d’intégration.",
          "Pilotage des optimisations de performance, du monitoring et du débogage en production.",
        ],
      },
      {
        slug: "senior-full-stack-developer-hinke-gmbh",
        role: "Développeur full stack senior",
        company: "Hinke GmbH",
        timeframe: "Nov. 2021 — Janv. 2024",
        achievements: [
          "Analyse des besoins métiers et traduction en spécifications techniques opérationnelles.",
          "Architecture de solutions full stack, intégration d’API tierces et maintenance des bibliothèques partagées.",
          "Pilotage du développement fonctionnel en coordonnant les flux Git avec les équipes pluridisciplinaires.",
          "Mise en place et personnalisation du suivi Google Analytics pour produire des indicateurs clés.",
          "Garantie de la fiabilité applicative via tests continus, monitoring et renforcement des performances.",
        ],
      },
      {
        slug: "junior-full-stack-developer-wizmo-gmbh",
        role: "Développeur web full stack junior",
        company: "Wizmo GmbH",
        timeframe: "Août 2018 — Avr. 2021",
        achievements: [
          "Livraison de plugins Shopware et d’API REST sur mesure pour un leader mondial du e-commerce.",
          "Développement et maintenance de frontends Vue.js avec HTML, CSS et JavaScript pour des parcours intuitifs.",
          "Optimisation des performances par le cache et des refontes ciblées du code.",
          "Gestion des requêtes SQL et des évolutions de schéma pour assurer la fiabilité des données métier.",
          "Collaboration avec designers, product managers et ingénieurs pour livrer des fonctionnalités de qualité dans les délais.",
        ],
      },
    ],
  },
  education: {
    label: "Formations",
    headline: "Parcours académique et apprentissage continu.",
    schools: [
      {
        slug: "msc-telecommunications-information-technology",
        degree: "Master en télécommunications et technologies de l’information",
        institution: "Beuth Hochschule für Technik, Berlin",
        timeframe: "Oct. 2016 — Août 2018",
        details:
          "Spécialisation en systèmes de télécommunications avancés, infrastructures réseau et ingénierie des technologies de l’information.",
      },
      {
        slug: "engineering-computer-networks-telecommunications-insat",
        degree: "Diplôme d’ingénieur en réseaux informatiques et télécommunications",
        institution: "Université INSAT, Tunis",
        timeframe: "Sept. 2008 — Août 2013",
        details:
          "Formation approfondie en réseaux informatiques, télécommunications et technologies de l’information appliquées.",
      },
    ],
  },
};

type EducationLocalization = {
  navEducationLabel: string;
  education: ContentRecord["education"];
};

function createLocalizedEducationContent(
  base: ContentRecord,
  overrides: EducationLocalization,
): ContentRecord {
  return {
    ...base,
    navlinks: base.navlinks.map((link) =>
      link.url === "/education" ? { ...link, label: overrides.navEducationLabel } : link,
    ),
    education: overrides.education,
  };
}

const DE_CONTENT = createLocalizedEducationContent(EN_CONTENT, {
  navEducationLabel: "Ausbildung",
  education: {
    label: "Ausbildung",
    headline: "Akademischer Hintergrund und kontinuierliches Lernen.",
    schools: [
      {
        slug: "msc-telecommunications-information-technology",
        degree: "Master of Science in Telekommunikation und Informationstechnik",
        institution: "Beuth Hochschule für Technik, Berlin",
        timeframe: "Okt. 2016 — Aug. 2018",
        details:
          "Spezialisierung auf fortgeschrittene Telekommunikationssysteme, Netzwerkinfrastrukturen und angewandte Informationstechnik.",
      },
      {
        slug: "engineering-computer-networks-telecommunications-insat",
        degree: "Ingenieurabschluss in Rechnernetzen und Telekommunikation",
        institution: "Université INSAT, Tunis",
        timeframe: "Sep. 2008 — Aug. 2013",
        details:
          "Umfassendes Programm zu Rechnernetzwerken, Telekommunikation und Grundlagen der Informationstechnologie.",
      },
    ],
  },
});

const ES_CONTENT = createLocalizedEducationContent(EN_CONTENT, {
  navEducationLabel: "Formación",
  education: {
    label: "Formación",
    headline: "Trayectoria académica y aprendizaje continuo.",
    schools: [
      {
        slug: "msc-telecommunications-information-technology",
        degree: "Máster en Telecomunicaciones y Tecnología de la Información",
        institution: "Beuth Hochschule für Technik, Berlín",
        timeframe: "Oct. 2016 — Ago. 2018",
        details:
          "Especialización en sistemas de telecomunicaciones avanzados, infraestructura de redes e ingeniería de tecnologías de la información aplicadas.",
      },
      {
        slug: "engineering-computer-networks-telecommunications-insat",
        degree: "Ingeniería en Redes Informáticas y Telecomunicaciones",
        institution: "Université INSAT, Túnez",
        timeframe: "Sep. 2008 — Ago. 2013",
        details:
          "Plan de estudios integral sobre redes informáticas, telecomunicaciones y fundamentos de las tecnologías de la información.",
      },
    ],
  },
});

const IT_CONTENT = createLocalizedEducationContent(EN_CONTENT, {
  navEducationLabel: "Formazione",
  education: {
    label: "Formazione",
    headline: "Percorso accademico e apprendimento continuo.",
    schools: [
      {
        slug: "msc-telecommunications-information-technology",
        degree: "Laurea Magistrale in Telecomunicazioni e Tecnologie dell'Informazione",
        institution: "Beuth Hochschule für Technik, Berlino",
        timeframe: "Ott. 2016 — Ago. 2018",
        details:
          "Specializzazione in sistemi di telecomunicazione avanzati, infrastrutture di rete e ingegneria delle tecnologie dell'informazione applicate.",
      },
      {
        slug: "engineering-computer-networks-telecommunications-insat",
        degree: "Laurea in Ingegneria delle Reti Informatiche e delle Telecomunicazioni",
        institution: "Université INSAT, Tunisi",
        timeframe: "Set. 2008 — Ago. 2013",
        details:
          "Programma completo su reti informatiche, telecomunicazioni e fondamenti delle tecnologie dell'informazione.",
      },
    ],
  },
});

const RU_CONTENT = createLocalizedEducationContent(EN_CONTENT, {
  navEducationLabel: "Образование",
  education: {
    label: "Образование",
    headline: "Академический путь и непрерывное обучение.",
    schools: [
      {
        slug: "msc-telecommunications-information-technology",
        degree: "Магистр телекоммуникаций и информационных технологий",
        institution: "Beuth Hochschule für Technik, Берлин",
        timeframe: "Окт. 2016 — Авг. 2018",
        details:
          "Специализация на передовых телекоммуникационных системах, сетевой инфраструктуре и прикладной инженерии информационных технологий.",
      },
      {
        slug: "engineering-computer-networks-telecommunications-insat",
        degree: "Инженер по компьютерным сетям и телекоммуникациям",
        institution: "Université INSAT, Тунис",
        timeframe: "Сен. 2008 — Авг. 2013",
        details:
          "Комплексная программа по компьютерным сетям, телекоммуникациям и основам информационных технологий.",
      },
    ],
  },
});

const AR_CONTENT = createLocalizedEducationContent(EN_CONTENT, {
  navEducationLabel: "التعليم",
  education: {
    label: "التعليم",
    headline: "المسار الأكاديمي والتعلم المستمر.",
    schools: [
      {
        slug: "msc-telecommunications-information-technology",
        degree: "ماجستير في الاتصالات وتكنولوجيا المعلومات",
        institution: "جامعة بويث للعلوم التطبيقية، برلين",
        timeframe: "أكتوبر 2016 — أغسطس 2018",
        details:
          "تخصص في أنظمة الاتصالات المتقدمة، والبنية التحتية للشبكات، وهندسة تكنولوجيا المعلومات التطبيقية.",
      },
      {
        slug: "engineering-computer-networks-telecommunications-insat",
        degree: "هندسة الشبكات الحاسوبية والاتصالات",
        institution: "جامعة إنسات، تونس",
        timeframe: "سبتمبر 2008 — أغسطس 2013",
        details: "منهج شامل يغطي شبكات الحاسوب، والاتصالات، وأساسيات تقنيات المعلومات.",
      },
    ],
  },
});

const PROD_LOCALIZED_CONTENT: Partial<Record<LocaleCode, ContentRecord>> = {
  en: EN_CONTENT,
  fr: FR_CONTENT,
  de: DE_CONTENT,
  es: ES_CONTENT,
  it: IT_CONTENT,
  ru: RU_CONTENT,
  ar: AR_CONTENT,
};

const PROD_CONTENT: LocalizedContentRecord = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => {
    const localized =
      PROD_LOCALIZED_CONTENT[locale] ?? PROD_LOCALIZED_CONTENT[DEFAULT_LOCALE];
    return [locale, localized as ContentRecord];
  }),
) as LocalizedContentRecord;

const DEV_CONTENT = createMockLocalizedContent(PROD_CONTENT);

export const DEFAULT_CONTENT = import.meta.dev ? DEV_CONTENT : PROD_CONTENT;

export const LIVE_CONTENT = PROD_CONTENT;
export const MOCK_CONTENT = DEV_CONTENT;
