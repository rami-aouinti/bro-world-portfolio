import type { ContentRecord } from "~/types/content";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "~/utils/i18n/locales";

export type LocalizedContentRecord = Record<LocaleCode, ContentRecord>;

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
    role: "Backend Developer (PHP & Symfony)",
    avatar: "/images/profile.jpg",
  },
  hero: {
    badge: "Ready for new challenges",
    headline: "Hi, I'm Rami Backend Developer (PHP & Symfony)",
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
      "I am Mohamed Rami Aouinti, a backend developer (PHP & Symfony) with several years of experience designing, optimizing, and maintaining modern web applications.",
      "My toolkit spans PHP 8, Symfony, Laravel, MySQL and PostgreSQL data modeling, plus scalable CI/CD pipelines.",
      "I focus on rigor, quality, and teamwork to deliver reliable, future-proof products.",
    ],
    hobbies: [
      "Reading technical books",
      "Playing chess",
      "Exploring new cuisines",
    ],
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
            summary:
              "Domain-driven backends, reusable bundles, and rock-solid API platforms.",
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
            summary:
              "Stabilising and extending legacy modules while preparing migration paths.",
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
            summary: "Schema design, query optimisation, and migration strategies for OLTP systems.",
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
    ],
    languages: ["English", "French", "Arabic"],
  },
  experiences: {
    label: "Experience",
    headline: "Professional journey and the impact delivered to teams and clients.",
    positions: [
      {
        slug: "senior-front-end-developer-pixelforge-studio",
        role: "Senior Frontend Developer",
        company: "PixelForge Studio",
        timeframe: "2022 — Present",
        achievements: [
          "Led the redesign of the internal design system, cutting component delivery time by 35%.",
          "Partnered closely with product designers to launch responsive marketing sites that increased leads by 25%.",
          "Mentored junior developers and introduced structured code reviews to raise overall quality.",
        ],
      },
      {
        slug: "ui-engineer-brightwave-labs",
        role: "UI Engineer",
        company: "Brightwave Labs",
        timeframe: "2019 — 2022",
        achievements: [
          "Built reusable Vue components powering analytics dashboards for enterprise clients.",
          "Collaborated with UX teams to ship accessible interfaces compliant with WCAG AA.",
          "Automated frontend testing flows and reduced regressions across weekly releases.",
        ],
      },
    ],
  },
  education: {
    label: "Education",
    headline: "Academic background and continuous learning.",
    schools: [
      {
        slug: "bsc-information-technology",
        degree: "BSc in Information Technology",
        institution: "Jakarta Institute of Technology",
        timeframe: "2015 — 2019",
        details:
          "Specialised in software engineering, interface design, and human-computer interaction. Graduated with honours.",
      },
      {
        slug: "certificate-advanced-ux-design",
        degree: "Advanced UX Design Certificate",
        institution: "Interaction Design Foundation",
        timeframe: "2020",
        details:
          "Focused on user research, prototyping, and usability testing in fast-paced product teams.",
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
    role: "Développeur backend (PHP & Symfony)",
    avatar: "/images/profile.jpg",
  },
  hero: {
    badge: "Prêt pour de nouveaux défis",
    headline: "Bonjour, je suis Rami développeur backend (PHP & Symfony)",
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
      "Je suis Mohamed Rami Aouinti, développeur backend (PHP & Symfony) avec plusieurs années d’expérience dans la conception, l’optimisation et la maintenance d’applications web modernes.",
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
            summary:
              "Backends orientés domaine, bundles réutilisables et API stables.",
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
    ],
    languages: ["Français", "Anglais", "Arabe"],
  },
  experiences: {
    label: "Expériences",
    headline: "Parcours professionnel et impact apporté aux équipes et clients.",
    positions: [
      {
        slug: "senior-front-end-developer-pixelforge-studio",
        role: "Développeur frontend senior",
        company: "PixelForge Studio",
        timeframe: "2022 — Aujourd’hui",
        achievements: [
          "Refonte du design system interne, réduisant de 35 % le temps de livraison des composants.",
          "Collaboration étroite avec les designers produit pour lancer des sites marketing responsives qui ont augmenté les leads de 25 %.",
          "Mentorat des développeurs juniors et mise en place de revues de code structurées pour élever la qualité globale.",
        ],
      },
      {
        slug: "ui-engineer-brightwave-labs",
        role: "Ingénieur UI",
        company: "Brightwave Labs",
        timeframe: "2019 — 2022",
        achievements: [
          "Création de composants Vue réutilisables alimentant des tableaux de bord analytiques pour des clients entreprise.",
          "Collaboration avec les équipes UX pour livrer des interfaces accessibles conformes au WCAG AA.",
          "Automatisation des flux de tests frontend et réduction des régressions sur les mises en production hebdomadaires.",
        ],
      },
    ],
  },
  education: {
    label: "Formations",
    headline: "Parcours académique et apprentissage continu.",
    schools: [
      {
        slug: "bsc-information-technology",
        degree: "Licence en technologies de l’information",
        institution: "Jakarta Institute of Technology",
        timeframe: "2015 — 2019",
        details:
          "Spécialisation en génie logiciel, design d’interface et interaction humain-machine. Diplômé avec mention.",
      },
      {
        slug: "certificate-advanced-ux-design",
        degree: "Certificat en UX design avancé",
        institution: "Interaction Design Foundation",
        timeframe: "2020",
        details:
          "Approfondissement de la recherche utilisateur, du prototypage et des tests d’utilisabilité dans des équipes produit réactives.",
      },
    ],
  },
};

const LOCALIZED_CONTENT: Partial<Record<LocaleCode, ContentRecord>> = {
  en: EN_CONTENT,
  fr: FR_CONTENT,
};

export const DEFAULT_CONTENT: LocalizedContentRecord = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => {
    const localized = LOCALIZED_CONTENT[locale] ?? LOCALIZED_CONTENT[DEFAULT_LOCALE];
    return [locale, localized as ContentRecord];
  }),
) as LocalizedContentRecord;
