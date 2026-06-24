import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Users, GraduationCap, BookOpen, Banknote, Clock, Radio } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const C = { primary: '#7C3AED', surface: '#1E1040', card: '#241640', muted: '#9382B5', white: '#FBFAFF', accent: '#F5A623' };

function StatCard({ icon: Icon, label, value, color = C.primary }: any) {
  return (
    <div style={{ background: C.card, borderRadius: 14, padding: 20, border: '1px solid rgba(124,58,237,.15)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 800, color: C.white }}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

const mockRevenue = [
  { month: 'জানু', amount: 45000 }, { month: 'ফেব্রু', amount: 52000 },
  { month: 'মার্চ', amount: 61000 }, { month: 'এপ্রি', amount: 58000 },
  { month: 'মে', amount: 70000 },   { month: 'জুন', amount: 84000 },
];

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/admin/dashboard/summary').then(r => r.data.data),
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>ড্যাশবোর্ড</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Smart Coaching — Admin Overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={Users} label="মোট স্টুডেন্ট" value={data?.totalStudents} />
        <StatCard icon={GraduationCap} label="মোট টিচার" value={data?.totalTeachers} color="#A78BFA" />
        <StatCard icon={BookOpen} label="সক্রিয় ব্যাচ" value={data?.activeBatches} color="#22C55E" />
        <StatCard icon={Banknote} label="মাসিক আয় (৳)" value={data?.monthRevenueBdt ? `৳${Number(data.monthRevenueBdt).toLocaleString('bn')}` : '৳০'} color={C.accent} />
        <StatCard icon={Clock} label="পেন্ডিং পেমেন্ট" value={data?.pendingPayments} color="#EF4444" />
        <StatCard icon={Radio} label="লাইভ ক্লাস" value={data?.liveClasses} color="#F5A623" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 24, border: '1px solid rgba(124,58,237,.15)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 20 }}>মাসিক আয় (৳)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: '1px solid rgba(124,58,237,.3)', borderRadius: 8, color: C.white }} />
              <Bar dataKey="amount" fill={C.primary} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, borderRadius: 16, padding: 24, border: '1px solid rgba(124,58,237,.15)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 16 }}>দ্রুত লিঙ্ক</h2>
          {[
            { label: 'নতুন স্টুডেন্ট যোগ', href: '/students/new', color: C.primary },
            { label: 'নতুন ব্যাচ তৈরি', href: '/batches/new', color: '#22C55E' },
            { label: 'পেমেন্ট অনুমোদন', href: '/payments?status=pending', color: C.accent },
          ].map(l => (
            <a key={l.href} href={l.href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 10, background: `${l.color}15`,
              border: `1px solid ${l.color}30`, marginBottom: 10, textDecoration: 'none',
              color: l.color, fontSize: 13, fontWeight: 600,
            }}>
              {l.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
