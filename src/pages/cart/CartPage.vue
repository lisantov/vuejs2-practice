<script setup lang="ts">
import {type CartProduct, useCart, useRemoveProduct} from "@/entities/product";
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

  const { mutate } = useRemoveProduct();
  const deleteProduct = async (product_id: number) => {
    if (products.value) {
      const deletables = products.value?.filter(p => p.product_id === product_id);
      await Promise.all(deletables.map(d => mutate(d.id)))
    }
  }
</script>

<template>
  <main class="px-12 py-8 grid grid-cols-4 gap-8">
    <template v-if="cartProduct.length" v-for="product in cartProduct">
      <cart-product-item :product="product.product" @remove-product="deleteProduct" :amount="product.amount" />
    </template>
    <h2 class="text-center text-2xl" v-else>В корзине пусто</h2>
  </main>
</template>

<style scoped>

</style>
