export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  storage: string | null;
  price: number;
  stock_count: number;
  image_url: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  specs: Record<string, string>;
  is_featured: boolean;
  variants?: ProductVariant[];
  category?: Category;
}

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  color: string;
  storage: string | null;
  price: number;
  imageUrl: string;
  quantity: number;
  maxStock: number;
}

export interface Order {
  id: number;
  user_id: string | null;
  customer_name: string;
  phone: string;
  telegram: string | null;
  email: string | null;
  comment: string | null;
  delivery_method: string;
  address: string | null;
  payment_method: string;
  gift_wrap: boolean;
  items: CartItem[];
  total_price: number;
  status: string;
  created_at: string;
}
