import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Users, BookOpen } from 'lucide-react';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED', accent: '#F5A623' };
const S = {
  input: { padding: '10px 14px', background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 10, color: '#FBFAFF', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none', width: '100%' } as const,
};

function AddBatchModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', subject: '', maxStudents: 7, scheduleDays: [] as string[] });
  const days = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
  const daysBn: Record<string, string> = { SAT: 'শনি', SUN: 'রবি', MON: 'সোম', TUE: 'মঙ্গল', WED: 'বুধ', THU: 'বৃহ', FRI: 'শুক্র' };

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/batches', form),
    onSuccess: () => { toast.success('ব্যাচ তৈরি হয়েছে!'); qc.invalidateQueries({ queryKey: ['batches'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  const toggleDay = (d: string) => setForm(p => ({ ...p, scheduleDays: p.scheduleDays.includes(d) ? p.scheduleDays.filter(x => x !== d) : [...p.scheduleDays, d] }));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#1E1040', borderRadius: 16, padding: 28, width: 400, border: '1px solid rgba(124,58,237,.3)' }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>নতুন ব্যাচ তৈরি করুন</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>ব্যাচের নাম</label>
          <input style={S.input} placeholder="যেমন: HSC Physics - Batch A" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>বিষয়</label>
          <input style={S.input} placeholder="যেমন: পদার্থবিজ্ঞান" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 8 }}>সাপ্তাহিক দিন</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {days.map(d => (
              <button key={d} onClick={() => toggleDay(d)} style={{
                padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${form.scheduleDays.includes(d) ? C.primary : 'rgba(255,255,255,.1)'}`,
                background: form.scheduleDays.includes(d) ? `${C.primary}33` : 'transparent',
                color: form.scheduleDays.includes(d) ? '#A78BFA' : C.muted,
                fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
              }}>{daysBn[d]}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>সর্বোচ্চ স্টুডেন্ট: {form.maxStudents}</label>
          <input type="range" min={1} max={7} value={form.maxStudents} onChange={e => setForm(p => ({ ...p, maxStudents: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: C.primary }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => mutate()} disabled={isPending} style={{ flex: 1, padding: '11px', background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
            {isPending ? 'তৈরি হচ্ছে...' : 'তৈরি করুন'}
          </button>
          <button onClick={onClose} style={{ padding: '11px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>বাতিল</button>
        </div>
      </div>
    </div>
  );
}

export default function Batches() {
  const [showAdd, setShowAdd] = useState(false);
  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => api.get('/batches').then(r => r.data.data),
  });

  return (
    <div>
      {showAdd && <AddBatchModal onClose={() => setShowAdd(false)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>ব্যাচ ম্যানেজমেন্ট</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>মোট ব্যাচ: {batches.length}</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
          <Plus size={15} /> নতুন ব্যাচ
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', color: C.muted, padding: 60 }}>লোড হচ্ছে...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {batches.map((b: any) => (
            <div key={b.id} style={{ background: C.card, borderRadius: 14, padding: 20, border: '1px solid rgba(124,58,237,.15)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} color={C.primary} />
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: b.status === 'active' ? '#22C55E22' : '#EF444422', color: b.status === 'active' ? '#4ADE80' : '#F87171' }}>
                  {b.status === 'active' ? 'সক্রিয়' : 'বন্ধ'}
                </span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4 }}>{b.name}</h3>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{b.subject || 'বিষয় নির্ধারিত নয়'}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.muted, fontSize: 12 }}>
                  <Users size={13} /> {b._count?.members || 0}/{b.maxStudents} জন
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(b.scheduleDays || []).map((d: string) => (
                    <span key={d} style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(124,58,237,.2)', borderRadius: 4, color: '#A78BFA' }}>{d}</span>
                  ))}
                </div>
              </div>
              {b.teacher && (
                <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
                  👤 {b.teacher.user?.fullName || 'শিক্ষক নির্ধারিত নয়'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
