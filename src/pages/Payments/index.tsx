import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED', accent: '#F5A623' };

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const qc = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', statusFilter],
    queryFn: () => api.get(`/payments/admin/all?status=${statusFilter}`).then(r => r.data.data),
  });

  const approve = useMutation({
    mutationFn: (id: string) => api.post(`/payments/admin/${id}/approve`),
    onSuccess: () => { toast.success('পেমেন্ট অনুমোদিত!'); qc.invalidateQueries({ queryKey: ['payments'] }); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  const reject = useMutation({
    mutationFn: (id: string) => api.post(`/payments/admin/${id}/reject`, { reason: 'তথ্য যাচাই হয়নি।' }),
    onSuccess: () => { toast.success('পেমেন্ট বাতিল করা হয়েছে।'); qc.invalidateQueries({ queryKey: ['payments'] }); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  const tabs = [
    { key: 'pending', label: 'অপেক্ষমাণ', color: C.accent },
    { key: 'success', label: 'অনুমোদিত', color: '#22C55E' },
    { key: 'failed', label: 'বাতিল', color: '#EF4444' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>পেমেন্ট ম্যানেজমেন্ট</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>ম্যানুয়াল পেমেন্ট অনুমোদন ও ব্যবস্থাপনা</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setStatusFilter(t.key)} style={{
            padding: '8px 18px', borderRadius: 20, border: `1.5px solid ${statusFilter === t.key ? t.color : 'rgba(255,255,255,.1)'}`,
            background: statusFilter === t.key ? `${t.color}22` : 'transparent',
            color: statusFilter === t.key ? t.color : C.muted,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ background: C.card, borderRadius: 14, border: '1px solid rgba(124,58,237,.15)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '10px 16px', fontSize: 11, color: C.muted, borderBottom: '1px solid rgba(255,255,255,.05)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          <span>স্টুডেন্ট</span><span>পরিমাণ</span><span>মাধ্যম</span><span>তারিখ</span><span>একশন</span>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>লোড হচ্ছে...</div>
        ) : payments.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>
            <Clock size={32} style={{ margin: '0 auto 10px', display: 'block', opacity: .4 }} />
            কোনো পেমেন্ট নেই।
          </div>
        ) : payments.map((p: any) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '14px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'center' }}>
            <div>
              <p style={{ color: C.white, fontWeight: 500 }}>{p.student?.user?.fullName || '—'}</p>
              <p style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>{p.senderMsisdn || '—'}</p>
            </div>
            <span style={{ color: '#4ADE80', fontWeight: 700 }}>৳{Number(p.amountBdt).toLocaleString()}</span>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(245,166,35,.15)', color: C.accent, display: 'inline-block' }}>
              {p.method === 'bkash' ? 'bKash' : p.method === 'nagad' ? 'Nagad' : 'ম্যানুয়াল'}
            </span>
            <span style={{ color: C.muted, fontSize: 11 }}>{new Date(p.createdAt).toLocaleDateString('bn')}</span>
            {p.status === 'pending' ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => approve.mutate(p.id)} disabled={approve.isPending} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: '#22C55E22', border: '1px solid #22C55E44', borderRadius: 6, color: '#4ADE80', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
                  <CheckCircle size={12} /> অনুমোদন
                </button>
                <button onClick={() => reject.mutate(p.id)} disabled={reject.isPending} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: '#EF444422', border: '1px solid #EF444444', borderRadius: 6, color: '#F87171', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
                  <XCircle size={12} /> বাতিল
                </button>
              </div>
            ) : (
              <span style={{ fontSize: 11, color: p.status === 'success' ? '#4ADE80' : '#F87171' }}>
                {p.status === 'success' ? '✓ অনুমোদিত' : '✗ বাতিল'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
