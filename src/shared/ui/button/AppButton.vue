<script setup lang="ts">
import { appButtonVariants } from './AppButton.variants.ts'
interface AppButtonProps {
  secondary?: boolean
}
defineProps<AppButtonProps>()
</script>

<template>
  <button :class="appButtonVariants({ bgColor: secondary ? 'secondary' : 'primary' })">
    <slot />
  </button>
</template>
