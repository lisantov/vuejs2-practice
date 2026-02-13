<script setup lang="ts">
import {type Product, useAddProduct} from "@/entities/product";
  import {AppButton, CDN_URL, useAuth} from "@/shared";
  import {productItemVariants} from "@/widgets/layout/product/ui/ProductItem.variants.ts";

  interface ProductItemProps {
    product: Product;
  }

  defineProps<ProductItemProps>()

  const { isAuth } = useAuth()
  const { mutate } = useAddProduct()
  const { root, title, body, image } = productItemVariants();
</script>

<template>
  <article :class="root()">
    <div :class="body()">
      <h2 :class="title()">{{product.name}}</h2>
      <img :class="image()" :src="CDN_URL + product.image" :alt="product.name">
      <p>{{product.description}}</p>
    </div>
    <app-button v-if="isAuth" @click="mutate(product.id)">{{product.price.toFixed(1)}} шекелей</app-button>
  </article>
</template>

<style scoped>

</style>
