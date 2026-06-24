import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED', accent: '#F5A623', surface: '#1E1040' };
const COLORS = ['#7C3AED', '#F5A623', '#22C55E', '#3B82F6'];

export default function Reports() {
  const { data: revenue } = useQuery({
    queryKey: ['revenue-report'],
    queryFn: () => api.get('/admin/reports/revenue').then(r => r.data.data),
  });

  const { data: attendance } = useQuery({
    queryKey: ['attendance-report'],
    queryFn: () => api.get('/admin/reports/attendance').then(r => r.data.data),
  });

  const pieData = revenue?.byMethod?.map((m: any) => ({
    name: m.method === 'bkash' ? 'bKash' : m.method === 'nagad' ? 'Nagad' : 'ম্যানুয়াল',
    value: Number(m._sum?.amountBdt || 0),
  })) || [];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>রিপোর্ট</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>আয় ও উপস্থিতি বিশ্লেষণ</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 24, border: '1px solid rgba(124,58,237,.15)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 20 }}>পেমেন্ট মাধ্যম বিভাজন</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {pieData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: C.surface, border: '1px solid rgba(124,58,237,.3)', borderRadius: 8, color: C.white }} formatter={(v: any) => `৳${Number(v).toLocaleString()}`} />
                <Legend formatter={(v) => <span style={{ color: C.muted, fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>ডেটা নেই</div>}
        </div>

        <div style={{ background: C.card, borderRadius: 16, padding: 24, border: '1px solid rgba(124,58,237,.15)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 8 }}>আয় সারসংক্ষেপ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            {[
              { label: 'মোট আয়', value: `৳${Number(revenue?.total || 0).toLocaleString()}`, color: '#22C55E' },
              { label: 'অনুমোদিত', value: revenue?.approvedCount || 0, color: C.primary },
              { label: 'পেন্ডিং', value: revenue?.pendingCount || 0, color: C.accent },
              { label: 'বাতিল', value: revenue?.failedCount || 0, color: '#EF4444' },
            ].map(s => (
              <div key={s.label} style={{ background: `${s.color}12`, borderRadius: 10, padding: 14, border: `1px solid ${s.color}25` }}>
                <p style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: C.card, borderRadius: 16, padding: 24, border: '1px solid rgba(124,58,237,.15)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 20 }}>সাম্প্রতিক উপস্থিতি</h2>
        {(!attendance || attendance.length === 0) ? (
          <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>ডেটা নেই। কোনো ক্লাস হলে এখানে দেখাবে।</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  {['স্টুডেন্ট', 'ব্যাচ', 'ক্লাস তারিখ', 'স্ট্যাটাস'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 20).map((a: any) => (
                  <tr key={a.id}>
                    <td style={{ padding: '10px 12px', color: C.white }}>{a.student?.user?.fullName || '—'}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{a.class?.batch?.name || '—'}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{new Date(a.class?.scheduledAt || a.createdAt).toLocaleDateString('bn')}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: a.status === 'joined' ? '#22C55E22' : '#EF444422', color: a.status === 'joined' ? '#4ADE80' : '#F87171' }}>
                        {a.status === 'joined' ? 'উপস্থিত' : 'অনুপস্থিত'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
