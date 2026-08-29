import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-gray-500 mb-4">ตะกร้าของคุณว่างเปล่า</p>
        <Link to="/" className="text-black underline">
          ไปเลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  function handleCheckout() {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ตะกร้าสินค้า</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.variant_id}
            className="flex items-center gap-4 border border-gray-200 rounded-lg p-4"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-xs text-gray-400">ไม่มีรูป</span>
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-gray-500">{item.variant_label}</p>
              <p className="font-semibold mt-1">฿{item.price.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={item.max_stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.variant_id, Number(e.target.value))}
                className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center"
              />
              <button
                onClick={() => removeItem(item.variant_id)}
                className="text-red-500 text-sm hover:underline"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-lg font-semibold">รวมทั้งหมด</span>
        <span className="text-lg font-bold">฿{totalAmount.toLocaleString()}</span>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-4 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
      >
        ดำเนินการชำระเงิน
      </button>
    </div>
  );
}
