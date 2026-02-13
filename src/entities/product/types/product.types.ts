export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export interface CartProduct {
  id: number;
  product_id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export interface CatalogResponse {
  data: Product[];
}

export interface CartResponse {
  data: CartProduct[];
}
