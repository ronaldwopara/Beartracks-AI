// Profile Tab — Student OneCard + settings

const ProfileTab = () => {
  const [photoUploaded, setPhotoUploaded] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPhotoUploaded(true);
  };

  const sections = [
    {
      title: 'Stashes',
      items: ['BIOL 207 Syllabus.pdf', 'uab.ca/ecc', 'Scholarship List.pdf'],
      icon: '📚', color: COLORS.greenLight, textColor: COLORS.green,
    },
    {
      title: 'Active Milestones',
      items: ['Find Summer Research Position', 'Secure Off-Campus Housing'],
      icon: '🎯', color: COLORS.goldLight, textColor: '#8a6a00',
    },
    {
      title: 'Squads / Pods',
      items: ['BIOL 307 Study Group — 4 members', 'Intramural Volleyball'],
      icon: '👥', color: '#f3e5f5', textColor: '#6a1b9a',
    },
  ];

  const settingsItems = [
    { label: 'Notification preferences', icon: '🔔' },
    { label: 'Data & Privacy', icon: '🔐' },
    { label: 'Delete my profile data', icon: '🗑', danger: true },
    { label: 'Connected integrations', icon: '⛓' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: COLORS.bg }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: COLORS.text }}>Profile</div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
          University of Alberta · 2025–26
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 16px 100px' }}>

        {/* OneCard */}
        <div style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a6e3c 0%, #2d8a52 40%, #78be20 100%)',
          padding: '0',
          boxShadow: '0 8px 40px rgba(45,122,79,0.35)',
          marginBottom: 24,
          height: 200,
        }}>
          {/* Background geometric pattern */}
          <svg style={{ position: 'absolute', right: 0, top: 0, height: '100%', opacity: 0.18 }} viewBox="0 0 220 200" fill="none" preserveAspectRatio="xMidYMid slice">
            <circle cx="140" cy="100" r="120" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
            <circle cx="140" cy="100" r="80" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
            <circle cx="140" cy="100" r="40" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
            <polygon points="140,20 200,80 180,160 100,160 80,80" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
            <polygon points="140,50 175,90 160,140 120,140 105,90" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
            <polygon points="140,75 162,100 155,128 125,128 118,100" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
          </svg>

          {/* Gold "A" mark */}
          <div style={{
            position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)',
            fontFamily: 'DM Serif Display, serif', fontSize: 100, fontWeight: 900,
            color: '#f5c842', opacity: 0.25, lineHeight: 1, letterSpacing: -4,
            userSelect: 'none',
          }}>A</div>

          {/* onecard badge */}
          <div style={{
            position: 'absolute', bottom: 16, right: 20,
            background: '#f5c842', borderRadius: 20, padding: '4px 12px',
            fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: '#1a1f1a',
          }}>
            one card
          </div>

          {/* Photo area */}
          <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                width: 80, height: 100,
                background: photoUploaded ? 'transparent' : 'rgba(255,255,255,0.15)',
                borderRadius: 10,
                border: photoUploaded ? 'none' : '2px dashed rgba(255,255,255,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden',
                backdropFilter: photoUploaded ? 'none' : 'blur(4px)',
              }}>
              {photoUploaded && photoUrl ? (
                <img src={photoUrl} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 4 }}>
                    <circle cx="12" cy="9" r="4" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
                    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.2 }}>Tap to add photo</span>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Student info */}
          <div style={{ position: 'absolute', left: 120, bottom: 16, right: 90 }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, color: 'white', lineHeight: 1.2 }}>Alex Okonkwo</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>BSc Biology · Year 2</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>ID: 1623847</div>
          </div>

          {/* U of A logo area */}
          <div style={{ position: 'absolute', left: 120, top: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Crest placeholder */}
            <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12 }}>🐻</span>
            </div>
            <div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '0.06em' }}>UNIVERSITY</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '0.06em' }}>OF ALBERTA</div>
            </div>
          </div>
        </div>

        {/* Context objects */}
        {sections.map(s => (
          <div key={s.title} style={{ background: COLORS.surface, borderRadius: 16, border: `1px solid ${COLORS.border}`, marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: s.color, borderBottom: `1px solid ${s.textColor}22`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: s.textColor }}>{s.title}</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {s.items.map((item, i) => (
                <div key={i} style={{
                  padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: i < s.items.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: COLORS.textMid }}>{item}</span>
                  <span style={{ color: COLORS.textLight, fontSize: 16 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Budgets */}
        <div style={{ background: COLORS.surface, borderRadius: 16, border: `1px solid ${COLORS.border}`, marginBottom: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: COLORS.goldLight, borderBottom: `1px solid #f5c84222`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>💰</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#8a6a00' }}>Budgets</span>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Meal Plan', spent: 340, total: 500 },
              { label: 'Textbook Allowance', spent: 210, total: 400 },
            ].map(b => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: COLORS.textMid }}>{b.label}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: COLORS.text }}>${b.spent} / ${b.total}</span>
                </div>
                <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(b.spent / b.total) * 100}%`, height: '100%', background: '#f5c842', borderRadius: 3 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: COLORS.surface, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden', marginBottom: 8 }}>
          {settingsItems.map((item, i) => (
            <div key={i} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < settingsItems.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              cursor: 'pointer',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: item.danger ? COLORS.error : COLORS.textMid, flex: 1 }}>{item.label}</span>
              <span style={{ color: COLORS.textLight, fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0 8px', fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: COLORS.textLight }}>
          Beartracks AI · v0.1.0 · University of Alberta
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ProfileTab });
