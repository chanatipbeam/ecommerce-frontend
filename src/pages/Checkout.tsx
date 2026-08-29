import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    if (!address.trim()) {
      setError('กรุณากรอกที่อยู่จัดส่ง');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ดึง access token ปัจจุบันจาก Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError('กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipping_address: address,
          items: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'สั่งซื้อไม่สำเร็จ');

      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    navigate('/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0) {
    return <div className="p-8 text-center text-gray-500">ตะกร้าว่างเปล่า</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ชำระเงิน</h1>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="font-medium mb-3">สรุปรายการ</h2>
        {items.map((item) => (
          <div key={item.variant_id} className="flex justify-between text-sm py-1">
            <span>
              {item.product_name} ({item.variant_label}) x{item.quantity}
            </span>
            <span>฿{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t border-gray-200 mt-2 pt-2">
          <span>รวมทั้งหมด</span>
          <span>฿{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">ที่อยู่จัดส่ง</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <p className="text-xs text-gray-400 mb-4">
        * โปรเจกต์นี้ยังไม่เชื่อม payment gateway จริง กด "ยืนยันคำสั่งซื้อ" จะสร้าง order สถานะ
        "pending" ไว้ก่อน (ระบบชำระเงินจริงจะเพิ่มทีหลังด้วย Stripe)
      </p>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-300"
      >
        {loading ? 'กำลังดำเนินการ...' : 'ยืนยันคำสั่งซื้อ'}
      </button>
    </div>
  );
}
