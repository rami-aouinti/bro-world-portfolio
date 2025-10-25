import { z, type ZodTypeAny } from 'zod'

export const navLinkSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  url: z.string().trim().min(1, 'L’URL est requise.')
})

export const profileSchema = z.object({
  firstname: z.string().trim().min(1, 'Le prénom est requis.'),
  lastname: z.string().trim().min(1, 'Le nom est requis.'),
  role: z.string().trim().min(1, 'Le rôle est requis.'),
  avatar: z.string().trim().min(1, 'Le chemin de l’image est requis.')
})

export const heroSchema = z.object({
  badge: z.string().trim().min(1, 'Le badge est requis.'),
  headline: z.string().trim().min(1, 'Le titre est requis.'),
  subline: z.string().trim().min(1, 'La description est requise.')
})

const serviceItemSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.'),
  icon: z.string().trim().min(1, 'L’icône est requise.'),
  description: z.string().trim().min(1, 'La description est requise.'),
  thumbnails: z.string().trim().optional().default('')
})

export const serviceSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  headline: z.string().trim().min(1, 'Le titre est requis.'),
  subline: z.string().trim().min(1, 'La description est requise.'),
  services: z.array(serviceItemSchema).min(1, 'Ajoutez au moins un service.')
})

const workItemSchema = z.object({
  name: z.string().trim().min(1, 'Le nom du projet est requis.'),
  slug: z.string().trim().min(1, 'Le slug est requis.'),
  live_demo: z.string().trim().min(1, 'Le lien est requis.'),
  description: z.string().trim().min(1, 'La description est requise.'),
  thumbnails: z.string().trim().min(1, 'L’image est requise.'),
  type: z.string().trim().min(1, 'Le type est requis.')
})

export const workSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  headline: z.string().trim().min(1, 'Le titre est requis.'),
  subline: z.string().trim().min(1, 'La description est requise.'),
  works: z.array(workItemSchema).min(1, 'Ajoutez au moins un projet.')
})

export const aboutSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  introduce: z.array(z.string().trim().min(1, 'Le paragraphe est requis.')).min(1, 'Ajoutez au moins un paragraphe.'),
  hobbies: z
    .array(z.string().trim().min(1, 'Le hobby est requis.'))
    .optional()
    .default([])
})

export const ctaSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  description: z.string().trim().min(1, 'La description est requise.')
})

const skillCategorySchema = z.object({
  name: z.string().trim().min(1, 'Le nom de la catégorie est requis.'),
  skills: z.array(z.string().trim().min(1, 'Le nom de la compétence est requis.')).min(1, 'Ajoutez au moins une compétence.')
})

export const skillsSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  headline: z.string().trim().min(1, 'Le titre est requis.'),
  subline: z.string().trim().min(1, 'La description est requise.'),
  categories: z.array(skillCategorySchema).min(1, 'Ajoutez au moins une catégorie.'),
  languages: z
    .array(z.string().trim().min(1, 'La langue est requise.'))
    .optional()
    .default([])
})

const experienceSchema = z.object({
  slug: z.string().trim().min(1, 'Le slug est requis.'),
  role: z.string().trim().min(1, 'Le rôle est requis.'),
  company: z.string().trim().min(1, 'L’entreprise est requise.'),
  timeframe: z.string().trim().min(1, 'La période est requise.'),
  achievements: z.array(z.string().trim().min(1, 'Le détail est requis.')).min(1, 'Ajoutez au moins une réalisation.')
})

export const experiencesSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  headline: z.string().trim().min(1, 'Le titre est requis.'),
  positions: z.array(experienceSchema).min(1, 'Ajoutez au moins une expérience.')
})

const educationItemSchema = z.object({
  slug: z.string().trim().min(1, 'Le slug est requis.'),
  degree: z.string().trim().min(1, 'Le diplôme est requis.'),
  institution: z.string().trim().min(1, 'L’établissement est requis.'),
  timeframe: z.string().trim().min(1, 'La période est requise.'),
  details: z.string().trim().min(1, 'Les détails sont requis.')
})

const contactItemSchema = z.object({
  degree: z.string().trim().min(1, 'Le diplôme est requis.'),
  institution: z.string().trim().min(1, 'L’établissement est requis.'),
  timeframe: z.string().trim().min(1, 'La période est requise.'),
  details: z.string().trim().min(1, 'Les détails sont requis.')
})

export const educationSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  headline: z.string().trim().min(1, 'Le titre est requis.'),
  schools: z.array(educationItemSchema).min(1, 'Ajoutez au moins une formation.')
})

export const contactSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.'),
  headline: z.string().trim().min(1, 'Le titre est requis.'),
  contact: z.array(contactItemSchema).min(1, 'Ajoutez au moins une formation.')
})

const schemas = {
  navlinks: z.array(navLinkSchema),
  profile: profileSchema,
  hero: heroSchema,
  service: serviceSchema,
  work: workSchema,
  about: aboutSchema,
  cta: ctaSchema,
  skills: skillsSchema,
  experiences: experiencesSchema,
  education: educationSchema,
  contact: contactSchema
} as const satisfies Record<string, ZodTypeAny>

export type ContentSlug = keyof typeof schemas

export type ContentRecord = {
  [K in ContentSlug]: z.infer<(typeof schemas)[K]>
}

export const contentSchemas = schemas

export function isContentSlug(value: string): value is ContentSlug {
  return value in schemas
}

export function parseContentBySlug<TSlug extends ContentSlug>(slug: TSlug, payload: unknown) {
  return schemas[slug].parse(payload) as ContentRecord[TSlug]
}
