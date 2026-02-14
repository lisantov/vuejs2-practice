<script setup lang="ts">
  import {AppButton} from "@/shared";
  import {orderItemVariants} from "./OrderItem.variants";
import type {Order} from "@/entities/order";

  interface OrderItemProps {
    order: Order;
  }

  defineProps<OrderItemProps>();
  const { root, title, body } = orderItemVariants();
</script>

<template>
  <article :class="root()">
    <div :class="body()">
      <h2 :class="title()">Заказ №{{order.id}}</h2>
      <ul>
        <li v-for="product in order.products">{{product}}</li>
      </ul>
      <p>Всего: {{order.order_price}} шекелей</p>
    </div>
  </article>
</template>

<style scoped>

</style>
