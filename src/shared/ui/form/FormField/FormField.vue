<script setup lang="ts">
import FormInput from '../FormInput/FormInput.vue'

interface Props {
  type: string
  placeholder: string
  error?: string
  showErrorMessage?: boolean
  disabled?: boolean
}

defineProps<Props>()

const model = defineModel()
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <p v-if="error && showErrorMessage" class="text-red-400 text-[12px]">{{ error }}</p>
    <form-input
      v-model="model"
      v-bind="$attrs"
      :type="type"
      :placeholder="placeholder"
      :error="error"
      :disabled="disabled"
    />
  </div>
</template>
