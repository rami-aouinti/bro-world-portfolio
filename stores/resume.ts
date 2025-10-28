import { computed, ref, watch } from "vue";
import { onNuxtReady } from "#app";
import { defineStore } from "~/lib/pinia-shim";
import type {
  ResumeColorPalette,
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeExperienceHighlight,
  ResumePersonalInfo,
  ResumeProject,
  ResumeSkill,
  ResumeSocialLink,
  ResumeTemplateId,
  ResumeTemplateOption,
} from "~/types/resume";

const STORAGE_KEY = "bro-world-resume-data-v1";

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultColors(): ResumeColorPalette {
  return {
    primary: "#1f2937",
    secondary: "#3b82f6",
    background: "#ffffff",
    surface: "#f3f4f6",
    text: "#111827",
  };
}

function createDefaultPersonalInfo(): ResumePersonalInfo {
  return {
    firstName: "Alex",
    lastName: "Dev",
    headline: "Développeur Fullstack",
    summary:
      "Développeur fullstack passionné par la création d’expériences web fiables et raffinées. J’aide les équipes produit à livrer rapidement des interfaces performantes et accessibles.",
    email: "alex.dev@example.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    website: "https://alexdev.example",
    linkedin: "https://linkedin.com/in/alexdev",
    github: "https://github.com/alexdev",
  };
}

function createDefaultHighlights(): ResumeExperienceHighlight[] {
  return [
    {
      id: createId("highlight"),
      text: "Mise en place d’un design system Nuxt + Tailwind partagé sur 4 produits.",
    },
    {
      id: createId("highlight"),
      text: "Réduction de 35% du temps de build en optimisant la pipeline CI.",
    },
  ];
}

function createDefaultExperiences(): ResumeExperience[] {
  return [
    {
      id: createId("experience"),
      position: "Lead Developer",
      company: "Bro World",
      location: "Paris, France",
      startDate: "2022",
      endDate: "Présent",
      description:
        "Pilotage technique d’une équipe de 6 développeurs sur la refonte d’une plateforme SaaS internationale.",
      highlights: createDefaultHighlights(),
    },
    {
      id: createId("experience"),
      position: "Développeur Frontend",
      company: "Creative Studio",
      location: "Lyon, France",
      startDate: "2019",
      endDate: "2022",
      description:
        "Développement d’applications web sur mesure en Vue/Nuxt pour des clients grands comptes.",
      highlights: [
        {
          id: createId("highlight"),
          text: "Intégration de composants animés et accessibles pour des landing pages à fort trafic.",
        },
      ],
    },
  ];
}

function createDefaultEducation(): ResumeEducation[] {
  return [
    {
      id: createId("education"),
      degree: "Master Informatique",
      institution: "Université de Technologie",
      location: "Compiègne, France",
      startDate: "2014",
      endDate: "2019",
      details: "Spécialisation en architecture logicielle et UX.",
    },
  ];
}

function createDefaultSkills(): ResumeSkill[] {
  return [
    { id: createId("skill"), name: "Nuxt", level: "Expert" },
    { id: createId("skill"), name: "TypeScript", level: "Avancé" },
    { id: createId("skill"), name: "UI Design", level: "Intermédiaire" },
  ];
}

function createDefaultProjects(): ResumeProject[] {
  return [
    {
      id: createId("project"),
      name: "Portfolio interactif",
      description: "Application Nuxt 4 animée présentant un parcours professionnel.",
      link: "https://bro.world/portfolio",
    },
    {
      id: createId("project"),
      name: "Dashboard analytics",
      description: "Tableau de bord temps réel pour suivre les KPI produit.",
      link: "https://bro.world/analytics",
    },
  ];
}

function createDefaultSocials(): ResumeSocialLink[] {
  return [
    { id: createId("social"), label: "LinkedIn", url: "https://linkedin.com/in/alexdev" },
    { id: createId("social"), label: "GitHub", url: "https://github.com/alexdev" },
    { id: createId("social"), label: "Portfolio", url: "https://alexdev.example" },
  ];
}

function createDefaultResume(): ResumeData {
  return {
    personal: createDefaultPersonalInfo(),
    experiences: createDefaultExperiences(),
    education: createDefaultEducation(),
    skills: createDefaultSkills(),
    projects: createDefaultProjects(),
    interests: ["Motion design", "Voyage", "Mentorat"],
    socials: createDefaultSocials(),
    colors: createDefaultColors(),
    template: "classic",
  };
}

const templateOptions: ResumeTemplateOption[] = [
  {
    id: "classic",
    name: "Classique",
    description: "Deux colonnes avec accent discret.",
  },
  {
    id: "modern",
    name: "Moderne",
    description: "En-tête colorée avec résumé dense.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Typographie légère et grand espacement.",
  },
  {
    id: "bold",
    name: "Audacieux",
    description: "Accent vertical marqué et badges.",
  },
  {
    id: "elegant",
    name: "Élégant",
    description: "Cartes soignées et séparateurs fins.",
  },
];

