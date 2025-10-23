import { randomUUID } from 'node:crypto'
import { createError, deleteCookie, getCookie, setCookie } from 'h3'
import { useRuntimeConfig, useStorage } from '#imports'
import type { AdminUser } from './user-store'
import { findUserById, toPublicUser } from './user-store'

interface SessionRecord {
  token: string
  userId: string
  role: AdminUser['role']
  csrfToken: string
  expiresAt: number
  createdAt: number
}

const SESSION_PREFIX = 'sessions:'

function getSessionStorage() {
  return useStorage('auth')
}

function getSessionKey(token: string) {
  return `${SESSION_PREFIX}${token}`
}

export async function createSession(event: Parameters<typeof setCookie>[0], user: AdminUser) {
  const config = useRuntimeConfig()
  const storage = getSessionStorage()
  const token = randomUUID()
  const csrfToken = randomUUID()
  const maxAge = config.auth.sessionMaxAge
  const now = Date.now()

  const session: SessionRecord = {
    token,
    userId: user.id,
    role: user.role,
    csrfToken,
    expiresAt: now + maxAge * 1000,
    createdAt: now
  }

  await storage.setItem(getSessionKey(token), session)

  setCookie(event, config.auth.sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge
  })

  setCookie(event, config.auth.csrfCookieName, csrfToken, {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge
  })

  return session
}

export async function getSession(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig()
  const storage = getSessionStorage()
  const token = getCookie(event, config.auth.sessionCookieName)
  if (!token) {
    return null
  }

  const session = await storage.getItem<SessionRecord>(getSessionKey(token))
  if (!session) {
    return null
  }

  if (session.expiresAt < Date.now()) {
    await storage.removeItem(getSessionKey(token))
    deleteCookie(event, config.auth.sessionCookieName)
    deleteCookie(event, config.auth.csrfCookieName)
    return null
  }

  const user = await findUserById(session.userId)
  if (!user) {
    await storage.removeItem(getSessionKey(token))
    return null
  }

  return {
    token,
    csrfToken: session.csrfToken,
    user: toPublicUser(user)
  }
}

export async function requireAdminSession(event: Parameters<typeof getCookie>[0]) {
  const session = await getSession(event)
  if (!session || session.user.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Authentification requise.' })
  }
  return session
}

export async function destroySession(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig()
  const storage = getSessionStorage()
  const token = getCookie(event, config.auth.sessionCookieName)
  if (!token) {
    return
  }

  await storage.removeItem(getSessionKey(token))
  deleteCookie(event, config.auth.sessionCookieName)
  deleteCookie(event, config.auth.csrfCookieName)
}

export async function assertCsrf(event: Parameters<typeof getCookie>[0]) {
  const config = useRuntimeConfig()
  const headerToken = event.node.req.headers['x-csrf-token']
  if (!headerToken) {
    throw createError({ statusCode: 400, statusMessage: 'Token CSRF manquant.' })
  }

  const session = await requireAdminSession(event)
  if (Array.isArray(headerToken) || headerToken !== session.csrfToken) {
    throw createError({ statusCode: 400, statusMessage: 'Token CSRF invalide.' })
  }
}
