export type ResumeTemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "bold"
  | "elegant";

export interface ResumeColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}

export interface ResumePersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ResumeExperienceHighlight {
  id: string;
  text: string;
}

export interface ResumeExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: ResumeExperienceHighlight[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  level: string;
}

export interface ResumeSocialLink {
  id: string;
  label: string;
  url: string;
}

export interface ResumeData {
  personal: ResumePersonalInfo;
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  interests: string[];
  socials: ResumeSocialLink[];
  colors: ResumeColorPalette;
  template: ResumeTemplateId;
}

export interface ResumeTemplateOption {
  id: ResumeTemplateId;
  name: string;
  description: string;
}

export type ResumeSectionKey =
  | "personal"
  | "experiences"
  | "education"
  | "skills"
  | "projects"
  | "interests"
  | "socials"
  | "colors"
  | "template";
