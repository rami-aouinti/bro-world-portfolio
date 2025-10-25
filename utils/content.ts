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
    languages: ["English", "French", "Arabic"],
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
    languages: ["Français", "Anglais", "Arabe"],
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
