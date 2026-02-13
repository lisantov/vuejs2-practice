<script setup lang="ts">
  import {useProducts} from "@/entities/product";
  import ProductItem from "@/widgets/layout/product/ui/ProductItem.vue";

  const {data: products} = useProducts()
</script>

<template>
  <main class="px-12 py-8 grid grid-cols-4 gap-8">
    <template v-for="product in products">
      <product-item :product />
    </template>
  </main>
</template>

<style scoped>

</style>
