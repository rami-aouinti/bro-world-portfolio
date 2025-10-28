import { randomUUID } from "node:crypto";

import { createError } from "h3";
import slugify from "slugify";

import type {
  AdminLinkedinEducation,
  AdminLinkedinExperience,
  AdminLinkedinProfile,
} from "~/types/integrations";
import { deleteIntegrationSetting, getIntegrationSetting, setIntegrationSetting } from "~/server/utils/integration-settings";
import { readContent, writeContent } from "~/server/utils/content-storage";
import { DEFAULT_LOCALE, type LocaleCode } from "~/utils/i18n/locales";

const API_BASE_URL = "https://api.linkedin.com/v2";
const API_VERSION = "202401";

interface LinkedinLocalizedField {
  localized?: Record<string, string>;
  preferredLocale?: { language?: string; country?: string };
}

interface LinkedinTimePeriod {
  startDate?: { year?: number; month?: number } | null;
  endDate?: { year?: number; month?: number } | null;
}

interface LinkedinExperienceElement {
  entityUrn?: string;
  id?: string;
  title?: string | LinkedinLocalizedField;
  companyName?: string | LinkedinLocalizedField;
  company?: { name?: string | LinkedinLocalizedField } | null;
  description?: string | LinkedinLocalizedField;
  summary?: string | LinkedinLocalizedField;
  highlights?: string[];
  achievements?: string[];
  timePeriod?: LinkedinTimePeriod | null;
  startDate?: { year?: number; month?: number } | null;
  endDate?: { year?: number; month?: number } | null;
  isCurrent?: boolean;
}

interface LinkedinEducationElement {
  entityUrn?: string;
  id?: string;
  schoolName?: string | LinkedinLocalizedField;
  degreeName?: string | LinkedinLocalizedField;
  fieldOfStudy?: string | LinkedinLocalizedField;
  description?: string | LinkedinLocalizedField;
  activities?: string | LinkedinLocalizedField;
  grade?: string | LinkedinLocalizedField;
  timePeriod?: LinkedinTimePeriod | null;
  startDate?: { year?: number; month?: number } | null;
  endDate?: { year?: number; month?: number } | null;
}

interface LinkedinProfileResponse extends LinkedinLocalizedField {
  id: string;
  localizedFirstName?: string;
  localizedLastName?: string;
  vanityName?: string;
  profilePicture?: {
    "displayImage~"?: {
      elements?: Array<{
        identifiers?: Array<{ identifier?: string }>;
      }>;
    };
  };
  headline?: string | LinkedinLocalizedField;
  localizedHeadline?: string;
}

type LinkedinCollection<T> = { elements?: T[] };

interface LinkedinProfileResult {
  profile: AdminLinkedinProfile;
  vanityName?: string | null;
}

const FALLBACK_ACHIEVEMENT = "Experience imported from LinkedIn.";
const FALLBACK_EDUCATION_DETAIL = "Education imported from LinkedIn.";

function extractLocalized(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "object") {
    const record = value as LinkedinLocalizedField;
    const localized = record.localized ?? null;
    if (localized && typeof localized === "object") {
      if (record.preferredLocale?.language && record.preferredLocale?.country) {
        const key = `${record.preferredLocale.language}_${record.preferredLocale.country}`;
        if (typeof localized[key] === "string") {
          const candidate = localized[key]?.trim();
          if (candidate) {
            return candidate;
          }
        }
      }

      const firstEntry = Object.values(localized).find((entry) => typeof entry === "string" && entry.trim().length > 0);
      if (typeof firstEntry === "string") {
        return firstEntry.trim();
      }
    }
  }

  return null;
}

