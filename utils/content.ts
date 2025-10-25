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
        details:
          "منهج شامل يغطي شبكات الحاسوب، والاتصالات، وأساسيات تقنيات المعلومات.",
      },
    ],
  },
});

const LOCALIZED_CONTENT: Partial<Record<LocaleCode, ContentRecord>> = {
  en: EN_CONTENT,
  fr: FR_CONTENT,
  de: DE_CONTENT,
  es: ES_CONTENT,
  it: IT_CONTENT,
  ru: RU_CONTENT,
  ar: AR_CONTENT,
};

export const DEFAULT_CONTENT: LocalizedContentRecord = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => {
    const localized = LOCALIZED_CONTENT[locale] ?? LOCALIZED_CONTENT[DEFAULT_LOCALE];
    return [locale, localized as ContentRecord];
  }),
) as LocalizedContentRecord;
