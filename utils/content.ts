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
  ],
  profile: {
    firstname: "Mohamed Rami",
    lastname: "Aouinti",
    role: "Backend Developer (PHP & Symfony)",
    avatar: "/images/profile.jpg",
  },
  hero: {
    badge: "Ready for new challenges",
    headline: "Hi, I'm Aouinti — Backend Developer (PHP & Symfony)",
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
        name: "Frontend development",
        skills: ["HTML5", "CSS3 & Tailwind CSS", "JavaScript", "TypeScript", "Vue.js & Nuxt"],
      },
      {
        name: "Product design",
        skills: ["Figma", "Design Systems", "Prototyping", "Accessibility", "User Research"],
      },
      {
        name: "Collaboration & delivery",
        skills: [
          "Git & GitHub",
          "Agile Workflows",
          "Technical Documentation",
          "Code Reviews",
          "Stakeholder Communication",
        ],
      },
    ],
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
  ],
  profile: {
    firstname: "Mohamed Rami",
    lastname: "Aouinti",
    role: "Développeur backend (PHP & Symfony)",
    avatar: "/images/profile.jpg",
  },
  hero: {
    badge: "Prêt pour de nouveaux défis",
    headline: "Bonjour, je suis Aouinti — développeur backend (PHP & Symfony)",
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
        name: "Développement front-end",
        skills: ["HTML5", "CSS3 & Tailwind CSS", "JavaScript", "TypeScript", "Vue.js & Nuxt"],
      },
      {
        name: "Design produit",
        skills: ["Figma", "Design Systems", "Prototypage", "Accessibilité", "Recherche utilisateur"],
      },
      {
        name: "Collaboration & livraison",
        skills: [
          "Git & GitHub",
          "Méthodes agiles",
          "Documentation technique",
          "Revues de code",
          "Communication avec les parties prenantes",
        ],
      },
    ],
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
