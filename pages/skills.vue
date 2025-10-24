<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import Line from "~/components/Layout/Line.vue";
import Skills from "~/components/section/Skills.vue";
definePageMeta(LOCALIZED_PAGE_META.skills)
</script>

<template>
  <Skills />
</template>