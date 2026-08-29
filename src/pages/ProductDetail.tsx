import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'ไม่พบสินค้า');
        setProduct(json.data);
        if (json.data.product_variants?.length > 0) {
          setSelectedVariant(json.data.product_variants[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  function handleAddToCart() {
    if (!product || !selectedVariant) return;

    addItem({
      variant_id: selectedVariant.id,
      product_name: product.name,
      variant_label: [selectedVariant.color, selectedVariant.size].filter(Boolean).join(' / '),
      price: product.base_price,
      quantity,
      image_url: product.image_url,
      max_stock: selectedVariant.stock_quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>;
  if (error || !product)
    return <div className="p-8 text-center text-red-500">{error || 'ไม่พบสินค้า'}</div>;

  const outOfStock = !selectedVariant || selectedVariant.stock_quantity === 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-gray-500 mb-4 hover:text-gray-900">
        ← กลับ
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400">ไม่มีรูป</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold mt-2">฿{product.base_price.toLocaleString()}</p>
          <p className="text-gray-600 mt-4">{product.description}</p>

          {product.product_variants && product.product_variants.length > 0 && (
            <div className="mt-6">
              <p className="font-medium mb-2">เลือกตัวเลือก</p>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock_quantity === 0}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      selectedVariant?.id === v.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-500'
                    } ${v.stock_quantity === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {[v.color, v.size].filter(Boolean).join(' / ')}
                    {v.stock_quantity === 0 && ' (หมด)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedVariant && (
            <p className="text-sm text-gray-500 mt-2">
              เหลือในสต็อก {selectedVariant.stock_quantity} ชิ้น
            </p>
          )}

          <div className="flex items-center gap-3 mt-4">
            <label className="text-sm">จำนวน</label>
            <input
              type="number"
              min={1}
              max={selectedVariant?.stock_quantity ?? 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-md px-2 py-1"
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {outOfStock ? 'สินค้าหมด' : added ? 'เพิ่มลงตะกร้าแล้ว ✓' : 'เพิ่มลงตะกร้า'}
          </button>
        </div>
      </div>
    </div>
  );
}
