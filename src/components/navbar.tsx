import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="text-xl font-bold text-gray-900">
        Smart Shop
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          สินค้า
        </Link>

        <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
          ตะกร้า
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/orders" className="text-gray-600 hover:text-gray-900">
              คำสั่งซื้อของฉัน
            </Link>
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-900"
            >
              ออกจากระบบ
            </button>
          </>
        ) : (
          <Link to="/login" className="text-gray-600 hover:text-gray-900">
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
}
