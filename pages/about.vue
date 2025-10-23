<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'

definePageMeta(LOCALIZED_PAGE_META.about)
</script>

<template>
  <SectionAbout />
  <LayoutLine />
  <SectionSkills />
  <LayoutLine />
  <SectionExperience />
  <LayoutLine />
  <SectionEducation />
  <SectionCta />
</template>
