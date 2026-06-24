import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED', surface: '#1E1040' };
const S = {
  input: { padding: '9px 12px', background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 8, color: '#FBFAFF', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none' } as const,
  select: { padding: '9px 12px', background: '#1E1040', border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 8, color: '#FBFAFF', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none', cursor: 'pointer' } as const,
};

function getMonthLabel(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return d.toISOString().slice(0, 7);
}

function formatMonth(label: string) {
  const [y, m] = label.split('-');
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  return `${months[parseInt(m) - 1]} ${y}`;
}

function SetFeeModal({ student, onClose }: { student: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [fee, setFee] = useState(student.monthlyFee ?? '');
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.patch(`/admin/students/${student.userId}/fee`, { monthlyFee: Number(fee) }),
    onSuccess: () => { toast.success('ফি আপডেট হয়েছে!'); qc.invalidateQueries({ queryKey: ['monthly-payments'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 340, border: '1px solid rgba(124,58,237,.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ color: C.white, fontSize: 15, fontWeight: 700 }}>মাসিক ফি নির্ধারণ</h3>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{student.fullName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>মাসিক ফি (টাকা)</label>
        <input style={{ ...S.input, width: '100%' }} type="number" min="0" placeholder="যেমন: 500"
          value={fee} onChange={e => setFee(e.target.value)} />
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={() => mutate()} disabled={isPending || !fee}
            style={{ flex: 1, padding: 11, background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
            {isPending ? 'সেভ হচ্ছে...' : '✓ সেভ করুন'}
          </button>
          <button onClick={onClose} style={{ padding: '11px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>বাতিল</button>
        </div>
      </div>
    </div>
  );
}

function RecordPaymentModal({ student, month, onClose }: { student: any; month: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState(student.monthlyFee ?? '');
  const [note, setNote] = useState('');
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/payments/record', { userId: student.userId, amount: Number(amount), month, note }),
    onSuccess: () => { toast.success('পেমেন্ট রেকর্ড হয়েছে!'); qc.invalidateQueries({ queryKey: ['monthly-payments'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 360, border: '1px solid rgba(74,222,128,.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ color: '#4ADE80', fontSize: 15, fontWeight: 700 }}>💰 পেমেন্ট নিশ্চিত করুন</h3>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{student.fullName} • {formatMonth(month)}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>পেমেন্টের পরিমাণ (টাকা)</label>
        <input style={{ ...S.input, width: '100%', marginBottom: 12 }} type="number" min="0" placeholder="টাকার পরিমাণ"
          value={amount} onChange={e => setAmount(e.target.value)} />

        <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>নোট (ঐচ্ছিক)</label>
        <input style={{ ...S.input, width: '100%' }} type="text" placeholder="যেমন: bKash দিয়ে পাঠিয়েছে"
          value={note} onChange={e => setNote(e.target.value)} />

        <div style={{ background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.15)', borderRadius: 8, padding: '10px 14px', marginTop: 14 }}>
          <p style={{ fontSize: 12, color: '#4ADE80' }}>✓ এই পেমেন্ট manual হিসেবে সফল রেকর্ড হবে</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={() => mutate()} disabled={isPending || !amount}
            style={{ flex: 1, padding: 11, background: 'rgba(74,222,128,.2)', border: '1px solid rgba(74,222,128,.4)', borderRadius: 10, color: '#4ADE80', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
            {isPending ? 'রেকর্ড হচ্ছে...' : '✓ নিশ্চিত করুন'}
          </button>
          <button onClick={onClose} style={{ padding: '11px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>বাতিল</button>
        </div>
      </div>
    </div>
  );
}

export default function Payments() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [feeModal, setFeeModal] = useState<any>(null);
  const [payModal, setPayModal] = useState<any>(null);
  const qc = useQueryClient();

  const month = getMonthLabel(monthOffset);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['monthly-payments', month],
    queryFn: () => api.get(`/admin/payments/monthly?month=${month}`).then(r => r.data.data),
  });

  const cancelPayment = useMutation({
    mutationFn: (paymentId: string) => api.delete(`/admin/payments/${paymentId}`),
    onSuccess: () => { toast.success('পেমেন্ট বাতিল হয়েছে।'); qc.invalidateQueries({ queryKey: ['monthly-payments'] }); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  const totalFee = students.reduce((s: number, st: any) => s + (st.monthlyFee || 0), 0);
  const totalPaid = students.filter((s: any) => s.paid).reduce((acc: number, st: any) => acc + (st.payment?.amountBdt ? Number(st.payment.amountBdt) : 0), 0);
  const unpaidCount = students.filter((s: any) => !s.paid && s.monthlyFee).length;

  return (
    <div>
      {feeModal && <SetFeeModal student={feeModal} onClose={() => setFeeModal(null)} />}
      {payModal && <RecordPaymentModal student={payModal} month={month} onClose={() => setPayModal(null)} />}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>পেমেন্ট ট্র্যাকার</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>প্রতি মাসে কে কত টাকা দিয়েছে — সব এখানে</p>
      </div>

      {/* Month selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button onClick={() => setMonthOffset(o => o - 1)} style={{ padding: '8px 12px', background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.3)', borderRadius: 8, color: C.white, cursor: 'pointer' }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.white, minWidth: 180, textAlign: 'center' }}>
          📅 {formatMonth(month)}
        </span>
        <button onClick={() => setMonthOffset(o => o + 1)} disabled={monthOffset >= 0} style={{ padding: '8px 12px', background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.3)', borderRadius: 8, color: monthOffset >= 0 ? C.muted : C.white, cursor: monthOffset >= 0 ? 'not-allowed' : 'pointer' }}>
          <ChevronRight size={16} />
        </button>
        <span style={{ fontSize: 12, color: C.muted }}>{month}</span>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'মোট ফি (সম্ভাব্য)', value: `৳${totalFee.toLocaleString()}`, color: '#A78BFA', bg: 'rgba(124,58,237,.1)' },
          { label: 'আদায় হয়েছে', value: `৳${totalPaid.toLocaleString()}`, color: '#4ADE80', bg: 'rgba(74,222,128,.1)' },
          { label: 'বাকি আছেন', value: `${students.filter((s: any) => !s.paid && s.monthlyFee).length} জন`, color: '#F87171', bg: 'rgba(239,68,68,.1)' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}30`, borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{c.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Student list */}
      <div style={{ background: C.card, borderRadius: 14, border: '1px solid rgba(124,58,237,.15)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.4fr', padding: '10px 16px', fontSize: 11, color: C.muted, borderBottom: '1px solid rgba(255,255,255,.05)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          <span>স্টুডেন্ট</span><span>ফোন</span><span>মাসিক ফি</span><span>স্ট্যাটাস</span><span>একশন</span>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>লোড হচ্ছে...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>কোনো স্টুডেন্ট নেই।</div>
        ) : (students as any[]).map((s: any) => (
          <div key={s.userId} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.4fr', padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'center', background: s.paid ? 'rgba(74,222,128,.03)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.paid ? 'rgba(74,222,128,.2)' : '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: s.paid ? '#4ADE80' : '#fff', flexShrink: 0 }}>
                {s.fullName?.[0] || 'S'}
              </div>
              <span style={{ color: C.white, fontWeight: 500, fontSize: 13 }}>{s.fullName}</span>
            </div>

            <span style={{ color: C.muted, fontSize: 11, fontFamily: 'monospace' }}>{s.phone}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.monthlyFee ? '#A78BFA' : C.muted }}>
                {s.monthlyFee ? `৳${Number(s.monthlyFee).toLocaleString()}` : '—'}
              </span>
              <button onClick={() => setFeeModal(s)} title="ফি পরিবর্তন করুন"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 11, padding: '2px 4px' }}>✏️</button>
            </div>

            <span>
              {s.paid ? (
                <div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'rgba(74,222,128,.15)', color: '#4ADE80' }}>
                    ✓ পরিশোধ
                  </span>
                  {s.payment?.amountBdt && (
                    <p style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>৳{Number(s.payment.amountBdt).toLocaleString()}</p>
                  )}
                </div>
              ) : s.monthlyFee ? (
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,.12)', color: '#F87171' }}>
                  ✗ বাকি
                </span>
              ) : (
                <span style={{ fontSize: 11, color: C.muted }}>ফি নেই</span>
              )}
            </span>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {!s.paid ? (
                <button onClick={() => setPayModal(s)}
                  style={{ padding: '5px 12px', background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 6, color: '#4ADE80', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontWeight: 600 }}>
                  💰 পেমেন্ট নিন
                </button>
              ) : (
                <button onClick={() => s.payment?.id && cancelPayment.mutate(s.payment.id)}
                  style={{ padding: '5px 12px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 6, color: '#F87171', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
                  বাতিল
                </button>
              )}
              <button onClick={() => setFeeModal(s)}
                style={{ padding: '5px 10px', background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.25)', borderRadius: 6, color: '#A78BFA', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
                ফি সেট
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
