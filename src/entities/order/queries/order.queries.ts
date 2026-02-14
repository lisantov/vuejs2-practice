import {defineMutation, defineQuery, useMutation, useQuery, useQueryCache} from '@pinia/colada'
import {OrderService} from "../api";
import {ORDER_QUERY_KEYS} from "./order.keys";
import {PRODUCT_QUERY_KEYS} from "@/entities/product";

export const useOrders = defineQuery(() => {
  return useQuery({
    key: () => ORDER_QUERY_KEYS.all,
    query: () => OrderService.getOrders()
  })
})

export const useAddOrder = defineMutation(() => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: () => OrderService.createOrder(),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ORDER_QUERY_KEYS.all })
      queryCache.invalidateQueries({ key: PRODUCT_QUERY_KEYS.cart })
    }
  })
})
