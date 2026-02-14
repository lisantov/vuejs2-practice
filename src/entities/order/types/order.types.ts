export interface Order {
  id: number;
  products: number[];
  order_price: number;
}

export interface OrderResponse {
  data: Order[];
}
