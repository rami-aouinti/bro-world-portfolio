import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { assertContentSlug, readContent, writeContent } from '~/server/utils/content-storage'
import { assertCsrf } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug requis.' })
  }

  assertContentSlug(slug)

  switch (event.method) {
    case 'GET':
      return await readContent(slug)
    case 'PUT':
    case 'PATCH': {
      await assertCsrf(event)
      const body = await readBody(event)
      return await writeContent(slug, body)
    }
    default:
      throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée.' })
  }
})
