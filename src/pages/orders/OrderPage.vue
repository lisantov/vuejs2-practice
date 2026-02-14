<script setup lang="ts">
  import {useOrders} from "@/entities/order";
  import {OrderItem} from "@/widgets/layout/order";

  const {data: orders} = useOrders()
</script>

<template>
  <main class="px-12 py-8 grid grid-cols-4 gap-8">
    <template v-if="orders && orders.length" v-for="order in orders">
      <order-item :order />
    </template>
    <h2 class="text-center text-2xl" v-else>Вы ещё не сделали ни одного заказа</h2>
  </main>
</template>

<style scoped>

</style>
