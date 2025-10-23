<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'

definePageMeta(LOCALIZED_PAGE_META.service)
</script>

<template>
  <LayoutLine />
  <SectionService />
  <LayoutLine />
</template>
