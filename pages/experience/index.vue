<template>
  <Experience />
</template>

<script setup lang="ts">
import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";
import Experience from "~/components/section/Experience.vue";

definePageMeta(LOCALIZED_PAGE_META.experience);
</script>
