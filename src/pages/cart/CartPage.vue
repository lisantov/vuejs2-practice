<script setup lang="ts">
  import {type CartProduct, useCart} from "@/entities/product";
  import {computed} from "vue";
  import {CartProductItem} from "@/widgets/layout/cartProduct";

  interface ReducedProduct {
    product: CartProduct
    amount: number;
  }

  const {data: products} = useCart()
  const cartProduct = computed(() => {
    const grouped = products.value?.reduce<Map<number, ReducedProduct>>((acc, product) => {
      const exists = acc.get(product.product_id);
      if (exists) exists.amount += 1;
      else {
        acc.set(product.product_id, {
          product,
          amount: 1
        });
      }

      return acc;
    }, new Map()) || [];

    return Array.from(grouped.values());
  })
</script>

<template>
  <main class="px-12 py-8 grid grid-cols-4 gap-8">
    <template v-for="product in cartProduct">
      <cart-product-item :product="product.product" :amount="product.amount" />
    </template>
  </main>
</template>

<style scoped>

</style>
