import { randomUUID } from 'node:crypto'
import { useRuntimeConfig, useStorage } from '#imports'
import { hashPassword, verifyPassword } from './password'

export type UserRole = 'admin'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string
  createdAt: string
  updatedAt: string
}

const USERS_KEY = 'users.json'

function getUserStorage() {
  return useStorage('auth')
}

export async function listUsers() {
  const storage = getUserStorage()
  const users = await storage.getItem<AdminUser[]>(USERS_KEY)
  return users ?? []
}

export async function saveUsers(users: AdminUser[]) {
  const storage = getUserStorage()
  await storage.setItem(USERS_KEY, users)
}

export async function findUserByEmail(email: string) {
  const users = await listUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
}

export async function ensureDefaultAdmin() {
  const config = useRuntimeConfig()
  const users = await listUsers()

  if (users.some((user) => user.role === 'admin')) {
    return
  }

  const email = config.admin.defaultEmail
  const password = config.admin.defaultPassword

  const admin: AdminUser = {
    id: randomUUID(),
    email,
    name: 'Administrator',
    role: 'admin',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await saveUsers([...users, admin])
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user) {
    return null
  }

  const isValid = verifyPassword(password, user.passwordHash)
  if (!isValid) {
    return null
  }

  return user
}

export async function findUserById(id: string) {
  const users = await listUsers()
  return users.find((user) => user.id === id) ?? null
}

export function toPublicUser(user: AdminUser) {
  const { passwordHash: _passwordHash, ...rest } = user
  return rest
}
