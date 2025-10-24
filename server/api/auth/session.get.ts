import { defineEventHandler } from 'h3'
import { getAuthSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getAuthSession(event)
  if (!session) {
    return { user: null }
  }

  return { user: session.user, csrfToken: session.csrfToken }
})
