import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  CreditCard, BarChart3, LogOut, School, Globe,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
  { to: '/admin/students', icon: Users, label: 'স্টুডেন্ট' },
  { to: '/admin/teachers', icon: GraduationCap, label: 'টিচার' },
  { to: '/admin/batches', icon: BookOpen, label: 'ব্যাচ' },
  { to: '/admin/payments', icon: CreditCard, label: 'পেমেন্ট' },
  { to: '/admin/reports', icon: BarChart3, label: 'রিপোর্ট' },
];

export default function Sidebar() {
  const logout = useAuthStore(s => s.logout);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#0D0720',
      display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(124,58,237,.15)',
      position: 'fixed', top: 0, left: 0, zIndex: 50,
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(124,58,237,.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <School size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#FBFAFF' }}>Smart Coaching</p>
            <p style={{ fontSize: 10, color: '#9382B5' }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Website button */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(124,58,237,.1)' }}>
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '9px 12px', border: '1px solid rgba(201,162,39,.3)',
          background: 'rgba(201,162,39,.08)', color: '#C9A227',
          borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
          fontWeight: 600,
        }}>
          <Globe size={14} /> 🌐 ওয়েবসাইট দেখুন
        </button>
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 20px', fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'all .15s',
              color: isActive ? '#fff' : '#9382B5',
              background: isActive ? 'rgba(124,58,237,.25)' : 'transparent',
              borderLeft: isActive ? '3px solid #7C3AED' : '3px solid transparent',
            })}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(124,58,237,.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
            {user?.fullName?.[0] || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#FBFAFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName || 'Admin'}</p>
            <p style={{ fontSize: 10, color: '#9382B5' }}>Administrator</p>
          </div>
        </div>
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '8px 10px', border: 'none', background: 'rgba(239,68,68,.1)',
          color: '#F87171', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
        }}>
          <LogOut size={14} /> লগআউট
        </button>
      </div>
    </aside>
  );
}
