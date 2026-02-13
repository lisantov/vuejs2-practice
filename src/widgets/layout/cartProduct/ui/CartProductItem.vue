<script setup lang="ts">
import {type Product, useRemoveProduct} from "@/entities/product";
import {AppButton, CDN_URL} from "@/shared";
  import {productItemVariants} from "@/widgets/layout/product/ui/ProductItem.variants.ts";

  interface ProductItemProps {
    product: Product;
    amount: number;
  }

  defineProps<ProductItemProps>()

  const { mutate, isLoading } = useRemoveProduct();
  const { root, title, body, image } = productItemVariants();
</script>

<template>
  <article :class="root()">
    <div :class="body()">
      <h2 :class="title()">{{product.name}} <span class="text-lg text-blue-600">{{ `x${amount}` }}</span></h2>
      <img :class="image()" :src="CDN_URL + product.image" :alt="product.name">
      <p>{{product.description}}</p>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-center text-blue-400 text-xl font-bold">Всего: {{(product.price * amount).toFixed(1)}} шекелей</p>
      <app-button class="bg-red-500 hover:bg-red-300" :disabled="isLoading" @click="mutate(product.id)">Убрать из корзины</app-button>
    </div>
  </article>
</template>

<style scoped>

</style>
