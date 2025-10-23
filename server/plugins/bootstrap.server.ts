import { defineNitroPlugin } from 'nitro/app'
import { ensureContentDefaults } from '../utils/content-storage'
import { ensureDefaultAdmin } from '../utils/user-store'

export default defineNitroPlugin(async () => {
  await ensureContentDefaults()
  await ensureDefaultAdmin()
})
