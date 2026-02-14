import {api} from "@/shared";
import type {OrderResponse} from "@/entities/order/types/order.types.ts";

export const OrderService = {
  createOrder: () => api.post<OrderResponse>('order').then((res) => res.data.data),
  getOrders: () => api.get<OrderResponse>('order').then((res) => res.data.data),
}
