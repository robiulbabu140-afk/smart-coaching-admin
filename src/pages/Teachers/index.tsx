import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { UserPlus, GraduationCap } from 'lucide-react';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED' };
const S = { input: { padding: '10px 14px', background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 10, color: '#FBFAFF', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none', width: '100%' } as const };

function AddTeacherModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ phone: '', fullName: '', subjects: '', bio: '' });
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/teachers', { ...form, subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean) }),
    onSuccess: () => { toast.success('টিচার যোগ করা হয়েছে!'); qc.invalidateQueries({ queryKey: ['teachers'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#1E1040', borderRadius: 16, padding: 28, width: 380, border: '1px solid rgba(124,58,237,.3)' }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>নতুন টিচার যোগ করুন</h3>
        {[
          { key: 'phone', label: 'ফোন নম্বর', placeholder: '8801XXXXXXXXX' },
          { key: 'fullName', label: 'পূর্ণ নাম', placeholder: 'টিচারের নাম' },
          { key: 'subjects', label: 'বিষয়সমূহ (কমা দিয়ে)', placeholder: 'পদার্থবিজ্ঞান, গণিত' },
          { key: 'bio', label: 'পরিচিতি', placeholder: 'সংক্ষিপ্ত পরিচয়' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>{f.label}</label>
            <input style={S.input} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => mutate()} disabled={isPending} style={{ flex: 1, padding: 11, background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
            {isPending ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
          </button>
          <button onClick={onClose} style={{ padding: '11px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>বাতিল</button>
        </div>
      </div>
    </div>
  );
}

export default function Teachers() {
  const [showAdd, setShowAdd] = useState(false);
  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => api.get('/admin/users?role=teacher').then(r => r.data.data),
  });

  return (
    <div>
      {showAdd && <AddTeacherModal onClose={() => setShowAdd(false)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>টিচার</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>মোট: {teachers.length} জন</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
          <UserPlus size={15} /> টিচার যোগ
        </button>
      </div>

      {isLoading ? <div style={{ textAlign: 'center', color: C.muted, padding: 60 }}>লোড হচ্ছে...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {teachers.map((t: any) => (
            <div key={t.id} style={{ background: C.card, borderRadius: 14, padding: 20, border: '1px solid rgba(124,58,237,.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {t.fullName?.[0] || 'T'}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: C.white, fontSize: 14 }}>{t.fullName}</p>
                  <p style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>{t.phone}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {(t.teacherProfile?.subjects || []).map((s: string) => (
                  <span key={s} style={{ fontSize: 10, padding: '3px 8px', background: 'rgba(124,58,237,.2)', borderRadius: 4, color: '#A78BFA' }}>{s}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.muted, fontSize: 11 }}>
                  <GraduationCap size={13} /> {t.teacherProfile?._count?.batches || 0} ব্যাচ
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: t.status === 'active' ? '#22C55E22' : '#EF444422', color: t.status === 'active' ? '#4ADE80' : '#F87171' }}>
                  {t.status === 'active' ? 'সক্রিয়' : 'বন্ধ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
