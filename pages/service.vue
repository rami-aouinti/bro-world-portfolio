<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import Service from "~/components/Section/Service.vue";

definePageMeta(LOCALIZED_PAGE_META.service)
</script>

<template>
  <Service />
</template>
