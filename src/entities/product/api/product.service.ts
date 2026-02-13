import type {CartResponse, CatalogResponse} from "../types/product.types";
import {api} from "@/shared";

export const ProductService = {
  getProducts: () => api.get<CatalogResponse>('products').then((res) => res.data.data),
  addProduct: (id: number) => api.post(`cart/${id}`).then((res) => res.data),
  getCart: () => api.get<CartResponse>(`cart`).then((res) => res.data.data),
  deleteProduct: (id: number) => api.delete(`cart/${id}`).then((res) => res.data),
}
