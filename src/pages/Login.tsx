import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { School, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const S = {
  wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1B0F2E,#0F0A1E)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } as const,
  card: { width: '100%', maxWidth: 380, background: '#241640', borderRadius: 20, padding: 32, border: '1px solid rgba(124,58,237,.3)' } as const,
  label: { fontSize: 12, color: '#9382B5', marginBottom: 6, display: 'block' } as const,
};

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const login = useAuthStore(s => s.login);
  const loading = useAuthStore(s => s.loading);
  const nav = useNavigate();

  const inputStyle = {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,.06)',
    border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 10, color: '#FBFAFF',
    fontSize: 14, fontFamily: 'Outfit,sans-serif', outline: 'none',
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) { toast.error('ফোন নম্বর ও পাসওয়ার্ড দিন।'); return; }
    try {
      await login(phone, password);
      toast.success('স্বাগতম!');
      nav('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.message || 'লগইন ব্যর্থ হয়েছে।');
    }
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <School size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#FBFAFF' }}>Smart Coaching</h1>
          <p style={{ fontSize: 12, color: '#9382B5', marginTop: 4 }}>Admin Panel — লগইন করুন</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Phone */}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>
              <Phone size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              মোবাইল নম্বর
            </label>
            <input
              style={inputStyle}
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={S.label}>
              <Lock size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              পাসওয়ার্ড
            </label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingRight: 44 }}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9382B5', display: 'flex', alignItems: 'center' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 13, background: loading ? '#4C2D99' : '#7C3AED',
              border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit,sans-serif', transition: 'background .2s',
            }}
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#534AB7', marginTop: 20 }}>
          শুধুমাত্র Admin অ্যাকাউন্ট লগইন করতে পারবে।
        </p>
      </div>
    </div>
  );
}
