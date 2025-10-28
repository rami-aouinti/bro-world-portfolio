<template>
  <Service />
</template>

<script setup lang="ts">
import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";
import Service from "~/components/section/Service.vue";

definePageMeta({
  ...LOCALIZED_PAGE_META.service,
});
</script>
