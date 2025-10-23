import { defineEventHandler } from 'h3'
import { listAllContent } from '~/server/utils/content-storage'

export default defineEventHandler(async () => {
  return await listAllContent()
})
