<template>
  <div />
</template>

<script setup lang="ts">
if (import.meta.server) {
  await navigateTo("/admin/login", { replace: true });
} else {
  navigateTo("/admin/login", { replace: true });
}
</script>