function formatDatePart(part?: { year?: number; month?: number } | null) {
  if (!part?.year) {
    return null;
  }

  const year = part.year;
  const month = part.month ? Math.max(1, Math.min(12, part.month)) - 1 : 0;
  const date = new Date(Date.UTC(year, month, 1));
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function formatTimeframe(period?: LinkedinTimePeriod | null, isCurrent?: boolean) {
  const start = formatDatePart(period?.startDate);
  const end = formatDatePart(period?.endDate);
  const endLabel = end ?? (isCurrent ? "Present" : null);

  if (start && endLabel) {
    return `${start} — ${endLabel}`;
  }

  if (start) {
    return `${start} — Present`;
  }

  return endLabel ?? "Present";
}

function safeSlug(...parts: Array<string | null | undefined>) {
  const base = parts.filter((part) => typeof part === "string" && part.trim().length > 0).join("-");
  const normalized = slugify(base, { lower: true, strict: true, trim: true });
  return normalized || `linkedin-entry-${randomUUID()}`;
}

function normalizeAchievements(element: LinkedinExperienceElement, role: string, company: string) {
  const achievements = new Set<string>();

  const description = extractLocalized(element.description) ?? extractLocalized(element.summary);
  if (description) {
    const segments = description
      .split(/\r?\n|•|-|\u2022/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (segments.length > 1) {
      segments.forEach((item) => achievements.add(item));
    } else {
      achievements.add(description);
    }
  }

  const collections = [element.highlights, element.achievements];
  for (const collection of collections) {
    if (Array.isArray(collection)) {
      collection.map((item) => item?.trim()).filter(Boolean).forEach((item) => achievements.add(item as string));
    }
  }

  if (achievements.size === 0) {
    achievements.add(`Experience imported from LinkedIn for ${role} at ${company}.`);
  }

  return Array.from(achievements);
}

function normalizeExperience(element: LinkedinExperienceElement): AdminLinkedinExperience {
  const role = extractLocalized(element.title) ?? (typeof element.title === "string" ? element.title : "Experience");
  const company =
    extractLocalized(element.companyName) ??
    (typeof element.companyName === "string" ? element.companyName : null) ??
    extractLocalized(element.company?.name) ??
    "Company";

  const timeframe = formatTimeframe(
    element.timePeriod ?? { startDate: element.startDate ?? undefined, endDate: element.endDate ?? undefined },
    element.isCurrent,
  );

  return {
    slug: safeSlug(role, company, element.id ?? element.entityUrn ?? undefined),
    role: role || "Experience",
    company: company || "Company",
    timeframe,
    achievements: normalizeAchievements(element, role || "Experience", company || "Company"),
  };
}

function normalizeEducation(element: LinkedinEducationElement): AdminLinkedinEducation {
  const institution =
    extractLocalized(element.schoolName) ||
    (typeof element.schoolName === "string" ? element.schoolName : null) ||
    "Institution";
  const degreeName = extractLocalized(element.degreeName) ?? (typeof element.degreeName === "string" ? element.degreeName : null);
  const field = extractLocalized(element.fieldOfStudy) ?? (typeof element.fieldOfStudy === "string" ? element.fieldOfStudy : null);

  const degree = [degreeName, field].filter((value) => value && value.trim().length > 0).join(" · ") || degreeName || "Education";
  const timeframe = formatTimeframe(
    element.timePeriod ?? { startDate: element.startDate ?? undefined, endDate: element.endDate ?? undefined },
  );

  const description =
    extractLocalized(element.description) ??
    extractLocalized(element.activities) ??
    extractLocalized(element.grade) ??
    null;

  return {
    slug: safeSlug(degree, institution, element.id ?? element.entityUrn ?? undefined),
    degree: degree || "Education",
    institution: institution || "Institution",
    timeframe,
    details: description?.trim().length ? description.trim() : FALLBACK_EDUCATION_DETAIL,
  };
}

async function linkedinFetch<T>(endpoint: string, token: string, query?: Record<string, unknown>) {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": API_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };

  return await $fetch<T>(`${API_BASE_URL}${endpoint}`, {
    headers,
    query,
  });
}

export async function fetchLinkedinProfile(token: string): Promise<LinkedinProfileResult> {
  try {
    const profile = await linkedinFetch<LinkedinProfileResponse>("/me", token, {
      projection: "(id,localizedFirstName,localizedLastName,localizedHeadline,headline,vanityName,profilePicture(displayImage~:playableStreams))",
    });

    const avatar =
      profile.profilePicture?.["displayImage~"]?.elements?.flatMap((element) => element.identifiers ?? [])?.find(
        (identifier) => Boolean(identifier.identifier),
      )?.identifier ?? null;

    const headline = extractLocalized(profile.headline) ?? profile.localizedHeadline ?? null;

    const adminProfile: AdminLinkedinProfile = {
      id: profile.id,
      firstName: profile.localizedFirstName ?? null,
      lastName: profile.localizedLastName ?? null,
      headline,
      profileUrl: profile.vanityName ? `https://www.linkedin.com/in/${profile.vanityName}` : null,
      avatarUrl: avatar,
    };

    return { profile: adminProfile, vanityName: profile.vanityName ?? null };
  } catch (error) {
    console.error("[linkedin] Failed to fetch profile", error);
    throw createError({ statusCode: 401, statusMessage: "Le token LinkedIn est invalide ou expiré." });
  }
}

export async function fetchLinkedinExperiences(token: string) {
  try {
    const response = await linkedinFetch<LinkedinCollection<LinkedinExperienceElement>>("/positionsV2", token, {
      q: "criteria",
      start: 0,
      count: 50,
      projection:
        "(elements*(id,entityUrn,title,companyName,company(name),description,summary,highlights,achievements,timePeriod,startDate,endDate,isCurrent))",
    });

    return (response.elements ?? []).map(normalizeExperience);
  } catch (error) {
    console.error("[linkedin] Failed to fetch experiences", error);
    return [] as AdminLinkedinExperience[];
  }
}

export async function fetchLinkedinEducation(token: string) {
  try {
    const response = await linkedinFetch<LinkedinCollection<LinkedinEducationElement>>("/educations", token, {
      q: "criteria",
      start: 0,
      count: 50,
      projection:
        "(elements*(id,entityUrn,schoolName,degreeName,fieldOfStudy,description,activities,grade,timePeriod,startDate,endDate))",
    });

    return (response.elements ?? []).map(normalizeEducation);
  } catch (error) {
    console.error("[linkedin] Failed to fetch education", error);
    return [] as AdminLinkedinEducation[];
  }
}

export async function connectLinkedinIntegration(token: string) {
  const { profile, vanityName } = await fetchLinkedinProfile(token);

  await Promise.all([
    setIntegrationSetting("linkedin", "token", token.trim(), { isSecret: true }),
    setIntegrationSetting("linkedin", "profileId", profile.id, { isSecret: false }),
    setIntegrationSetting("linkedin", "vanityName", vanityName ?? "", { isSecret: false }),
    setIntegrationSetting("linkedin", "connectedAt", new Date().toISOString(), { isSecret: false }),
  ]);

  return profile;
}

export async function disconnectLinkedinIntegration() {
  await Promise.all([
    deleteIntegrationSetting("linkedin", "token"),
    deleteIntegrationSetting("linkedin", "profileId"),
    deleteIntegrationSetting("linkedin", "vanityName"),
    deleteIntegrationSetting("linkedin", "connectedAt"),
    deleteIntegrationSetting("linkedin", "lastSyncedAt"),
    deleteIntegrationSetting("linkedin", "lastSyncedLocale"),
  ]);
}

export async function resolveLinkedinToken() {
  const tokenSetting = await getIntegrationSetting("linkedin", "token");
  return tokenSetting?.value ?? null;
}

export async function syncLinkedinContent(token: string, locale: LocaleCode = DEFAULT_LOCALE) {
  const [profileResult, experiences, education] = await Promise.all([
    fetchLinkedinProfile(token),
    fetchLinkedinExperiences(token),
    fetchLinkedinEducation(token),
  ]);

  const experiencesContent = await readContent("experiences", locale);
  const educationContent = await readContent("education", locale);

  await writeContent("experiences", locale, {
    ...experiencesContent,
    positions: experiences.length ? experiences : experiencesContent.positions,
  });

  await writeContent("education", locale, {
    ...educationContent,
    schools: education.length ? education : educationContent.schools,
  });

  await Promise.all([
    setIntegrationSetting("linkedin", "lastSyncedAt", new Date().toISOString()),
    setIntegrationSetting("linkedin", "lastSyncedLocale", locale),
  ]);

  return {
    profile: profileResult.profile,
    experiences,
    education,
  };
}

export async function getLinkedinIntegrationState(locale: LocaleCode = DEFAULT_LOCALE) {
  const [tokenSetting, connectedAtSetting, lastSyncedAtSetting, lastSyncedLocaleSetting] = await Promise.all([
    getIntegrationSetting("linkedin", "token"),
    getIntegrationSetting("linkedin", "connectedAt"),
    getIntegrationSetting("linkedin", "lastSyncedAt"),
    getIntegrationSetting("linkedin", "lastSyncedLocale"),
  ]);

  const token = tokenSetting?.value ?? null;

  if (!token) {
    return {
      connected: false,
      locale,
      profile: null,
      experiences: [] as AdminLinkedinExperience[],
      education: [] as AdminLinkedinEducation[],
      lastSyncedAt: null,
      connectedAt: null,
    };
  }

  const resolvedLocale = (lastSyncedLocaleSetting?.value as LocaleCode | undefined) ?? locale;

  const [profileResult, experiencesContent, educationContent] = await Promise.all([
    fetchLinkedinProfile(token),
    readContent("experiences", resolvedLocale),
    readContent("education", resolvedLocale),
  ]);

  return {
    connected: true,
    locale: resolvedLocale,
    profile: profileResult.profile,
    experiences: experiencesContent.positions as AdminLinkedinExperience[],
    education: educationContent.schools as AdminLinkedinEducation[],
    lastSyncedAt: lastSyncedAtSetting?.value ?? null,
    connectedAt: connectedAtSetting?.value ?? null,
  };
}
