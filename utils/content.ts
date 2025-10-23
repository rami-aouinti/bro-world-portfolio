import type { ContentRecord } from '~/types/content'

export const DEFAULT_CONTENT: ContentRecord = {
  navlinks: [
    {
      label: 'Start',
      url: '#personal'
    },
    {
      label: 'Über mich',
      url: '#about'
    },
    {
      label: 'Skills',
      url: '#skills'
    },
    {
      label: 'Experience',
      url: '#experience'
    },
    {
      label: 'Education',
      url: '#education'
    },
    {
      label: 'Works',
      url: '#work'
    },
    {
      label: 'Kompetenzen',
      url: '#service'
    }
  ],
  profile: {
    firstname: 'Mohamed Rami',
    lastname: 'Aouinti',
    role: 'Backend Developer (PHP & Symfony)',
    avatar: '/images/profile.jpg'
  },
  hero: {
    badge: 'Bereit für neue Herausforderungen',
    headline: 'Hallo, ich bin Aouinti – Backend Developer (PHP & Symfony)',
    subline:
      'Ich entwickle sichere, performante Backend-Lösungen mit PHP 8, Symfony, RESTful APIs, Docker und CI/CD-Pipelines.'
  },
  service: {
    label: 'Kompetenzen',
    headline: 'Stabile Backend-Architekturen für anspruchsvolle Anwendungen.',
    subline:
      'Ich entwickle skalierbare Services, optimiere Datenbanken und stelle mit Tests, Monitoring und Automatisierung eine hohe Softwarequalität sicher.',
    services: [
      {
        name: 'API- & Microservice-Entwicklung',
        icon: 'Scroll',
        description:
          'Konzeption und Implementierung von RESTful APIs, Microservices und Integrationen von Drittanbieter-Systemen mit Symfony.',
        thumbnails: ''
      },
      {
        name: 'Datenbankdesign & Performance',
        icon: 'MobileProgramming',
        description:
          'Modellierung relationaler Datenbanken, Optimierung komplexer SQL-Abfragen sowie Einsatz von Caching-Lösungen wie Redis.',
        thumbnails: ''
      },
      {
        name: 'Qualitätssicherung & DevOps',
        icon: 'PenTool2',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores!',
        thumbnails: ''
      }
    ]
  },
  work: {
    label: 'Erfahrung',
    headline: 'Ausgewählte Stationen aus meiner Karriere.',
    subline:
      'Von E-Commerce-Plattformen bis zu Microservice-Landschaften – ich liefere robuste Backend-Lösungen, die Geschäftserfolge ermöglichen.',
    works: [
      {
        name: 'Symfony-Microservices für TKDeutschland GmbH',
        live_demo: '#',
        description:
          'Entwicklung sicherer, skalierbarer Services, Integration von Drittanbieter-APIs und Aufbau von Authentifizierungs-Workflows.',
        thumbnails: 'creativeagency-landingpage.webp',
        type: 'Symfony 6 · REST APIs'
      },
      {
        name: 'E-Commerce Plattformen bei Hinke GmbH',
        live_demo: '#',
        description:
          'Implementierung komplexer Shop-Funktionen, Web-Analytics-Setups und kontinuierliche Performance-Optimierung.',
        thumbnails: 'furnilux-landingpage.webp',
        type: 'Full Stack · Shopware'
      },
      {
        name: 'Shopware-Integrationen für Wizmo GmbH',
        live_demo: '#',
        description:
          'Entwicklung von RESTful APIs, Plugin-Erweiterungen und datengetriebenen Tools für internationale Kunden.',
        thumbnails: 'cafestreet-landingpage.webp',
        type: 'PHP · Laravel'
      },
      {
        name: 'Monitoring & Analytics Automatisierung',
        live_demo: '#',
        description:
          'Konfiguration von Google Analytics, Erstellung belastbarer Dashboards und Ableitung technischer Optimierungen.',
        thumbnails: 'letsfood-landingpage.webp',
        type: 'Analytics · Automation'
      },
      {
        name: 'Leistungsoptimierung für Legacy-Systeme',
        live_demo: '#',
        description:
          'Refactoring bestehender Codebasen, Reduzierung von Antwortzeiten und Verbesserung der Wartbarkeit.',
        thumbnails: 'loginregister-design.webp',
        type: 'Refactoring · Testing'
      },
      {
        name: 'Dockerisierte Entwicklungsumgebungen',
        live_demo: '#',
        description:
          'Aufbau containerisierter Workflows, um CI/CD-Prozesse zu vereinheitlichen und Deployments zu beschleunigen.',
        thumbnails: 'iratoon-mobileapp.webp',
        type: 'Docker · CI/CD'
      }
    ]
  },
  about: {
    label: 'Über mich',
    introduce: [
      'Ich bin Mohamed Rami Aouinti, Backend Developer (PHP & Symfony) mit mehrjähriger Erfahrung in der Entwicklung, Optimierung und Wartung moderner Webanwendungen.',
      'Meine Schwerpunkte liegen in PHP 8, Symfony, Laravel, Datenbankmodellierung mit MySQL und PostgreSQL sowie in der Integration skalierbarer CI/CD-Prozesse.',
      'Ich arbeite strukturiert, qualitätsorientiert und gerne im Team, um anspruchsvolle Produkte zuverlässig in die Produktion zu bringen.'
    ]
  },
  cta: {
    label: 'Let’s Build Something Great Together',
    description:
      'Need a clean, functional UI? I’m here to help bring your vision to life—simple, responsive, and user-focused.'
  },
  skills: {
    label: 'skills',
    headline: 'Tools and technologies I rely on to ship quality interfaces.',
    subline:
      'From foundational web technologies to design systems, these are the skills I apply every day to craft engaging digital experiences.',
    categories: [
      {
        name: 'Frontend Development',
        skills: ['HTML5', 'CSS3 & Tailwind CSS', 'JavaScript', 'TypeScript', 'Vue.js & Nuxt']
      },
      {
        name: 'UI & Product Design',
        skills: ['Figma', 'Design Systems', 'Prototyping', 'Accessibility', 'User Research']
      },
      {
        name: 'Collaboration & Delivery',
        skills: ['Git & GitHub', 'Agile Workflows', 'Technical Documentation', 'Code Reviews', 'Stakeholder Communication']
      }
    ]
  },
  experiences: {
    label: 'experience',
    headline: 'Professional journey and the impact created for teams and clients.',
    positions: [
      {
        role: 'Senior Front-End Developer',
        company: 'PixelForge Studio',
        timeframe: '2022 — Present',
        achievements: [
          'Led the rebuild of the company design system, reducing component delivery time by 35%.',
          'Collaborated with product designers to launch responsive marketing sites that increased lead generation by 25%.',
          'Mentored junior developers and introduced code review practices to improve overall code quality.'
        ]
      },
      {
        role: 'UI Engineer',
        company: 'Brightwave Labs',
        timeframe: '2019 — 2022',
        achievements: [
          'Developed reusable Vue components powering analytics dashboards for enterprise clients.',
          'Worked closely with UX researchers to deliver accessible interfaces that met WCAG AA standards.',
          'Automated front-end testing workflows, reducing regressions across weekly releases.'
        ]
      }
    ]
  },
  education: {
    label: 'education',
    headline: 'Academic background and continued learning milestones.',
    schools: [
      {
        degree: 'B.Sc. in Information Technology',
        institution: 'Jakarta Institute of Technology',
        timeframe: '2015 — 2019',
        details:
          'Focused on software engineering, user interface design, and human-computer interaction. Graduated with honors.'
      },
      {
        degree: 'Certificate, Advanced UX Design',
        institution: 'Interaction Design Foundation',
        timeframe: '2020',
        details:
          'Completed specialized coursework in user research methodologies, prototyping, and usability testing.'
      }
    ]
  }
}
