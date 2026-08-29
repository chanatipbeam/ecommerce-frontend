import { useEffect, useState } from 'react';
import type { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_LABEL: Record<string, string> = {
  pending: 'รอดำเนินการ',
  paid: 'ชำระเงินแล้ว',
  shipped: 'จัดส่งแล้ว',
  delivered: 'ส่งถึงแล้ว',
  cancelled: 'ยกเลิก',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        const res = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'โหลดคำสั่งซื้อไม่สำเร็จ');
        setOrders(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">กรุณาเข้าสู่ระบบก่อนดูคำสั่งซื้อ</p>
        <Link to="/login" className="text-black underline">
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (orders.length === 0)
    return <div className="p-8 text-center text-gray-500">ยังไม่มีประวัติคำสั่งซื้อ</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500">
                  คำสั่งซื้อ #{order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleString('th-TH')}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[order.status]}`}
              >
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            {order.order_items?.map((item) => (
              <div key={item.id} className="text-sm text-gray-600 py-1">
                {item.product_variants?.products?.name ?? 'สินค้า'} x{item.quantity} — ฿
                {(item.price_at_purchase * item.quantity).toLocaleString()}
              </div>
            ))}

            <div className="flex justify-between font-semibold border-t border-gray-200 mt-2 pt-2">
              <span>รวม</span>
              <span>฿{order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
