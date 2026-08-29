import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate(redirectTo);
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSignupSuccess(true);
      }
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto p-6 mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
      </h1>

      {signupSuccess ? (
        <div className="text-center">
          <p className="text-green-600 mb-4">
            สมัครสมาชิกสำเร็จ! กรุณาเช็คอีเมลเพื่อยืนยันบัญชี (ถ้าระบบเปิด email confirmation ไว้)
          </p>
          <button onClick={() => setMode('login')} className="text-black underline">
            กลับไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">อีเมล</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-300"
          >
            {loading ? 'กำลังดำเนินการ...' : mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </form>
      )}

      {!signupSuccess && (
        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'login' ? (
            <>
              ยังไม่มีบัญชี?{' '}
              <button onClick={() => setMode('signup')} className="text-black underline">
                สมัครสมาชิก
              </button>
            </>
          ) : (
            <>
              มีบัญชีอยู่แล้ว?{' '}
              <button onClick={() => setMode('login')} className="text-black underline">
                เข้าสู่ระบบ
              </button>
            </>
          )}
        </p>
      )}

      <Link to="/" className="block text-center text-sm text-gray-400 mt-4">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
