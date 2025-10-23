import { defineEventHandler } from 'h3'
import { getSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  if (!session) {
    return { user: null }
  }

  return { user: session.user, csrfToken: session.csrfToken }
})
