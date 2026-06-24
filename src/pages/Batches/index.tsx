import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Users, BookOpen, X, UserCheck, UserPlus } from 'lucide-react';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED', accent: '#F5A623', surface: '#1E1040' };
const S = { input: { padding: '10px 14px', background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 10, color: '#FBFAFF', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none', width: '100%' } as const };

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
      <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 400, border: '1px solid rgba(124,58,237,.3)' }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>নতুন ব্যাচ তৈরি করুন</h3>
        {[{ key: 'name', label: 'ব্যাচের নাম', ph: 'HSC Physics - Batch A' }, { key: 'subject', label: 'বিষয়', ph: 'পদার্থবিজ্ঞান' }].map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>{f.label}</label>
            <input style={S.input} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 8 }}>সাপ্তাহিক দিন</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {days.map(d => (
              <button key={d} onClick={() => toggleDay(d)} style={{ padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${form.scheduleDays.includes(d) ? C.primary : 'rgba(255,255,255,.1)'}`, background: form.scheduleDays.includes(d) ? `${C.primary}33` : 'transparent', color: form.scheduleDays.includes(d) ? '#A78BFA' : C.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>{daysBn[d]}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>সর্বোচ্চ স্টুডেন্ট: {form.maxStudents}</label>
          <input type="range" min={1} max={7} value={form.maxStudents} onChange={e => setForm(p => ({ ...p, maxStudents: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: C.primary }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => mutate()} disabled={isPending} style={{ flex: 1, padding: 11, background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>{isPending ? 'তৈরি হচ্ছে...' : 'তৈরি করুন'}</button>
          <button onClick={onClose} style={{ padding: '11px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>বাতিল</button>
        </div>
      </div>
    </div>
  );
}

function ManageBatchModal({ batch, onClose }: { batch: any; onClose: () => void }) {
  const qc = useQueryClient();

  const { data: teachers = [] } = useQuery({ queryKey: ['teachers-list'], queryFn: () => api.get('/admin/users?role=teacher').then(r => r.data.data) });
  const { data: students = [] } = useQuery({ queryKey: ['students-list'], queryFn: () => api.get('/admin/users?role=student').then(r => r.data.data) });
  const { data: batchDetail } = useQuery({ queryKey: ['batch', batch.id], queryFn: () => api.get(`/batches/${batch.id}`).then(r => r.data.data) });

  const assignTeacher = useMutation({
    mutationFn: (teacherUserId: string) => api.post(`/batches/${batch.id}/assign-teacher`, { teacherUserId }),
    onSuccess: () => { toast.success('টিচার যোগ হয়েছে!'); qc.invalidateQueries({ queryKey: ['batches'] }); qc.invalidateQueries({ queryKey: ['batch', batch.id] }); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  const addStudent = useMutation({
    mutationFn: (studentUserId: string) => api.post(`/batches/${batch.id}/members`, { studentUserId }),
    onSuccess: () => { toast.success('স্টুডেন্ট যোগ হয়েছে!'); qc.invalidateQueries({ queryKey: ['batches'] }); qc.invalidateQueries({ queryKey: ['batch', batch.id] }); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  const removeStudent = useMutation({
    mutationFn: (studentId: string) => api.delete(`/batches/${batch.id}/members/${studentId}`),
    onSuccess: () => { toast.success('স্টুডেন্ট সরানো হয়েছে।'); qc.invalidateQueries({ queryKey: ['batch', batch.id] }); qc.invalidateQueries({ queryKey: ['batches'] }); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });

  const members: any[] = batchDetail?.members || [];
  const memberIds = new Set(members.map((m: any) => m.studentId));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 520, border: '1px solid rgba(124,58,237,.3)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>{batch.name}</h3>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{batch.subject}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}><X size={20} /></button>
        </div>

        {/* টিচার assign */}
        <div style={{ background: 'rgba(124,58,237,.08)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid rgba(124,58,237,.2)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><UserCheck size={14} /> টিচার নির্ধারণ</p>
          {batchDetail?.teacher ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(34,197,94,.1)', borderRadius: 8, border: '1px solid rgba(34,197,94,.2)' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>{batchDetail.teacher.user?.fullName?.[0]}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#4ADE80' }}>{batchDetail.teacher.user?.fullName}</p>
                <p style={{ fontSize: 10, color: C.muted }}>বর্তমান টিচার</p>
              </div>
            </div>
          ) : <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>কোনো টিচার নেই — নিচ থেকে বেছে নিন</p>}
          <div style={{ marginTop: 10 }}>
            <select onChange={e => e.target.value && assignTeacher.mutate(e.target.value)} defaultValue="" style={{ ...S.input, cursor: 'pointer' }}>
              <option value="">— টিচার বেছে নিন —</option>
              {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.fullName} ({t.phone})</option>)}
            </select>
          </div>
        </div>

        {/* স্টুডেন্ট যোগ */}
        <div style={{ background: 'rgba(245,166,35,.06)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid rgba(245,166,35,.2)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><UserPlus size={14} /> স্টুডেন্ট যোগ করুন ({members.length}/{batch.maxStudents})</p>
          <select onChange={e => { if (e.target.value) { addStudent.mutate(e.target.value); e.target.value = ''; } }} defaultValue="" style={{ ...S.input, cursor: 'pointer' }}>
            <option value="">— স্টুডেন্ট বেছে নিন —</option>
            {students.filter((s: any) => !memberIds.has(s.id)).map((s: any) => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.phone})</option>
            ))}
          </select>
        </div>

        {/* বর্তমান স্টুডেন্ট তালিকা */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> ব্যাচের স্টুডেন্ট ({members.length} জন)</p>
          {members.length === 0 ? (
            <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', padding: 16 }}>এখনো কোনো স্টুডেন্ট নেই</p>
          ) : members.map((m: any) => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 8, marginBottom: 6, border: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{m.student?.user?.fullName?.[0] || 'S'}</div>
                <div>
                  <p style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{m.student?.user?.fullName}</p>
                  <p style={{ fontSize: 10, color: C.muted }}>{m.student?.classLevel || ''}</p>
                </div>
              </div>
              <button onClick={() => removeStudent.mutate(m.studentId)} style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 6, padding: '4px 10px', color: '#F87171', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>সরান</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Batches() {
  const [showAdd, setShowAdd] = useState(false);
  const [manageBatch, setManageBatch] = useState<any>(null);
  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => api.get('/batches').then(r => r.data.data),
  });

  return (
    <div>
      {showAdd && <AddBatchModal onClose={() => setShowAdd(false)} />}
      {manageBatch && <ManageBatchModal batch={manageBatch} onClose={() => setManageBatch(null)} />}

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
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{b.subject || 'বিষয় নির্ধারিত নয়'}</p>

              {b.teacher ? (
                <p style={{ fontSize: 11, color: '#4ADE80', marginBottom: 8 }}>👤 {b.teacher.user?.fullName}</p>
              ) : (
                <p style={{ fontSize: 11, color: '#F87171', marginBottom: 8 }}>👤 টিচার নেই</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.muted, fontSize: 12 }}>
                  <Users size={13} /> {b._count?.members || 0}/{b.maxStudents} জন
                </div>
                <button onClick={() => setManageBatch(b)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', background: `${C.primary}22`, border: `1px solid ${C.primary}44`, borderRadius: 8, color: '#A78BFA', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
                  ⚙ ম্যানেজ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
