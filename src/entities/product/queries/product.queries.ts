import {defineMutation, defineQuery, useMutation, useQuery, useQueryCache} from '@pinia/colada'
import {ProductService} from "../api";
import {PRODUCT_QUERY_KEYS} from "./product.keys";

export const useProducts = defineQuery(() => {
  return useQuery({
    key: () => PRODUCT_QUERY_KEYS.all,
    query: () => ProductService.getProducts()
  })
})

export const useCart = defineQuery(() => {
  return useQuery({
    key: () => PRODUCT_QUERY_KEYS.cart,
    query: () => ProductService.getCart()
  })
})

export const useAddProduct = defineMutation(() => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (id: number) => ProductService.addProduct(id),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: PRODUCT_QUERY_KEYS.cart })
    }
  })
})


export const useRemoveProduct = defineMutation(() => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (id: number) => ProductService.deleteProduct(id),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: PRODUCT_QUERY_KEYS.cart })
    }
  })
})
