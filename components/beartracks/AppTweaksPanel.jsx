'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';

const TWEAK_DEFAULTS = {
  accentColor: '#1c5d3e',
  fontDisplay: 'Georgia',
  showRadar: false,
  chipRadius: 18,
};

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, flex: 1 }}>{label}</span>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 38,
        height: 22,
        borderRadius: 11,
        border: 'none',
        background: on ? C.green : C.border,
        position: 'relative',
        cursor: 'pointer',
        transition: 'background .2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 18 : 2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'white',
          transition: 'left .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,.15)',
        }}
      />
    </button>
  );
}

export function AppTweaksPanel({ open, onClose }) {
  const [t, setT] = useState(TWEAK_DEFAULTS);
  const set = (k, v) => {
    setT((p) => ({ ...p, [k]: v }));
    if (typeof window !== 'undefined') {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 18,
        zIndex: 9999,
        width: 240,
        background: 'white',
        borderRadius: 18,
        boxShadow: '0 12px 48px rgba(0,0,0,.24)',
        border: `1px solid ${C.border}`,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(.95)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'all .28s cubic-bezier(.34,1.56,.64,1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: C.text }}>Tweaks</span>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textLight, padding: 2, display: 'flex' }}
        >
          <Icon name="x" size={16} />
        </button>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <Row label="Accent">
          <input
            type="color"
            value={t.accentColor}
            onChange={(e) => set('accentColor', e.target.value)}
            style={{ width: 32, height: 24, border: 'none', borderRadius: 5, padding: 0, cursor: 'pointer' }}
          />
        </Row>
        <Row label="Display font">
          <select
            value={t.fontDisplay}
            onChange={(e) => set('fontDisplay', e.target.value)}
            style={{
              fontSize: 11,
              fontFamily: SANS,
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              padding: '3px 6px',
              background: C.bg,
              color: C.text,
            }}
          >
            <option>Fraunces</option>
            <option>Georgia</option>
            <option>Inter</option>
          </select>
        </Row>
        <Row label={`Chip radius ${t.chipRadius}px`}>
          <input
            type="range"
            min="0"
            max="24"
            step="2"
            value={t.chipRadius}
            onChange={(e) => set('chipRadius', +e.target.value)}
            style={{ width: 90 }}
          />
        </Row>
        <Row label="Engagement radar">
          <Toggle on={t.showRadar} onChange={() => set('showRadar', !t.showRadar)} />
        </Row>
      </div>
    </div>
  );
}
