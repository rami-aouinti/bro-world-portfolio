import { DEFAULT_CONTENT } from '~/utils/content'
import type { ContentRecord, ContentSlug } from '~/types/content'
import { contentSchemas, parseContentBySlug } from '~/types/content'
import { createError } from 'h3'
import { useStorage } from '#imports'

const CONTENT_FILE_EXTENSION = '.json'

function getContentKey(slug: ContentSlug) {
  return `${slug}${CONTENT_FILE_EXTENSION}`
}

function getContentStorage() {
  return useStorage('content')
}

export async function ensureContentDefaults() {
  const storage = getContentStorage()

  await Promise.all(
    (Object.keys(DEFAULT_CONTENT) as ContentSlug[]).map(async (slug) => {
      const key = getContentKey(slug)
      const existing = await storage.getItem(key)
      if (existing === null) {
        await storage.setItem(key, DEFAULT_CONTENT[slug])
      }
    })
  )
}

export async function listAllContent() {
  const record: Partial<ContentRecord> = {}
  await Promise.all(
    (Object.keys(DEFAULT_CONTENT) as ContentSlug[]).map(async (slug) => {
      record[slug] = await readContent(slug)
    })
  )
  return record as ContentRecord
}

export async function readContent<TSlug extends ContentSlug>(slug: TSlug) {
  const storage = getContentStorage()
  const key = getContentKey(slug)
  const raw = await storage.getItem(key)

  if (raw === null) {
    const fallback = DEFAULT_CONTENT[slug]
    await storage.setItem(key, fallback)
    return fallback
  }

  const schema = contentSchemas[slug]
  const parsed = schema.safeParse(raw)

  if (parsed.success) {
    return parsed.data
  }

  console.error(`Impossible de valider le bloc “${slug}”.`, parsed.error)

  const fallback = DEFAULT_CONTENT[slug]
  await storage.setItem(key, fallback)
  return fallback
}

export async function writeContent<TSlug extends ContentSlug>(slug: TSlug, payload: unknown) {
  const storage = getContentStorage()
  try {
    const parsed = parseContentBySlug(slug, payload)
    await storage.setItem(getContentKey(slug), parsed)
    return parsed
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Le contenu fourni pour “${slug}” est invalide.`,
      data: error
    })
  }
}

export function assertContentSlug(value: string): asserts value is ContentSlug {
  if (!(value in contentSchemas)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Section introuvable.'
    })
  }
}
