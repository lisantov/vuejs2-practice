<script setup lang="ts">
import {type CartProduct, type Product, useAddProduct, useRemoveProduct} from "@/entities/product";
import {AppButton, CDN_URL} from "@/shared";
  import {productItemVariants} from "@/widgets/layout/product/ui/ProductItem.variants.ts";

  interface ProductItemProps {
    product: CartProduct;
    amount: number;
  }

  const props = defineProps<ProductItemProps>()

  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useRemoveProduct();
  const { mutate: addMutate, isLoading: isAddLoading } = useAddProduct();
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
      <app-button class="bg-red-500 hover:bg-red-300" :disabled="isDeleteLoading" @click="$emit('remove-product', props.product.product_id)">Убрать из корзины</app-button>
      <div class="grid grid-cols-3">
        <app-button @click="deleteMutate(product.id)" :disabled="isDeleteLoading">-</app-button>
        <div class="flex justify-center items-center">
          <p class="text-xl text-center">{{amount}}</p>
        </div>
        <app-button @click="addMutate(product.product_id)" :disabled="isAddLoading">+</app-button>
      </div>
    </div>
  </article>
</template>

<style scoped>

</style>
