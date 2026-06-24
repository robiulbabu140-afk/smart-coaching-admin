import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { UserPlus, Search, CheckCircle, XCircle } from 'lucide-react';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED', accent: '#F5A623' };

const S = {
  input: { padding: '10px 14px', background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 10, color: '#FBFAFF', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none' } as const,
  btn: (bg = C.primary) => ({ padding: '10px 18px', background: bg, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }) as const,
};

function AddStudentModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ phone: '', fullName: '', institution: '', classLevel: '' });

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/students', form),
    onSuccess: () => { toast.success('স্টুডেন্ট যোগ করা হয়েছে!'); qc.invalidateQueries({ queryKey: ['students'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#1E1040', borderRadius: 16, padding: 28, width: 380, border: '1px solid rgba(124,58,237,.3)' }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>নতুন স্টুডেন্ট যোগ করুন</h3>
        {[
          { key: 'phone', label: 'ফোন নম্বর', placeholder: '8801XXXXXXXXX', type: 'tel' },
          { key: 'fullName', label: 'পূর্ণ নাম', placeholder: 'স্টুডেন্টের নাম', type: 'text' },
          { key: 'institution', label: 'স্কুল/কলেজ', placeholder: 'প্রতিষ্ঠানের নাম', type: 'text' },
          { key: 'classLevel', label: 'শ্রেণি', placeholder: 'যেমন: Class 10, HSC', type: 'text' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>{f.label}</label>
            <input style={{ ...S.input, width: '100%' }} type={f.type} placeholder={f.placeholder}
              value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button style={S.btn()} onClick={() => mutate()} disabled={isPending}>
            {isPending ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
          </button>
          <button style={S.btn('transparent')} onClick={onClose}>বাতিল</button>
        </div>
      </div>
    </div>
  );
}

export default function Students() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students', search],
    queryFn: () => api.get(`/admin/users?role=student${search ? `&search=${search}` : ''}`).then(r => r.data.data),
  });

  return (
    <div>
      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>স্টুডেন্ট</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>মোট: {students.length} জন</p>
        </div>
        <button style={S.btn()} onClick={() => setShowAdd(true)}><UserPlus size={15} /> স্টুডেন্ট যোগ</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input style={{ ...S.input, width: '100%', paddingLeft: 36 }} placeholder="নাম দিয়ে খুঁজুন..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ background: C.card, borderRadius: 14, border: '1px solid rgba(124,58,237,.15)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: 11, color: C.muted, borderBottom: '1px solid rgba(255,255,255,.05)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          <span>নাম</span><span>ফোন</span><span>স্তর</span><span>স্ট্যাটাস</span><span>একশন</span>
        </div>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>লোড হচ্ছে...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>কোনো স্টুডেন্ট পাওয়া যায়নি।</div>
        ) : students.map((s: any) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '14px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {s.fullName?.[0] || 'S'}
              </div>
              <span style={{ color: C.white, fontWeight: 500 }}>{s.fullName}</span>
            </div>
            <span style={{ color: C.muted, fontFamily: 'monospace' }}>{s.phone || '—'}</span>
            <span style={{ color: C.muted }}>{s.studentProfile?.classLevel || '—'}</span>
            <span>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.status === 'active' ? '#22C55E22' : '#EF444422', color: s.status === 'active' ? '#4ADE80' : '#F87171' }}>
                {s.status === 'active' ? 'সক্রিয়' : s.status === 'suspended' ? 'বন্ধ' : 'অপেক্ষমাণ'}
              </span>
            </span>
            <button style={{ padding: '5px 12px', background: 'rgba(124,58,237,.2)', border: 'none', borderRadius: 6, color: '#A78BFA', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
              বিস্তারিত
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
