import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const notices = [
  { tag: 'নতুন', color: '#F87171', bg: 'rgba(239,68,68,.12)', text: 'বার্ষিক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে', date: '২৪ জুন, ২০২৬' },
  { tag: 'জরুরি', color: '#F59E0B', bg: 'rgba(245,158,11,.12)', text: 'রমজান মাসে ক্লাস রুটিন পরিবর্তন করা হয়েছে', date: '২০ জুন, ২০২৬' },
  { tag: 'তথ্য', color: '#60A5FA', bg: 'rgba(96,165,250,.12)', text: '২০২৬-২৭ শিক্ষাবর্ষে ভর্তি চলছে', date: '১৫ জুন, ২০২৬' },
  { tag: 'নতুন', color: '#F87171', bg: 'rgba(239,68,68,.12)', text: 'কুরআন প্রতিযোগিতা আগামী শুক্রবার অনুষ্ঠিত হবে', date: '১০ জুন, ২০২৬' },
  { tag: 'তথ্য', color: '#60A5FA', bg: 'rgba(96,165,250,.12)', text: 'বার্ষিক মাহফিল ১৫ জুলাই অনুষ্ঠিত হবে', date: '০৫ জুন, ২০২৬' },
];

const downloads = [
  { name: 'পরীক্ষার সময়সূচি ২০২৬', type: 'PDF', size: '১.২ MB', color: '#F87171', bg: 'rgba(239,68,68,.12)' },
  { name: 'ভর্তি ফর্ম ২০২৬-২৭', type: 'DOC', size: '৮৫৪ KB', color: '#60A5FA', bg: 'rgba(96,165,250,.12)' },
  { name: 'বার্ষিক রুটিন ২০২৬', type: 'PDF', size: '৫৩০ KB', color: '#F87171', bg: 'rgba(239,68,68,.12)' },
  { name: 'মাদ্রাসার ব্রোশার', type: 'IMG', size: '২.১ MB', color: '#4ADE80', bg: 'rgba(74,222,128,.12)' },
  { name: 'পূর্ববর্তী বছরের প্রশ্নপত্র', type: 'DOC', size: '১.৮ MB', color: '#60A5FA', bg: 'rgba(96,165,250,.12)' },
];

const stats = [
  { num: '৮৫০+', label: 'শিক্ষার্থী' },
  { num: '৪৫', label: 'শিক্ষক' },
  { num: '৩৮', label: 'বছরের অভিজ্ঞতা' },
  { num: '৯৮%', label: 'পাসের হার' },
];

const teachers = [
  { name: 'মাওলানা আব্দুল করিম', subject: 'হাদিস ও ফিকহ' },
  { name: 'হাফেজ মোহাম্মদ আলী', subject: 'কুরআন তেলাওয়াত' },
  { name: 'মুফতি ইব্রাহিম খলিল', subject: 'তাফসির ও আকিদা' },
  { name: 'মাওলানা সালেহ আহমদ', subject: 'আরবি ব্যাকরণ' },
];

type Section = 'home' | 'notice' | 'schedule' | 'download' | 'contact';

