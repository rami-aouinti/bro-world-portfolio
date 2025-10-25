<template>
  <div class="relative">
    <div class="rounded-full bg-blue-700 top-0 -left-52 w-80 h-[40rem] absolute blur-[200px]"></div>
    <Work />
  </div>
</template>

<script setup lang="ts">
import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";
import Work from "~/components/section/Work.vue";

definePageMeta(LOCALIZED_PAGE_META.work);
</script>
