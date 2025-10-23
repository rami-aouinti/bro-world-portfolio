import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { createSession } from '~/server/utils/session'
import { verifyUserCredentials, toPublicUser } from '~/server/utils/user-store'

const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide.'),
  password: z.string().min(1, 'Le mot de passe est requis.')
})

export default defineEventHandler(async (event) => {
  const payload = await readBody(event)

  const { email, password } = loginSchema.parse(payload)
  const user = await verifyUserCredentials(email, password)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })
  }

  await createSession(event, user)

  return {
    user: toPublicUser(user)
  }
})