export default function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>('home');
  const [dlDone, setDlDone] = useState<number | null>(null);

  const navItems: { key: Section; label: string }[] = [
    { key: 'home', label: 'হোম' },
    { key: 'notice', label: 'নোটিস' },
    { key: 'schedule', label: 'রুটিন' },
    { key: 'download', label: 'ডাউনলোড' },
    { key: 'contact', label: 'যোগাযোগ' },
  ];

  return (
    <div style={{ fontFamily: "'Noto Serif Bengali','Hind Siliguri',sans-serif", background: '#07001A', minHeight: '100vh', color: '#F0E6C8' }}>

      {/* Navbar */}
      <nav style={{ background: '#0D0035', borderBottom: '1px solid rgba(201,162,39,.25)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,162,39,.15)', border: '1px solid rgba(201,162,39,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🕌</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#F0E6C8', lineHeight: 1.2 }}>দারুল উলূম মাদ্রাসা</p>
            <p style={{ fontSize: 10, color: '#9382B5' }}>ইসলামিক একাডেমি ও এতিমখানা</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItems.map(n => (
            <button key={n.key} onClick={() => setActive(n.key)} style={{
              padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontFamily: 'inherit',
              color: active === n.key ? '#F0C040' : '#9382B5',
              borderBottom: active === n.key ? '2px solid #C9A227' : '2px solid transparent',
            }}>{n.label}</button>
          ))}
          <button onClick={() => navigate('/login')} style={{
            marginLeft: 12, padding: '7px 16px', background: 'rgba(124,58,237,.25)',
            border: '1px solid rgba(124,58,237,.4)', borderRadius: 8, color: '#A78BFA',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}>🔒 এডমিন</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', background: 'linear-gradient(180deg,#1a0050 0%,#07001A 100%)', padding: '60px 32px 50px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Islamic star pattern */}
        <svg style={{ position: 'absolute', inset: 0, opacity: .06, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="sp" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
              <polygon points="45,5 52,32 78,32 57,50 64,76 45,59 26,76 33,50 12,32 38,32" fill="none" stroke="#F0C040" strokeWidth="1"/>
              <polygon points="45,18 50,32 64,32 54,41 57,56 45,48 33,56 36,41 26,32 40,32" fill="none" stroke="#C9A227" strokeWidth=".6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sp)"/>
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(201,162,39,.1)', border: '1px solid rgba(201,162,39,.3)', borderRadius: 20, padding: '4px 18px', fontSize: 13, color: '#C9A227', marginBottom: 20, fontFamily: 'serif' }}>
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#F0E6C8', lineHeight: 1.2, marginBottom: 10 }}>
            দারুল উলূম <span style={{ color: '#F0C040' }}>মাদ্রাসা</span>
          </h1>
          <p style={{ fontSize: 15, color: '#9382B5', maxWidth: 500, margin: '0 auto 28px' }}>
            কুরআন, হাদিস ও আধুনিক শিক্ষার সমন্বয়ে নৈতিক ও যোগ্য মানুষ গড়ে তোলার পথে আমাদের নিরবচ্ছিন্ন যাত্রা।
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActive('notice')} style={{ padding: '12px 24px', background: '#7C3AED', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              📢 নোটিস বোর্ড দেখুন
            </button>
            <button onClick={() => setActive('contact')} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(201,162,39,.4)', borderRadius: 10, color: '#F0C040', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              📋 ভর্তি তথ্য
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(201,162,39,.15)', borderBottom: '1px solid rgba(201,162,39,.15)' }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,.05)' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#F0C040' }}>{s.num}</div>
            <div style={{ fontSize: 12, color: '#9382B5', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

        {/* Left */}
        <div>
          {/* Home section */}
          {active === 'home' && (
            <>
              <SectionTitle>🕌 মাদ্রাসা পরিচিতি</SectionTitle>
              <Card>
                <p style={{ fontSize: 14, color: '#B0C4D8', lineHeight: 1.9 }}>
                  দারুল উলূম ইসলামিয়া মাদ্রাসা ১৯৮৫ সাল থেকে ইসলামিক শিক্ষার পাশাপাশি আধুনিক শিক্ষার সমন্বয়ে শিক্ষার্থীদের গড়ে তুলছে। আমাদের লক্ষ্য কুরআন-হাদিসের জ্ঞান অর্জনের মাধ্যমে নৈতিক ও আদর্শ মুসলিম নাগরিক তৈরি করা।
                </p>
                <p style={{ fontSize: 14, color: '#B0C4D8', lineHeight: 1.9, marginTop: 12 }}>
                  আমাদের প্রতিষ্ঠান এতিম শিশুদের বিনামূল্যে থাকা-খাওয়া ও শিক্ষার ব্যবস্থা করে। দেশের সেরা আলেম-ওলামাদের তত্ত্বাবধানে পরিচালিত এই মাদ্রাসা থেকে প্রতি বছর শত শত শিক্ষার্থী কৃতিত্বের সাথে পাস করছে।
                </p>
              </Card>

              <SectionTitle style={{ marginTop: 24 }}>👥 শিক্ষক মণ্ডলী</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {teachers.map(t => (
                  <Card key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(201,162,39,.15)', border: '1px solid rgba(201,162,39,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#F0C040', flexShrink: 0 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#F0E6C8' }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: '#9382B5', marginTop: 2 }}>{t.subject}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Notice section */}
          {active === 'notice' && (
            <>
              <SectionTitle>📢 নোটিস বোর্ড</SectionTitle>
              {notices.map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <div style={{ flexShrink: 0, padding: '2px 10px', background: n.bg, border: `1px solid ${n.color}40`, borderRadius: 6, fontSize: 10, fontWeight: 700, color: n.color, display: 'flex', alignItems: 'center' }}>{n.tag}</div>
                  <div>
                    <p style={{ fontSize: 14, color: '#D0E0F0', lineHeight: 1.5 }}>{n.text}</p>
                    <p style={{ fontSize: 11, color: '#5A7A9A', marginTop: 4 }}>📅 {n.date}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Schedule section */}
          {active === 'schedule' && (
            <>
              <SectionTitle>📅 ক্লাস রুটিন</SectionTitle>
              <Card>
                {[
                  { time: 'সকাল ৬:০০', sub: 'ফজর নামাজ ও কুরআন তেলাওয়াত' },
                  { time: 'সকাল ৮:০০', sub: 'আরবি ব্যাকরণ ও সরফ' },
                  { time: 'সকাল ১০:০০', sub: 'তাফসির ও হাদিস' },
                  { time: 'দুপুর ১২:০০', sub: 'জোহর নামাজ ও বিরতি' },
                  { time: 'দুপুর ২:০০', sub: 'ফিকহ ও আকিদা' },
                  { time: 'বিকাল ৪:০০', sub: 'আসর নামাজ ও খেলাধুলা' },
                  { time: 'সন্ধ্যা ৬:০০', sub: 'মাগরিব ও দোয়া মাহফিল' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)', alignItems: 'center' }}>
                    <span style={{ minWidth: 100, fontSize: 12, color: '#C9A227', fontWeight: 600 }}>{r.time}</span>
                    <span style={{ fontSize: 13, color: '#B0C4D8' }}>{r.sub}</span>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* Download section */}
          {active === 'download' && (
            <>
              <SectionTitle>⬇️ ডাউনলোড সেন্টার</SectionTitle>
              {downloads.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, marginBottom: 10, cursor: 'pointer', transition: 'border-color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A22760')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)')}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: d.color }}>{d.type}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#D0E0F0', fontWeight: 500 }}>{d.name}</p>
                    <p style={{ fontSize: 11, color: '#5A7A9A', marginTop: 2 }}>{d.size}</p>
                  </div>
                  <button onClick={() => { setDlDone(i); setTimeout(() => setDlDone(null), 1500); }}
                    style={{ padding: '5px 14px', background: dlDone === i ? 'rgba(74,222,128,.15)' : 'rgba(201,162,39,.1)', border: `1px solid ${dlDone === i ? 'rgba(74,222,128,.3)' : 'rgba(201,162,39,.25)'}`, borderRadius: 6, color: dlDone === i ? '#4ADE80' : '#C9A227', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {dlDone === i ? '✓ হয়েছে' : '⬇ ডাউনলোড'}
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Contact section */}
          {active === 'contact' && (
            <>
              <SectionTitle>📞 যোগাযোগ ও ভর্তি তথ্য</SectionTitle>
              <Card>
                {[
                  { icon: '📍', label: 'ঠিকানা', val: 'নেত্রকোণা সদর, ময়মনসিংহ বিভাগ' },
                  { icon: '📞', label: 'ফোন', val: '০১৭XX-XXXXXX / ০১৮XX-XXXXXX' },
                  { icon: '📧', label: 'ইমেইল', val: 'info@darululoom.edu.bd' },
                  { icon: '🕐', label: 'যোগাযোগের সময়', val: 'শনি-বৃহস্পতি, সকাল ৮টা - বিকাল ৫টা' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
                    <div>
                      <p style={{ fontSize: 11, color: '#9382B5' }}>{c.label}</p>
                      <p style={{ fontSize: 14, color: '#D0E0F0', marginTop: 2 }}>{c.val}</p>
                    </div>
                  </div>
                ))}
              </Card>
              <Card style={{ marginTop: 14, background: 'rgba(201,162,39,.06)', border: '1px solid rgba(201,162,39,.2)' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#F0C040', marginBottom: 8 }}>📋 ভর্তির যোগ্যতা</p>
                {['হিফজ বিভাগ: ৬-১২ বছর বয়সী ছেলে শিশু', 'কিতাব বিভাগ: ৮ম শ্রেণি পাস বা সমতুল্য', 'এতিম শিশুদের বিনামূল্যে ভর্তির সুযোগ', 'প্রতি বছর জানুয়ারি ও জুলাই মাসে ভর্তি'].map((t, i) => (
                  <p key={i} style={{ fontSize: 13, color: '#B0C4D8', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>✦ {t}</p>
                ))}
              </Card>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Notice sidebar */}
          <SectionTitle>📢 সাম্প্রতিক নোটিস</SectionTitle>
          {notices.slice(0, 4).map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <span style={{ padding: '1px 8px', background: n.bg, borderRadius: 4, fontSize: 10, fontWeight: 700, color: n.color, flexShrink: 0, height: 'fit-content', marginTop: 2 }}>{n.tag}</span>
              <div>
                <p style={{ fontSize: 12, color: '#C0D4E8', lineHeight: 1.5 }}>{n.text}</p>
                <p style={{ fontSize: 10, color: '#5A7A9A', marginTop: 3 }}>{n.date}</p>
              </div>
            </div>
          ))}

          {/* Downloads sidebar */}
          <SectionTitle style={{ marginTop: 24 }}>⬇️ ডাউনলোড</SectionTitle>
          {downloads.slice(0, 3).map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: d.color, flexShrink: 0 }}>{d.type}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: '#C0D4E8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</p>
                <p style={{ fontSize: 10, color: '#5A7A9A' }}>{d.size}</p>
              </div>
            </div>
          ))}
          <button onClick={() => setActive('download')} style={{ width: '100%', marginTop: 10, padding: '8px', background: 'rgba(201,162,39,.08)', border: '1px solid rgba(201,162,39,.2)', borderRadius: 8, color: '#C9A227', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            সব দেখুন →
          </button>

          {/* Contact quick */}
          <SectionTitle style={{ marginTop: 24 }}>📞 যোগাযোগ</SectionTitle>
          <Card>
            <p style={{ fontSize: 12, color: '#9382B5', marginBottom: 6 }}>📍 নেত্রকোণা সদর, ময়মনসিংহ</p>
            <p style={{ fontSize: 12, color: '#9382B5', marginBottom: 6 }}>📞 ০১৭XX-XXXXXX</p>
            <p style={{ fontSize: 12, color: '#9382B5' }}>🕐 শনি-বৃহস্পতি, ৮টা-৫টা</p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(201,162,39,.15)', padding: '20px 32px', textAlign: 'center', background: '#0D0035' }}>
        <p style={{ fontSize: 13, color: '#5A7A9A' }}>© ২০২৬ দারুল উলূম ইসলামিয়া মাদ্রাসা · সর্বস্বত্ব সংরক্ষিত</p>
        <p style={{ fontSize: 11, color: '#3A4A5A', marginTop: 4 }}>Developed by Smart Coaching System</p>
      </div>
    </div>
  );
}

function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 700, color: '#C9A227', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(201,162,39,.2)', textTransform: 'uppercase', letterSpacing: '.05em', ...style }}>
      {children}
    </p>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '14px 16px', ...style }}>
      {children}
    </div>
  );
}
