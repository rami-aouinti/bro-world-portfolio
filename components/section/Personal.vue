<template>
  <section
    id="personal"
    class="personal"
  >
    <ScrollSmooth initially-visible>
      <v-container
        v-if="personalContent"
        class="personal__container py-6 my-auto py-md-24"
      >
        <v-row
          justify="center"
          class="text-center"
        >
          <v-col
            cols="12"
            md="10"
            lg="8"
            class="personal__content mt-8"
          >
            <Text3d
              class="text-8xl font-bold max-md:text-7xl"
              shadow-color="primary"
              :stroke-size="headlineStrokeSize"
              :shadow1-size="headlineShadowOneSize"
              :shadow2-size="headlineShadowTwoSize"
              :letter-spacing="headlineLetterSpacing"
            >
              <h1 class="personal__headline">
                {{ personalContent.headline }}
              </h1>
            </Text3d>

            <p class="personal__description text-foreground">
              {{ personalContent.subline }}
            </p>
            <v-chip
              v-if="personalContent?.badge"
              color="primary"
              variant="outlined"
              class="personal__badge text-uppercase"
            >
              {{ personalContent.badge }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery, useMounted } from "@vueuse/core";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";

import { Text3d } from "~/components/ui/text-3d";

const { data: personal } = useContentBlock("hero");

const personalContent = computed(() => personal.value);

const isMounted = useMounted();
const compactViewportQuery = useMediaQuery("(max-width: 640px)", {
  initialValue: false,
});
const isCompactViewport = computed(() => isMounted.value && compactViewportQuery.value);

const headlineStrokeSize = computed(() => (isCompactViewport.value ? 8 : 20));
const headlineShadowOneSize = computed(() => (isCompactViewport.value ? 4 : 7));
const headlineShadowTwoSize = computed(() => (isCompactViewport.value ? 6 : 10));
const headlineLetterSpacing = computed(() => (isCompactViewport.value ? -0.05 : -0.1));
</script>

<style scoped>
.personal {
  position: relative;
}

.personal__container {
  min-height: clamp(560px, 82vh, 760px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.personal__badge {
  align-items: center;
  border-color: rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.4);
  color: #cbd5f5;
  font-weight: 600;
  letter-spacing: 0.18em;
  padding-inline: 18px;
}

.personal__headline {
  font-size: clamp(2.2rem, 5vw + 1.1rem, 4.75rem);
  line-height: 1.1;
  font-weight: 800;
  text-shadow: 0 16px 36px rgba(15, 23, 42, 0.6);
}

.personal__description {
  padding: clamp(16px, 6vw, 30px);
  max-width: 680px;
  font-size: clamp(1.05rem, 1vw + 1rem, 1.25rem);
  line-height: 1.7;
}

.personal__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: clamp(12px, 4vw, 20px);
  gap: 18px;
}

@media (max-width: 1024px) {
  .personal__container {
    min-height: auto;
    padding-block: clamp(48px, 18vw, 96px);
  }

  .personal__description {
    padding: 18px 0 24px;
  }
}

@media (max-width: 640px) {
  .personal__container {
    padding-inline: 1.25rem;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.8);
  }
}
</style>
