<script setup lang="ts">
import { formInputVariants } from './FormInput.variants'

interface Props {
  type: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

defineProps<Props>()

const model = defineModel()
</script>

<template>
  <input
    v-model="model"
    :class="formInputVariants({ error: !!error })"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
  />
</template>