export const useResumeStore = defineStore("resume", () => {
  const resume = ref<ResumeData>(createDefaultResume());
  const isHydrated = ref(false);

  function hydrate(payload: ResumeData | null | undefined) {
    if (!payload) {
      return;
    }

    resume.value = {
      ...payload,
      personal: { ...createDefaultPersonalInfo(), ...payload.personal },
      colors: { ...createDefaultColors(), ...payload.colors },
    };
  }

  function reset() {
    resume.value = createDefaultResume();
  }

  function updatePersonal(partial: Partial<ResumePersonalInfo>) {
    resume.value.personal = {
      ...resume.value.personal,
      ...partial,
    };
  }

  function setTemplate(id: ResumeTemplateId) {
    resume.value.template = id;
  }

  function addExperience() {
    resume.value.experiences.push({
      id: createId("experience"),
      position: "Nouveau poste",
      company: "Entreprise",
      location: "Ville, Pays",
      startDate: "2024",
      endDate: "Présent",
      description: "Décrivez votre mission et vos responsabilités clés.",
      highlights: [
        {
          id: createId("highlight"),
          text: "Décrivez une réalisation marquante.",
        },
      ],
    });
  }

  function removeExperience(id: string) {
    resume.value.experiences = resume.value.experiences.filter((item) => item.id !== id);
  }

  function addExperienceHighlight(experienceId: string) {
    const experience = resume.value.experiences.find((item) => item.id === experienceId);

    if (!experience) {
      return;
    }

    experience.highlights.push({
      id: createId("highlight"),
      text: "Nouvelle réussite.",
    });
  }

  function removeExperienceHighlight(experienceId: string, highlightId: string) {
    const experience = resume.value.experiences.find((item) => item.id === experienceId);

    if (!experience) {
      return;
    }

    experience.highlights = experience.highlights.filter((item) => item.id !== highlightId);
  }

  function addEducation() {
    resume.value.education.push({
      id: createId("education"),
      degree: "Nouveau diplôme",
      institution: "Établissement",
      location: "Ville, Pays",
      startDate: "2020",
      endDate: "2023",
      details: "Décrivez le cursus, les mentions ou projets phares.",
    });
  }

  function removeEducation(id: string) {
    resume.value.education = resume.value.education.filter((item) => item.id !== id);
  }

  function addSkill() {
    resume.value.skills.push({
      id: createId("skill"),
      name: "Nouvelle compétence",
      level: "Intermédiaire",
    });
  }

  function removeSkill(id: string) {
    resume.value.skills = resume.value.skills.filter((item) => item.id !== id);
  }

  function addProject() {
    resume.value.projects.push({
      id: createId("project"),
      name: "Nouveau projet",
      description: "Expliquez le contexte et le résultat obtenu.",
      link: "https://",
    });
  }

  function removeProject(id: string) {
    resume.value.projects = resume.value.projects.filter((item) => item.id !== id);
  }

  function addInterest() {
    resume.value.interests.push("Nouvel intérêt");
  }

  function updateInterest(index: number, value: string) {
    resume.value.interests[index] = value;
  }

  function removeInterest(index: number) {
    resume.value.interests.splice(index, 1);
  }

  function addSocial() {
    resume.value.socials.push({
      id: createId("social"),
      label: "Réseau",
      url: "https://",
    });
  }

  function removeSocial(id: string) {
    resume.value.socials = resume.value.socials.filter((item) => item.id !== id);
  }

  const colorPalette = computed(() => resume.value.colors);

  function updateColors(partial: Partial<ResumeColorPalette>) {
    resume.value.colors = {
      ...resume.value.colors,
      ...partial,
    };
  }

  watch(
    resume,
    (value) => {
      if (!import.meta.client) {
        return;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        if (import.meta.dev) {
          console.warn("[resume-store] Unable to persist resume data", error);
        }
      }
    },
    { deep: true },
  );

  onNuxtReady(() => {
    if (!import.meta.client) {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        hydrate(JSON.parse(stored) as ResumeData);
      }
    } catch (error) {
      if (import.meta.dev) {
        console.warn("[resume-store] Unable to hydrate resume data", error);
      }
    } finally {
      isHydrated.value = true;
    }
  });

  return {
    resume,
    isHydrated,
    templateOptions,
    colorPalette,
    hydrate,
    reset,
    updatePersonal,
    setTemplate,
    addExperience,
    removeExperience,
    addExperienceHighlight,
    removeExperienceHighlight,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    removeProject,
    addInterest,
    updateInterest,
    removeInterest,
    addSocial,
    removeSocial,
    updateColors,
  };
});
