'use client';

import { Icon } from './Icon';
import { C, SANS } from './tokens';

export function StatusBar() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 22px 4px',
        fontSize: 13,
        fontWeight: 600,
        color: C.text,
        fontFamily: SANS,
      }}
    >
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="11" viewBox="0 0 16 12">
          <rect x="0" y="4" width="3" height="8" rx="1" fill={C.text} />
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill={C.text} />
          <rect x="9" y=".5" width="3" height="11.5" rx="1" fill={C.text} />
          <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill={C.text} />
        </svg>
        <svg width="14" height="11" viewBox="0 0 20 14">
          <path
            d="M10 2.5C13.2 2.5 16.1 3.8 18.2 5.9L20 4.1C17.4 1.5 13.9 0 10 0 6.1 0 2.6 1.5 0 4.1L1.8 5.9C3.9 3.8 6.8 2.5 10 2.5Z"
            fill={C.text}
          />
          <path
            d="M10 7C12 7 13.8 7.8 15.2 9.1L17 7.3C15.1 5.5 12.7 4.5 10 4.5 7.3 4.5 4.9 5.5 3 7.3L4.8 9.1C6.2 7.8 8 7 10 7Z"
            fill={C.text}
          />
          <circle cx="10" cy="12" r="2" fill={C.text} />
        </svg>
        <div
          style={{
            width: 24,
            height: 11,
            border: `1.5px solid ${C.text}`,
            borderRadius: 3,
            padding: '1px 1.5px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '78%', height: '100%', background: C.text, borderRadius: 1.5 }} />
        </div>
      </div>
    </div>
  );
}

export function PulsingDot({ color = C.green, size = 8 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: color }} />
      <div
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: '50%',
          background: color,
          opacity: 0.3,
          animation: 'pulseRing 1.6s ease infinite',
        }}
      />
    </div>
  );
}

export function Chip({ icon, label, onTap, small = false, active = false, color = C.green }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: active ? color : C.surface,
        color: active ? 'white' : C.text,
        border: `1px solid ${active ? color : C.border}`,
        borderRadius: 18,
        padding: small ? '5px 11px' : '7px 13px',
        fontSize: small ? 12 : 13,
        fontWeight: 500,
        cursor: onTap ? 'pointer' : 'default',
        fontFamily: SANS,
        userSelect: 'none',
        transition: 'all .15s',
      }}
    >
      {icon && <Icon name={icon} size={small ? 12 : 14} color={active ? 'white' : C.textMid} strokeWidth={1.7} />}
      <span>{label}</span>
    </button>
  );
}

export function RadarChart({ data, size = 240 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.3;
  const n = data.length;
  const angle = (i) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const point = (i, frac) => ({
    x: cx + Math.cos(angle(i)) * r * frac,
    y: cy + Math.sin(angle(i)) * r * frac,
  });
  const labelPoint = (i) => ({
    x: cx + Math.cos(angle(i)) * (r + 22),
    y: cy + Math.sin(angle(i)) * (r + 22),
  });
  const valuePath =
    data
      .map((d, i) => {
        const p = point(i, d.value / 100);
        return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(' ') + 'Z';
  const grids = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
    >
      {grids.map((g, gi) => {
        const path =
          data
            .map((_, i) => {
              const p = point(i, g);
              return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            })
            .join(' ') + 'Z';
        return <path key={gi} d={path} fill="none" stroke={C.border} strokeWidth={1} />;
      })}
      {data.map((_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth={1} />;
      })}
      <path
        d={valuePath}
        fill={`${C.green}33`}
        stroke={C.green}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const p = point(i, d.value / 100);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={C.green}
            stroke={C.surface}
            strokeWidth={2}
          />
        );
      })}
      {data.map((d, i) => {
        const lp = labelPoint(i);
        const ang = angle(i);
        const anchor = Math.cos(ang) < -0.3 ? 'end' : Math.cos(ang) > 0.3 ? 'start' : 'middle';
        return (
          <g key={i}>
            <text
              x={lp.x}
              y={lp.y - 4}
              textAnchor={anchor}
              fontFamily={SANS}
              fontSize="11"
              fontWeight="600"
              fill={C.text}
            >
              {d.label}
            </text>
            <text
              x={lp.x}
              y={lp.y + 9}
              textAnchor={anchor}
              fontFamily={SANS}
              fontSize="10"
              fill={C.textLight}
            >
              {d.value}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Sheet({ open, onClose, children, height: _height = 'auto' }) {
  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 300,
        background: open ? 'rgba(14,26,19,.4)' : 'transparent',
        transition: 'background .3s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pointerEvents: open ? 'all' : 'none',
      }}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: '24px 24px 0 0',
          padding: '14px 20px 36px',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform .35s cubic-bezier(.32,.72,0,1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,.12)',
          maxHeight: '80%',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: C.border,
            borderRadius: 2,
            margin: '0 auto 18px',
          }}
        />
        {children}
      </div>
    </div>
  );
}

export const NAV = [
  { id: 'track', label: 'Track', icon: 'grid' },
  { id: 'create', label: 'Create', icon: 'plus' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

export function BottomNav({ active, onChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,.96)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 0 26px',
        zIndex: 100,
      }}
    >
      {NAV.map((t) => {
        const a = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              color: a ? C.green : C.textLight,
              transition: 'color .2s',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon name={t.icon} size={22} color={a ? C.green : C.textLight} strokeWidth={a ? 2 : 1.7} />
            </div>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: a ? 700 : 500,
                fontFamily: SANS,
                letterSpacing: '0.01em',
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
