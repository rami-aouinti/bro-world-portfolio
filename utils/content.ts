export const NAVLINKS= [
  {
    label: 'Home',
    url: '#hero'
  },
  {
    label : 'About',
    url: '#about'
  },
  {
    label : 'Skills',
    url: '#skills'
  },
  {
    label : 'Experience',
    url: '#experience'
  },
  {
    label : 'Education',
    url: '#education'
  },
  {
    label : 'Works',
    url: '#work'
  },
  {
    label : 'Service',
    url: '/#service'
  },

]

export const PROFILE = {
  firstname : 'Muhamad',
  lastname: 'Raul Iqbal',
  get fullname() {
    return `${this.firstname} ${this.lastname}`
  },
  role : 'Front-End Developer & UI Designer',
  avatar: '/images/profile.jpg'
}

export const HERO = {
  badge: 'Available for freelance',
  headline: `Hey, I'm ${PROFILE.lastname}. I'm a ${PROFILE.role}`,
  subline : "I am a developer and designer who has a passion for building responsive, cool looking, and easy to visit website applications."
}

export const SERVICE = {
  label: 'service',
  headline: 'Custom design solutions for your requirements.',
  subline: 'I specialize in crafting user-centered solutions for businesses and individuals. Let’s create something extraordinary together.',
  services: [
    {
      name: "Web Development",
      icon: 'Scroll',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores!',
      thumbnails: ''
    },
    {
      name: "Mobile Development",
      icon: 'MobileProgramming',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores!',
      thumbnails: 'https://cdn.dribbble.com/userupload/36796487/file/original-436c64a72733941273f9fd1f4d994883.jpg?resize=752x&vertical=center'
    },
    {
      name: "UI/UX Designer",
      icon: 'PenTool2',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores!',
      thumbnails: ''
    },

  ]
}

export const WORK = {
  label: 'work',
  headline: 'Custom design solutions for your requirements.',
  subline: 'I specialize in crafting user-centered solutions for businesses and individuals. Let’s create something extraordinary together.',
  works: [
    {
      name: "Cafe Street - Landing Page",
      live_demo: '#',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores.',
      thumbnails: 'cafestreet-landingpage.webp',
      type: 'landing page'
    },
    {
      name: "FurniLux",
      live_demo: '#',
      description: 'Make your home comfortable with best furniture.',
      thumbnails: 'furnilux-landingpage.webp',
      type: 'landing page'
    },
    {
      name: "Let's Food UI Kit",
      live_demo: '#',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores.',
      thumbnails: 'letsfood-landingpage.webp',
      type: 'Web Design'
    },
    {
      name: "Creative Agency",
      live_demo: '#',
      description: 'This website is to improve your business as a software house and reach more customers.',
      thumbnails: 'creativeagency-landingpage.webp',
      type: 'Web Company'
    },
    {
      name: "Login Register Design",
      live_demo: '#',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores.',
      thumbnails: 'loginregister-design.webp',
      type: 'UI Design'
    },
    {
      name: "IRATOON - Streaming App",
      live_demo: '#',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit cum distinctio dolores.',
      thumbnails: 'iratoon-mobileapp.webp',
      type: 'Mobile App'
    },
  ]
}

export const ABOUT = {
  label: 'Let me introduce my self',
  introduce: [
    `My name is ${PROFILE.fullname}, and I am a passionate ${PROFILE.role}. I specialize in creating seamless and visually appealing user interfaces, combining design and development to enhance user experiences.`,
    "I love turning ideas into interactive and functional web applications. Excited to collaborate and build amazing digital products together!"
  ]
}

export const CTA = {
  label: 'Let’s Build Something Great Together',
  description: 'Need a clean, functional UI? I’m here to help bring your vision to life—simple, responsive, and user-focused.'
}

export const SKILLS = {
  label: 'skills',
  headline: 'Tools and technologies I rely on to ship quality interfaces.',
  subline: 'From foundational web technologies to design systems, these are the skills I apply every day to craft engaging digital experiences.',
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
}

export const EXPERIENCES = {
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
}

export const EDUCATION = {
  label: 'education',
  headline: 'Academic background and continued learning milestones.',
  schools: [
    {
      degree: 'B.Sc. in Information Technology',
      institution: 'Jakarta Institute of Technology',
      timeframe: '2015 — 2019',
      details: 'Focused on software engineering, user interface design, and human-computer interaction. Graduated with honors.'
    },
    {
      degree: 'Certificate, Advanced UX Design',
      institution: 'Interaction Design Foundation',
      timeframe: '2020',
      details: 'Completed specialized coursework in user research methodologies, prototyping, and usability testing.'
    }
  ]
}
