export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface POSMetrics {
  totalSalesToday: number;
  totalOrdersCount: number;
  totalItemsSoldToday: number;
  totalOrdersAllTime: number;
}

export interface CheckoutPayload {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'QR';
  items: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
}
