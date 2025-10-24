<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import Education from "~/components/section/Education.vue";

definePageMeta(LOCALIZED_PAGE_META.education)
</script>

<template>
  <Education />
</template>
