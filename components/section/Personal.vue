<script setup lang="ts">
import { computed } from 'vue'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

const { data: personal } = useContentBlock('hero')
const { data: work } = useContentBlock('work')

const personalContent = computed(() => personal.value)
const workItems = computed(() => work.value?.works ?? [])
</script>

<template>
  <section id="personal" class="personal">
    <div class="personal__background" aria-hidden="true">
      <span class="personal__glow personal__glow--one"></span>
      <span class="personal__glow personal__glow--two"></span>
      <span class="personal__glow personal__glow--three"></span>
      <span class="personal__spark personal__spark--one"></span>
      <span class="personal__spark personal__spark--two"></span>
      <span class="personal__spark personal__spark--three"></span>
    </div>
    <LayoutScrollSmooth>
      <v-container class="personal__container py-16 py-md-24" v-if="personalContent">
        <v-row justify="center" class="text-center">
          <v-col cols="12" md="10" lg="8" class="personal__content">
            <v-chip
              v-if="personalContent?.badge"
              color="primary"
              variant="outlined"
              class="personal__badge text-uppercase"
            >
              {{ personalContent.badge }}
            </v-chip>
            <h1 class="personal__headline">
              {{ personalContent.headline }}
            </h1>
            <p class="personal__description">
              {{ personalContent.subline }}
            </p>
            <div class="personal__actions">
              <Button label="View Work" to="/work" />
              <Button label="Contact Me" to="/contact" variant="btn-dark" />
            </div>
          </v-col>
        </v-row>

        <v-slide-group show-arrows class="personal__carousel">
          <v-slide-group-item v-for="item in workItems" :key="item.name">
            <v-card class="personal__card">
              <v-img :src="`/images/work/${item.thumbnails}`" :alt="item.name" height="200" cover />
              <v-card-title>{{ item.name }}</v-card-title>
              <v-card-subtitle>{{ item.type }}</v-card-subtitle>
              <v-card-text class="text-body-2">
                {{ item.description }}
              </v-card-text>
              <v-card-actions>
                <v-btn :to="item.live_demo" target="_blank" color="primary" variant="text" class="text-none">
                  See project
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-container>
    </LayoutScrollSmooth>
  </section>
</template>

<style scoped>
.personal {
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 55%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.18), transparent 50%),
    #050816;
  color: #f8fafc;
}

.personal__background {
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.personal__glow {
  position: absolute;
  filter: blur(120px);
  opacity: 0.7;
  border-radius: 999px;
}

.personal__glow--one {
  background: rgba(59, 130, 246, 0.6);
  height: 420px;
  width: 420px;
  top: -120px;
  left: -160px;
}

.personal__glow--two {
  background: rgba(14, 165, 233, 0.55);
  height: 320px;
  width: 320px;
  top: 180px;
  right: -140px;
}

.personal__glow--three {
  background: rgba(168, 85, 247, 0.45);
  height: 260px;
  width: 260px;
  bottom: 80px;
  left: 40%;
}

.personal__spark {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.55);
  animation: twinkle 6s ease-in-out infinite;
}

.personal__spark--one {
  top: 28%;
  left: 18%;
  animation-delay: 0.4s;
}

.personal__spark--two {
  top: 62%;
  right: 22%;
  animation-delay: 1.2s;
}

.personal__spark--three {
  top: 48%;
  left: 72%;
  animation-delay: 2.4s;
}

.personal__container {
  min-height: clamp(560px, 82vh, 760px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.personal__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
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
  font-size: clamp(2.5rem, 4vw + 1rem, 4.75rem);
  line-height: 1.1;
  font-weight: 800;
  text-shadow: 0 16px 36px rgba(15, 23, 42, 0.6);
}

.personal__description {
  max-width: 680px;
  color: rgba(226, 232, 240, 0.82);
  font-size: clamp(1.05rem, 1vw + 1rem, 1.25rem);
  line-height: 1.7;
}

.personal__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
}

.personal__carousel {
  margin-top: clamp(32px, 6vw, 64px);
  padding-bottom: 32px;
}

.personal__card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 24px;
  margin: 12px;
  max-width: 320px;
  backdrop-filter: blur(12px);
  color: #e2e8f0;
}

.personal__card :deep(.v-card-title) {
  font-weight: 700;
}

.personal__card :deep(.v-card-subtitle) {
  color: rgba(148, 163, 184, 0.85);
}

.personal__card :deep(.v-btn) {
  text-transform: none;
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

@media (max-width: 600px) {
  .personal__container {
    min-height: clamp(520px, 90vh, 680px);
  }

  .personal__headline {
    font-size: clamp(2.25rem, 7vw + 1rem, 3.25rem);
  }
}
</style>
