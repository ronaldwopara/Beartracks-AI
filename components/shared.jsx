// Shared constants, tokens, and utility components for Beartracks AI

const COLORS = {
  green: '#2d7a4f',
  greenLight: '#e8f5ee',
  greenMid: '#78be20',
  gold: '#f5c842',
  goldLight: '#fdf8e1',
  surface: '#ffffff',
  bg: '#f7f8f6',
  border: '#e8ebe6',
  text: '#1a1f1a',
  textMid: '#4a5249',
  textLight: '#8a9489',
  error: '#c0392b',
  errorLight: '#fdecea',
};

const DOMAIN_COLORS = {
  Housing: { bg: '#e8f4fd', text: '#1a6fa0', dot: '#2196f3' },
  Academics: { bg: '#e8f5ee', text: '#2d7a4f', dot: '#2d7a4f' },
  Finances: { bg: '#fdf8e1', text: '#8a6a00', dot: '#f5c842' },
  Wellness: { bg: '#fce4ec', text: '#a0294a', dot: '#e91e63' },
  'Campus Life': { bg: '#f3e5f5', text: '#6a1b9a', dot: '#9c27b0' },
};

const CHIP_TYPES = {
  location: { bg: '#e8f4fd', text: '#1a6fa0', icon: '📍' },
  date: { bg: '#fdf8e1', text: '#8a6a00', icon: '📅' },
  time: { bg: '#f3e5f5', text: '#6a1b9a', icon: '🕐' },
  amenity: { bg: '#e8f5ee', text: '#2d7a4f', icon: '✦' },
  proximity: { bg: '#fce4ec', text: '#a0294a', icon: '⊙' },
  noise: { bg: '#fff3e0', text: '#8a4a00', icon: '🔇' },
  duration: { bg: '#e0f7fa', text: '#006064', icon: '⏱' },
  capacity: { bg: '#f1f8e9', text: '#558b2f', icon: '👥' },
};

// Shared components exported to window
const StatusBar = () => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 20px 4px', fontSize: 12, fontWeight: 600,
    color: COLORS.textMid, fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.01em'
  }}>
    <span>9:41</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <rect x="0" y="4" width="3" height="8" rx="1" fill={COLORS.textMid}/>
        <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill={COLORS.textMid}/>
        <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={COLORS.textMid}/>
        <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill={COLORS.border}/>
      </svg>
      <svg width="16" height="12" viewBox="0 0 20 14" fill="none">
        <path d="M10 2.5C13.2 2.5 16.1 3.8 18.2 5.9L20 4.1C17.4 1.5 13.9 0 10 0C6.1 0 2.6 1.5 0 4.1L1.8 5.9C3.9 3.8 6.8 2.5 10 2.5Z" fill={COLORS.textMid}/>
        <path d="M10 7C12 7 13.8 7.8 15.2 9.1L17 7.3C15.1 5.5 12.7 4.5 10 4.5C7.3 4.5 4.9 5.5 3 7.3L4.8 9.1C6.2 7.8 8 7 10 7Z" fill={COLORS.textMid}/>
        <circle cx="10" cy="12" r="2" fill={COLORS.textMid}/>
      </svg>
      <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <div style={{ width: 22, height: 11, border: `1.5px solid ${COLORS.textMid}`, borderRadius: 3, padding: '1px 1.5px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '75%', height: '100%', background: COLORS.green, borderRadius: 1.5 }}></div>
        </div>
      </div>
    </div>
  </div>
);

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'track', label: 'Track', icon: TrackIcon },
    { id: 'ask', label: 'Ask', icon: AskIcon },
    { id: 'create', label: 'Create', icon: CreateIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 0 20px', zIndex: 100,
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 16px', color: active ? COLORS.green : COLORS.textLight,
              transition: 'color 0.2s',
            }}>
            <Icon active={active} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em' }}>
              {tab.label}
            </span>
            {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: COLORS.green, marginTop: -2 }}></div>}
          </button>
        );
      })}
    </div>
  );
};

const TrackIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="2" fill={active ? COLORS.green : 'none'} stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="2" fill="none" stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="2" fill="none" stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="2" fill="none" stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5"/>
  </svg>
);

const AskIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.06L2 22l4.94-1.38C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
      fill={active ? COLORS.green : 'none'} stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5"/>
    <circle cx="8.5" cy="12" r="1" fill={active ? 'white' : COLORS.textLight}/>
    <circle cx="12" cy="12" r="1" fill={active ? 'white' : COLORS.textLight}/>
    <circle cx="15.5" cy="12" r="1" fill={active ? 'white' : COLORS.textLight}/>
  </svg>
);

const CreateIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill={active ? COLORS.green : 'none'} stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke={active ? 'white' : COLORS.textLight} strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke={active ? 'white' : COLORS.textLight} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill={active ? COLORS.green : 'none'} stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5"/>
    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={active ? COLORS.green : COLORS.textLight} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Chip = ({ type = 'location', label, onTap, draggable = false, small = false }) => {
  const style = CHIP_TYPES[type] || CHIP_TYPES.location;
  return (
    <div onClick={onTap}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: style.bg, color: style.text,
        border: `1px solid ${style.text}22`,
        borderRadius: 20, padding: small ? '4px 10px' : '6px 12px',
        fontSize: small ? 12 : 13, fontWeight: 500,
        cursor: onTap ? 'pointer' : 'default',
        fontFamily: 'DM Sans, sans-serif',
        userSelect: 'none',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseDown={e => { if(onTap) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ fontSize: small ? 10 : 12 }}>{style.icon}</span>
      <span>{label}</span>
      {onTap && <span style={{ fontSize: 10, opacity: 0.6 }}>›</span>}
    </div>
  );
};

const ProgressRing = ({ progress = 0, size = 44, color = COLORS.green, label }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.border} strokeWidth={4}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, color, fontFamily: 'DM Sans, sans-serif'
        }}>{label}</div>
      )}
    </div>
  );
};

const PulsingDot = ({ color = COLORS.green }) => (
  <div style={{ position: 'relative', width: 8, height: 8 }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}></div>
    <div style={{
      position: 'absolute', inset: -3, borderRadius: '50%',
      background: color, opacity: 0.3,
      animation: 'pulse-ring 1.5s ease infinite',
    }}></div>
  </div>
);

Object.assign(window, {
  COLORS, DOMAIN_COLORS, CHIP_TYPES,
  StatusBar, BottomNav, Chip, ProgressRing, PulsingDot,
  TrackIcon, AskIcon, CreateIcon, ProfileIcon,
});
