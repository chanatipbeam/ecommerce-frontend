import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'โหลดสินค้าไม่สำเร็จ');
        setProducts(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">กำลังโหลดสินค้า...</div>;
  if (error) return <div className="p-8 text-center text-red-500">เกิดข้อผิดพลาด: {error}</div>;
  if (products.length === 0)
    return <div className="p-8 text-center text-gray-500">ยังไม่มีสินค้าในระบบ</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">สินค้าทั้งหมด</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">ไม่มีรูป</span>
              )}
            </div>
            <div className="p-3">
              <h2 className="font-medium text-gray-900 truncate">{product.name}</h2>
              {product.categories && (
                <p className="text-xs text-gray-500">{product.categories.name}</p>
              )}
              <p className="font-semibold mt-1">฿{product.base_price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
