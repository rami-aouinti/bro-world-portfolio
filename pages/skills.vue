<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'

definePageMeta(LOCALIZED_PAGE_META.skills)
</script>

<template>
  <Line />
  <Skills />
  <Line />
</template>
<script setup lang="ts">
import Line from "~/components/Layout/Line.vue";
import Skills from "~/components/section/Skills.vue";
</script>