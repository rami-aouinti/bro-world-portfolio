<script setup lang="ts">
import { computed } from 'vue'

import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const props = withDefaults(
  defineProps<{
    label: string
    to: string
    variant?: string
  }>(),
  {
    variant: 'primary'
  }
)

const localePath = useLocalePath()

const color = computed(() => (props.variant === 'btn-dark' ? 'secondary' : 'primary'))
const variant = computed(() => (props.variant === 'btn-dark' ? 'tonal' : 'flat'))
const to = computed(() => resolveLocalizedRouteTarget(props.to, localePath))
</script>

<template>
  <v-btn :to="to" :color="color" :variant="variant" class="text-none" rounded="lg">
    {{ props.label }}
  </v-btn>
</template>
