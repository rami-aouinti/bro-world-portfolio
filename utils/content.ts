export const NAVLINKS = [
  {
    label: 'Start',
    url: '#hero'
  },
  {
    label: 'Über mich',
    url: '#about'
  },
  {
    label: 'Erfahrung',
    url: '#work'
  },
  {
    label: 'Kompetenzen',
    url: '#service'
  },
  {
    label: 'Contact',
    url: '/contact'
  },

]

export const PROFILE = {
  firstname: 'Mohamed Rami',
  lastname: 'Aouinti',
  get fullname() {
    return `${this.firstname} ${this.lastname}`
  },
  role: 'Backend Developer (PHP & Symfony)',
  avatar: '/images/profile.jpg'
}

export const HERO = {
  badge: 'Bereit für neue Herausforderungen',
  headline: `Hallo, ich bin ${PROFILE.lastname} – ${PROFILE.role}`,
  subline:
    'Ich entwickle sichere, performante Backend-Lösungen mit PHP 8, Symfony, RESTful APIs, Docker und CI/CD-Pipelines.'
}

export const SERVICE = {
  label: 'Kompetenzen',
  headline: 'Stabile Backend-Architekturen für anspruchsvolle Anwendungen.',
  subline:
    'Ich entwickle skalierbare Services, optimiere Datenbanken und stelle mit Tests, Monitoring und Automatisierung eine hohe Softwarequalität sicher.',
  services: [
    {
      name: 'API- & Microservice-Entwicklung',
      icon: 'Scroll',
      description:
        'Konzeption und Implementierung von RESTful APIs, Microservices und Integrationen von Drittanbieter-Systemen mit Symfony.'
    },
    {
      name: 'Datenbankdesign & Performance',
      icon: 'MobileProgramming',
      description:
        'Modellierung relationaler Datenbanken, Optimierung komplexer SQL-Abfragen sowie Einsatz von Caching-Lösungen wie Redis.'
    },
    {
      name: 'Qualitätssicherung & DevOps',
      icon: 'PenTool2',
      description:
        'Einrichtung von CI/CD-Pipelines, Erstellung von Unit- und Integrationstests sowie Containerisierung mit Docker.'
    }
  ]
}

export const WORK = {
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
}

export const ABOUT = {
  label: 'Über mich',
  introduce: [
    `Ich bin ${PROFILE.fullname}, ${PROFILE.role} mit mehrjähriger Erfahrung in der Entwicklung, Optimierung und Wartung moderner Webanwendungen.`,
    'Meine Schwerpunkte liegen in PHP 8, Symfony, Laravel, Datenbankmodellierung mit MySQL und PostgreSQL sowie in der Integration skalierbarer CI/CD-Prozesse.',
    'Ich arbeite strukturiert, qualitätsorientiert und gerne im Team, um anspruchsvolle Produkte zuverlässig in die Produktion zu bringen.'
  ]
}

export const CTA = {
  label: 'Lassen Sie uns über Ihr nächstes Backend-Projekt sprechen',
  description:
    'Ob Migration, Feature-Entwicklung oder Performance-Tuning – ich unterstütze Sie dabei, stabile Services schnell in Produktion zu bringen.'
}
