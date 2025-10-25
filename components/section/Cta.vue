<template>
  <ScrollSmooth>
    <v-container
      v-if="ctaContent"
      class="py-6"
    >
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
        >
          <CustomGlowCard
            class="cta__card"
            :title="ctaContent.label"
            :description="ctaContent.description"
            variant="indigo"
            :eyebrow="t('portfolio.cta.eyebrow')"
          >
            <div class="cta__actions">
              <Button
                :to="resolveLocalizedRouteTarget('/contact', localePath)"
                variant="btn-dark"
                :label="t('portfolio.cta.primaryCta')"
              />
            </div>
            <p class="cta__caption">&copy; {{ new Date().getFullYear() }} {{ profileName }}</p>
          </CustomGlowCard>
        </v-col>
      </v-row>
    </v-container>
  </ScrollSmooth>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";
import CustomGlowCard from "~/components/CustomGlowCard.vue";
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";

const { data: cta } = useContentBlock("cta");
const { data: navlinks } = useContentBlock("navlinks");
const { data: profile } = useContentBlock("profile");
const { t } = useI18n();

const localePath = useLocalePath();
const ctaContent = computed(() => cta.value);
const rawLinks = computed(() => navlinks.value ?? []);
const links = computed(() =>
  rawLinks.value.map((link) => ({
    ...link,
    to: resolveLocalizedRouteTarget(link.url, localePath),
  })),
);
const profileName = computed(() => {
  if (!profile.value) {
    return "";
  }
  return `${profile.value.firstname} ${profile.value.lastname}`;
});
</script>

<style scoped>
.cta__card {
  text-align: center;
}

.cta__actions {
  margin-top: clamp(24px, 4vw, 32px);
}

.cta__divider {
  margin-block: clamp(24px, 4vw, 32px);
}

.cta__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.cta__caption {
  margin-top: clamp(24px, 4vw, 32px);
  font-size: 0.8rem;
  color: rgba(203, 213, 225, 0.85);
}
</style>
