import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { UserPlus, Search, X, Phone, MapPin, BookOpen, Clock, CreditCard } from 'lucide-react';

const C = { card: '#241640', muted: '#9382B5', white: '#FBFAFF', primary: '#7C3AED', accent: '#F5A623', surface: '#1E1040' };
const S = {
  input: { padding: '10px 14px', background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(124,58,237,.3)', borderRadius: 10, color: '#FBFAFF', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none' } as const,
};

function AddStudentModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ phone: '', fullName: '', institution: '', classLevel: '', address: '', guardianName: '', guardianPhone: '' });
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/students', form),
    onSuccess: () => { toast.success('স্টুডেন্ট যোগ করা হয়েছে!'); qc.invalidateQueries({ queryKey: ['students'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message || 'সমস্যা হয়েছে।'),
  });
  const fields = [
    { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX', type: 'tel' },
    { key: 'fullName', label: 'পূর্ণ নাম', placeholder: 'স্টুডেন্টের নাম', type: 'text' },
    { key: 'classLevel', label: 'শ্রেণি', placeholder: 'Class 10 / HSC', type: 'text' },
    { key: 'institution', label: 'স্কুল/কলেজ', placeholder: 'প্রতিষ্ঠানের নাম', type: 'text' },
    { key: 'address', label: 'ঠিকানা', placeholder: 'গ্রাম/শহর, জেলা', type: 'text' },
    { key: 'guardianName', label: 'অভিভাবকের নাম', placeholder: 'অভিভাবকের নাম', type: 'text' },
    { key: 'guardianPhone', label: 'অভিভাবকের ফোন', placeholder: '01XXXXXXXXX', type: 'tel' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 420, border: '1px solid rgba(124,58,237,.3)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>নতুন স্টুডেন্ট যোগ</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}><X size={18} /></button>
        </div>
        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>{f.label}</label>
            <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} type={f.type} placeholder={f.placeholder}
              value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => mutate()} disabled={isPending} style={{ flex: 1, padding: 11, background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
            {isPending ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
          </button>
          <button onClick={onClose} style={{ padding: '11px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>বাতিল</button>
        </div>
      </div>
    </div>
  );
}

function StudentDetailModal({ student, onClose }: { student: any; onClose: () => void }) {
  const { data: detail } = useQuery({
    queryKey: ['student-detail', student.id],
    queryFn: () => api.get(`/admin/users/${student.id}`).then(r => r.data.data),
  });

  const { data: allBatches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: () => api.get('/batches').then(r => r.data.data),
  });

  const studentBatches = allBatches.filter((b: any) =>
    b.members?.some((m: any) => m.student?.userId === student.id || m.student?.user?.id === student.id)
  );

  const profile = detail?.studentProfile ?? student.studentProfile;
  const subscriptions = detail?.subscriptions ?? [];

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) =>
    value ? (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <Icon size={13} color={C.muted} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{label}</p>
          <p style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 500, border: '1px solid rgba(124,58,237,.3)', maxHeight: '92vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>
              {student.fullName?.[0] || 'S'}
            </div>
            <div>
              <h3 style={{ color: C.white, fontSize: 17, fontWeight: 700 }}>{student.fullName}</h3>
              <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: student.status === 'active' ? '#22C55E22' : '#EF444422', color: student.status === 'active' ? '#4ADE80' : '#F87171' }}>
                {student.status === 'active' ? 'সক্রিয়' : student.status === 'suspended' ? 'বন্ধ' : 'অপেক্ষমাণ'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}><X size={20} /></button>
        </div>

        {/* ব্যক্তিগত তথ্য */}
        <div style={{ background: 'rgba(124,58,237,.08)', borderRadius: 12, padding: 16, marginBottom: 14, border: '1px solid rgba(124,58,237,.15)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.05em' }}>ব্যক্তিগত তথ্য</p>
          <InfoRow icon={Phone} label="ফোন নম্বর" value={student.phone} />
          <InfoRow icon={MapPin} label="ঠিকানা" value={profile?.address} />
          <InfoRow icon={BookOpen} label="শ্রেণি" value={profile?.classLevel} />
          <InfoRow icon={BookOpen} label="প্রতিষ্ঠান" value={profile?.institution} />
          {profile?.guardianName && (
            <InfoRow icon={Phone} label="অভিভাবক" value={`${profile.guardianName}${profile.guardianPhone ? ' — ' + profile.guardianPhone : ''}`} />
          )}
        </div>

        {/* ব্যাচ তথ্য */}
        <div style={{ background: 'rgba(245,166,35,.06)', borderRadius: 12, padding: 16, marginBottom: 14, border: '1px solid rgba(245,166,35,.15)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={12} /> ব্যাচ সমূহ
          </p>
          {studentBatches.length === 0 ? (
            <p style={{ fontSize: 12, color: C.muted }}>কোনো ব্যাচে নেই</p>
          ) : studentBatches.map((b: any) => (
            <div key={b.id} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '12px 14px', marginBottom: 8, border: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{b.name}</p>
                {b.subject && <span style={{ fontSize: 10, color: C.accent, background: 'rgba(245,166,35,.15)', padding: '2px 8px', borderRadius: 4 }}>{b.subject}</span>}
              </div>
              {b.scheduleDays?.length > 0 && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                  {b.scheduleDays.map((d: string) => (
                    <span key={d} style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(124,58,237,.25)', borderRadius: 4, color: '#A78BFA', fontWeight: 600 }}>{d}</span>
                  ))}
                </div>
              )}
              {b.scheduleTime && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.muted, marginBottom: 4 }}>
                  <Clock size={11} /> সময়: {b.scheduleTime}
                </div>
              )}
              {b.teacher?.user?.fullName && (
                <p style={{ fontSize: 11, color: C.muted }}>👤 শিক্ষক: {b.teacher.user.fullName}</p>
              )}
              {b.maxStudents && (
                <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>👥 সর্বোচ্চ {b.maxStudents} জন</p>
              )}
            </div>
          ))}
        </div>

        {/* পেমেন্ট তথ্য */}
        <div style={{ background: 'rgba(34,197,94,.06)', borderRadius: 12, padding: 16, border: '1px solid rgba(34,197,94,.15)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4ADE80', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CreditCard size={12} /> পেমেন্ট ও ফি
          </p>
          {subscriptions.length === 0 ? (
            <p style={{ fontSize: 12, color: C.muted }}>কোনো পেমেন্ট তথ্য নেই</p>
          ) : subscriptions.map((sub: any) => (
            <div key={sub.id} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#4ADE80' }}>৳{Number(sub.plan?.priceMonthly || 0).toLocaleString()}/মাস</p>
                <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 20, background: sub.status === 'active' ? '#22C55E22' : '#EF444422', color: sub.status === 'active' ? '#4ADE80' : '#F87171' }}>
                  {sub.status === 'active' ? 'সক্রিয়' : 'মেয়াদ শেষ'}
                </span>
              </div>
              <p style={{ fontSize: 11, color: C.muted }}>প্ল্যান: {sub.plan?.name || '—'}</p>
              <p style={{ fontSize: 11, color: C.muted }}>মেয়াদ: {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString('bn-BD') : 'অনির্দিষ্ট'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Students() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students', search],
    queryFn: () => api.get(`/admin/users?role=student${search ? `&search=${encodeURIComponent(search)}` : ''}`).then(r => r.data.data),
  });

  return (
    <div>
      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} />}
      {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white }}>স্টুডেন্ট</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>মোট: {students.length} জন</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }} onClick={() => setShowAdd(true)}>
          <UserPlus size={15} /> স্টুডেন্ট যোগ
        </button>
      </div>

      <div style={{ marginBottom: 20, position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
        <input style={{ ...S.input, width: '100%', paddingLeft: 36, boxSizing: 'border-box' }} placeholder="নাম দিয়ে খুঁজুন..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ background: C.card, borderRadius: 14, border: '1px solid rgba(124,58,237,.15)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr 1.2fr 1fr 0.8fr', padding: '10px 16px', fontSize: 11, color: C.muted, borderBottom: '1px solid rgba(255,255,255,.05)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          <span>নাম</span><span>ফোন</span><span>শ্রেণি</span><span>ঠিকানা</span><span>স্ট্যাটাস</span><span>বিস্তারিত</span>
        </div>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>লোড হচ্ছে...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>কোনো স্টুডেন্ট পাওয়া যায়নি।</div>
        ) : students.map((s: any) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr 1.2fr 1fr 0.8fr', padding: '12px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {s.fullName?.[0] || 'S'}
              </div>
              <span style={{ color: C.white, fontWeight: 500 }}>{s.fullName}</span>
            </div>
            <span style={{ color: C.muted, fontFamily: 'monospace', fontSize: 11 }}>{s.phone}</span>
            <span style={{ color: C.muted, fontSize: 12 }}>{s.studentProfile?.classLevel || '—'}</span>
            <span style={{ color: C.muted, fontSize: 11 }}>{s.studentProfile?.address ? (s.studentProfile.address.length > 15 ? s.studentProfile.address.slice(0, 15) + '…' : s.studentProfile.address) : '—'}</span>
            <span>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: s.status === 'active' ? '#22C55E22' : '#EF444422', color: s.status === 'active' ? '#4ADE80' : '#F87171' }}>
                {s.status === 'active' ? 'সক্রিয়' : s.status === 'suspended' ? 'বন্ধ' : 'অপেক্ষমাণ'}
              </span>
            </span>
            <button onClick={() => setSelectedStudent(s)} style={{ padding: '5px 12px', background: 'rgba(124,58,237,.2)', border: 'none', borderRadius: 6, color: '#A78BFA', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
              দেখুন
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
