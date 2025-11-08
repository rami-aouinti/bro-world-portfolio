import { SUPPORTED_LOCALES, type LocaleCode } from "~/utils/i18n/locales";

type LocalizedPaths = Record<LocaleCode, `/${string}`>;

type RouteKey =
  | "blog"
  | "about"
  | "contact"
  | "education"
  | "experience"
  | "service"
  | "skills"
  | "work"
  | "projects"
  | "help";

const LOCALIZED_ROUTE_PATHS: Record<RouteKey, LocalizedPaths> = {
  blog: {
    en: "/blog",
    fr: "/blog",
    de: "/blog",
    es: "/blog",
    it: "/blog",
    ru: "/blog",
    ar: "/blog",
  },
  about: {
    en: "/about",
    fr: "/a-propos",
    de: "/ueber-mich",
    es: "/sobre-mi",
    it: "/chi-sono",
    ru: "/o-mne",
    ar: "/hawl",
  },
  contact: {
    en: "/contact",
    fr: "/contact",
    de: "/kontakt",
    es: "/contacto",
    it: "/contatto",
    ru: "/kontakt",
    ar: "/ittisal",
  },
  education: {
    en: "/education",
    fr: "/formation",
    de: "/bildung",
    es: "/formacion",
    it: "/formazione",
    ru: "/obrazovanie",
    ar: "/taalim",
  },
  experience: {
    en: "/experience",
    fr: "/experiences",
    de: "/erfahrung",
    es: "/experiencia",
    it: "/esperienza",
    ru: "/opyt",
    ar: "/khibrat",
  },
  service: {
    en: "/services",
    fr: "/services",
    de: "/leistungen",
    es: "/servicios",
    it: "/servizi",
    ru: "/uslugi",
    ar: "/khadamat",
  },
  skills: {
    en: "/skills",
    fr: "/competences",
    de: "/kompetenzen",
    es: "/habilidades",
    it: "/competenze",
    ru: "/navyki",
    ar: "/maharat",
  },
  work: {
    en: "/work",
    fr: "/travaux",
    de: "/projekte",
    es: "/trabajos",
    it: "/lavori",
    ru: "/raboty",
    ar: "/aamal",
  },
  projects: {
    en: "/projects",
    fr: "/projets-github",
    de: "/github-projekte",
    es: "/proyectos-github",
    it: "/progetti-github",
    ru: "/github-proekty",
    ar: "/masharie-github",
  },
  help: {
    en: "/help",
    fr: "/aide",
    de: "/hilfe",
    es: "/ayuda",
    it: "/aiuto",
    ru: "/pomoshch",
    ar: "/musaaeda",
  },
};

export const LOCALIZED_PAGE_META = Object.freeze(
  Object.fromEntries(
    Object.entries(LOCALIZED_ROUTE_PATHS).map(([key, paths]) => [key, { i18n: { paths } }]),
  ) as Record<RouteKey, { i18n: { paths: LocalizedPaths } }>,
);

export type LocalizedRouteKey = RouteKey;

export const LOCALIZED_LOCALES: readonly LocaleCode[] = SUPPORTED_LOCALES;
