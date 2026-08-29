export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string | null;
  size: string | null;
  stock_quantity: number;
  sku: string;
  image_url: string | null;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  created_at: string;
  categories?: Category;
  product_variants?: ProductVariant[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string | null;
  quantity: number;
  price_at_purchase: number;
  product_variants?: ProductVariant & { products?: { name: string; image_url: string | null } };
}

export interface Order {
  id: string;
  user_id: string | null;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

// สินค้า 1 ชิ้นที่อยู่ในตะกร้า (เก็บ state ฝั่ง frontend เท่านั้น)
export interface CartItem {
  variant_id: string;
  product_name: string;
  variant_label: string; // เช่น "สีดำ / ไซส์ 42"
  price: number;
  quantity: number;
  image_url: string | null;
  max_stock: number;
}
