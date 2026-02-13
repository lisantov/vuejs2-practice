export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export interface CartResponse {
  data: Product[];
}
