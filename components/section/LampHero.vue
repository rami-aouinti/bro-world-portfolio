<template>
  <section
    v-if="personalContent"
    id="lamp-hero"
    class="lamp-hero"
  >
    <LampEffect
      class="lamp-hero__wrapper"
      content-class="lamp-hero__content"
      :delay="0.25"
      :duration="1"
    >
      <div
        v-if="personalContent.badge"
        class="lamp-hero__badge"
      >
        <v-chip
          color="primary"
          variant="flat"
          size="small"
        >
          {{ personalContent.badge }}
        </v-chip>
      </div>

      <h2 class="lamp-hero__headline">
        {{ personalContent.headline }}
      </h2>

      <p class="lamp-hero__description">
        {{ personalContent.subline }}
      </p>

      <div class="lamp-hero__actions">
        <Button
          :label="t('portfolio.personal.viewProjects')"
          :to="resolveLocalizedRouteTarget('/work', localePath)"
        />
        <Button
          :label="t('portfolio.personal.contact')"
          :to="resolveLocalizedRouteTarget('/contact', localePath)"
          variant="btn-dark"
        />
      </div>
    </LampEffect>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { LampEffect } from "~/components/Ui/lamp-effect";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

const { data: personal } = useContentBlock("hero");
const { t } = useI18n();
const localePath = useLocalePath();

const personalContent = computed(() => personal.value);
</script>

<style scoped>
.lamp-hero {
  position: relative;
  margin-bottom: 6rem;
}

.lamp-hero__wrapper {
  min-height: clamp(520px, 85vh, 720px);
  padding-block: clamp(48px, 10vw, 80px);
}

.lamp-hero__content {
  transform: translateY(-8rem);
  gap: clamp(20px, 4vw, 28px);
  text-align: center;
  max-width: min(90vw, 680px);
  color: rgb(226 232 240);
}

.lamp-hero__badge {
  display: flex;
  justify-content: center;
}

.lamp-hero__headline {
  font-size: clamp(2.5rem, 6vw, 3.8rem);
  font-weight: 700;
  line-height: 1.1;
  color: #f8fafc;
}

.lamp-hero__description {
  font-size: clamp(1.05rem, 2.5vw, 1.25rem);
  color: rgba(226, 232, 240, 0.85);
}

.lamp-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .lamp-hero__content {
    transform: translateY(-6rem);
  }
}
</style>
