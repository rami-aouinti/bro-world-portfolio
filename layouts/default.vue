<template>
  <v-app>
    <div class="nav-shell">
      <v-btn class="nav-shell__button nav-shell__button--left" color="primary" variant="outlined">
        Left Button
      </v-btn>
      <Navbar />
      <v-btn class="nav-shell__button nav-shell__button--right" color="primary" variant="flat">
        Right Button
      </v-btn>
    </div>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import Navbar from "~/components/Layout/Navbar.vue";
</script>
<style scoped>
.nav-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 3vw, 24px);
  padding-inline: clamp(12px, 3vw, 24px);
  margin-top: 6px;
}

.nav-shell__button {
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

@media (max-width: 960px) {
  .nav-shell {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
  }

  .nav-shell__button {
    order: 1;
  }

  .nav-shell :deep(.hero-app-bar) {
    order: 2;
    margin-inline: auto;
  }
}

@media (max-width: 600px) {
  .nav-shell {
    padding-inline: 12px;
  }
}
</style>