<script setup lang="ts">
import { computed } from 'vue'

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

const color = computed(() => (props.variant === 'btn-dark' ? 'secondary' : 'primary'))
const variant = computed(() => (props.variant === 'btn-dark' ? 'tonal' : 'flat'))
</script>

<template>
  <v-btn :to="props.to" :color="color" :variant="variant" class="text-none" rounded="lg">
    {{ props.label }}
  </v-btn>
</template>
