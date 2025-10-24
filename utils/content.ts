import type { ContentRecord } from '~/types/content'

export const DEFAULT_CONTENT: ContentRecord = {
  navlinks: [
    {
      label: 'Home',
      url: '/'
    },
    {
      label: 'About',
      url: '/about'
    },
    {
      label: 'Skills',
      url: '/skills'
    },
    {
      label: 'Experience',
      url: '/experience'
    },
    {
      label: 'Education',
      url: '/education'
    },
    {
      label: 'Work',
      url: '/work'
    },
    {
      label: 'Services',
      url: '/service'
    }
  ],
  profile: {
    firstname: 'Mohamed Rami',
    lastname: 'Aouinti',
    role: 'Backend Developer (PHP & Symfony)',
    avatar: '/images/profile.jpg'
  },
  hero: {
    badge: 'Ready for new challenges',
    headline: "Hi, I'm Aouinti — Backend Developer (PHP & Symfony)",
    subline:
      'I craft secure, high-performance backends with PHP 8, Symfony, REST APIs, Docker, and CI/CD pipelines.'
  },
  service: {
    label: 'Services',
    headline: 'Reliable backend architectures for your critical applications.',
    subline:
      'I design scalable services, optimize databases, and safeguard quality through testing, monitoring, and automation.',
    services: [
      {
        name: 'API & microservice development',
        icon: 'Scroll',
        description:
          'Architect and ship RESTful APIs, microservices, and third-party integrations with Symfony.',
        thumbnails: ''
      },
      {
        name: 'Database modeling & performance',
        icon: 'MobileProgramming',
        description:
          'Model relational schemas, tune complex SQL queries, and leverage caching layers like Redis.',
        thumbnails: ''
      },
      {
        name: 'Quality assurance & DevOps',
        icon: 'PenTool2',
        description:
          'Automate testing, CI/CD pipelines, and observability to enable confident releases.',
        thumbnails: ''
      }
    ]
  },
  work: {
    label: 'Projects',
    headline: 'Highlighted projects and engagements.',
    subline:
      'From e-commerce platforms to microservice ecosystems, I deliver robust backends that help teams grow.',
    works: [
      {
        name: 'Microservices for TKDeutschland',
        slug: 'microservices-tkdeutschland',
        live_demo: '#',
        description:
          'Built secure, scalable services, integrated third-party APIs, and designed authentication workflows.',
        thumbnails: 'creativeagency-landingpage.webp',
        type: 'Symfony 6 · REST APIs'
      },
      {
        name: 'E-commerce platforms for Hinke GmbH',
        slug: 'ecommerce-plattformen-hinke-gmbh',
        live_demo: '#',
        description:
          'Implemented advanced e-commerce features, configured analytics, and continuously optimized performance.',
        thumbnails: 'furnilux-landingpage.webp',
        type: 'Full Stack · Shopware'
      },
      {
        name: 'Shopware integrations for Wizmo GmbH',
        slug: 'shopware-integrationen-wizmo-gmbh',
        live_demo: '#',
        description:
          'Developed RESTful APIs, plugin extensions, and data tooling for international clients.',
        thumbnails: 'cafestreet-landingpage.webp',
        type: 'PHP · Laravel'
      },
      {
        name: 'Monitoring & analytics automation',
        slug: 'monitoring-analytics-automatisierung',
        live_demo: '#',
        description:
          'Configured Google Analytics, built trustworthy dashboards, and uncovered actionable technical improvements.',
        thumbnails: 'letsfood-landingpage.webp',
        type: 'Analytics · Automation'
      },
      {
        name: 'Performance tuning for legacy systems',
        slug: 'leistungsoptimierung-legacy-systeme',
        live_demo: '#',
        description:
          'Refactored existing codebases, reduced response times, and boosted maintainability.',
        thumbnails: 'loginregister-design.webp',
        type: 'Refactoring · Testing'
      },
      {
        name: 'Dockerized development environments',
        slug: 'dockerisierte-entwicklungsumgebungen',
        live_demo: '#',
        description:
          'Established containerized workflows to standardize CI/CD and accelerate releases.',
        thumbnails: 'iratoon-mobileapp.webp',
        type: 'Docker · CI/CD'
      }
    ]
  },
  about: {
    label: 'About',
    introduce: [
      'I am Mohamed Rami Aouinti, a backend developer (PHP & Symfony) with several years of experience designing, optimizing, and maintaining modern web applications.',
      'My toolkit spans PHP 8, Symfony, Laravel, MySQL and PostgreSQL data modeling, plus scalable CI/CD pipelines.',
      'I focus on rigor, quality, and teamwork to deliver reliable, future-proof products.'
    ]
  },
  cta: {
    label: 'Build something remarkable together',
    description:
      'Need a clear, effective interface? I help transform your vision into simple, fast, user-centered experiences.'
  },
  skills: {
    label: 'Skills',
    headline: 'Tools and technologies I rely on to ship dependable interfaces.',
    subline:
      'From core web technologies to design systems, these are the skills I apply every day to craft engaging digital experiences.',
    categories: [
      {
        name: 'Frontend development',
        skills: ['HTML5', 'CSS3 & Tailwind CSS', 'JavaScript', 'TypeScript', 'Vue.js & Nuxt']
      },
      {
        name: 'Product design',
        skills: ['Figma', 'Design Systems', 'Prototyping', 'Accessibility', 'User Research']
      },
      {
        name: 'Collaboration & delivery',
        skills: ['Git & GitHub', 'Agile Workflows', 'Technical Documentation', 'Code Reviews', 'Stakeholder Communication']
      }
    ]
  },
  experiences: {
    label: 'Experience',
    headline: 'Professional journey and the impact delivered to teams and clients.',
    positions: [
      {
        slug: 'senior-front-end-developer-pixelforge-studio',
        role: 'Senior Frontend Developer',
        company: 'PixelForge Studio',
        timeframe: '2022 — Present',
        achievements: [
          'Led the redesign of the internal design system, cutting component delivery time by 35%.',
          'Partnered closely with product designers to launch responsive marketing sites that increased leads by 25%.',
          'Mentored junior developers and introduced structured code reviews to raise overall quality.'
        ]
      },
      {
        slug: 'ui-engineer-brightwave-labs',
        role: 'UI Engineer',
        company: 'Brightwave Labs',
        timeframe: '2019 — 2022',
        achievements: [
          'Built reusable Vue components powering analytics dashboards for enterprise clients.',
          'Collaborated with UX teams to ship accessible interfaces compliant with WCAG AA.',
          'Automated frontend testing flows and reduced regressions across weekly releases.'
        ]
      }
    ]
  },
  education: {
    label: 'Education',
    headline: 'Academic background and continuous learning.',
    schools: [
      {
        slug: 'bsc-information-technology',
        degree: 'BSc in Information Technology',
        institution: 'Jakarta Institute of Technology',
        timeframe: '2015 — 2019',
        details:
          'Specialised in software engineering, interface design, and human-computer interaction. Graduated with honours.'
      },
      {
        slug: 'certificate-advanced-ux-design',
        degree: 'Advanced UX Design Certificate',
        institution: 'Interaction Design Foundation',
        timeframe: '2020',
        details:
          'Focused on user research, prototyping, and usability testing in fast-paced product teams.'
      }
    ]
  }
}
