'use client';

import { useRef, useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';

function ProfileSection({ title, sub, icon, color, items }) {
  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 14, overflow: 'hidden' }}>
      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Icon name={icon} size={16} color={color} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text }}>{title}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>{sub}</div>
        </div>
        <button
          type="button"
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 9,
            padding: '4px 10px',
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 600,
            color: C.textMid,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Icon name="plus" size={11} />
          Add
        </button>
      </div>
      <div style={{ padding: '4px 0' }}>
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            style={{
              width: '100%',
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'none',
              border: 'none',
              borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Icon name={it.icon} size={15} color={C.textLight} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>{it.label}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>{it.meta}</div>
            </div>
            <Icon name="chevron-right" size={14} color={C.textLight} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProfileTab() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const fileRef = useRef(null);

  const onFile = (e) => {
    const f = e.target.files[0];
    if (f) setPhotoUrl(URL.createObjectURL(f));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <div style={{ padding: '14px 20px 12px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>
          Profile
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 1 }}>
          University of Alberta · 2025–26
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 100px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 22,
            overflow: 'hidden',
            height: 200,
            background: 'linear-gradient(135deg,#0e3a26 0%,#1c5d3e 50%,#3d8a4f 100%)',
            boxShadow: '0 8px 36px rgba(28,93,62,.32)',
            marginBottom: 24,
          }}
        >
          <svg
            style={{ position: 'absolute', right: 0, top: 0, height: '100%', opacity: 0.18 }}
            viewBox="0 0 220 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <circle cx="155" cy="100" r="130" fill="none" stroke={C.gold} strokeWidth="1.5" />
            <circle cx="155" cy="100" r="90" fill="none" stroke={C.gold} strokeWidth="1.5" />
            <circle cx="155" cy="100" r="50" fill="none" stroke={C.gold} strokeWidth="1.5" />
            <polygon points="155,15 220,75 195,170 95,170 75,75" fill="none" stroke={C.gold} strokeWidth="1.5" />
            <polygon points="155,50 195,90 175,150 125,150 105,90" fill="none" stroke={C.gold} strokeWidth="1.5" />
          </svg>
          <div
            style={{
              position: 'absolute',
              right: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: SERIF,
              fontSize: 118,
              fontWeight: 700,
              color: C.gold,
              opacity: 0.28,
              lineHeight: 1,
              userSelect: 'none',
              letterSpacing: '-0.04em',
            }}
          >
            A
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 18,
              background: C.gold,
              borderRadius: 18,
              padding: '4px 12px',
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 700,
              color: '#1f1a08',
              letterSpacing: '.02em',
            }}
          >
            one card
          </div>
          <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}>
            <button
              type="button"
              onClick={() => fileRef.current && fileRef.current.click()}
              style={{
                width: 80,
                height: 100,
                borderRadius: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 0,
                background: photoUrl ? 'transparent' : 'rgba(255,255,255,.12)',
                border: photoUrl ? '2px solid rgba(255,255,255,.4)' : '2px dashed rgba(255,255,255,.55)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Icon name="camera" size={20} color="rgba(255,255,255,.85)" />
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 9,
                      color: 'rgba(255,255,255,.7)',
                      textAlign: 'center',
                      padding: '0 4px',
                      lineHeight: 1.3,
                    }}
                  >
                    Add photo
                  </span>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          </div>
          <div style={{ position: 'absolute', left: 118, bottom: 16, right: 88 }}>
            <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: 'white', letterSpacing: '-0.01em' }}>
              Alex Okonkwo
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(255,255,255,.82)', marginTop: 3 }}>
              BSc Biology · Year 2
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(255,255,255,.65)', marginTop: 1 }}>ID: 1623847</div>
          </div>
          <div style={{ position: 'absolute', left: 118, top: 18, display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z"
                stroke="white"
                strokeWidth="1.5"
                fill="rgba(255,255,255,.1)"
              />
              <text x="12" y="15" textAnchor="middle" fontFamily={SERIF} fontSize="9" fontWeight="700" fill={C.gold}>
                U
              </text>
            </svg>
            <div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 7.5,
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '.08em',
                  lineHeight: 1.3,
                }}
              >
                UNIVERSITY
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 7.5,
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '.08em',
                  lineHeight: 1.3,
                }}
              >
                OF ALBERTA
              </div>
            </div>
          </div>
        </div>

        <ProfileSection
          title="Stashes"
          sub="Your private knowledge base"
          icon="book"
          color={C.green}
          items={[
            { label: 'BIOL 207 Syllabus', meta: 'PDF · 1.4 MB', icon: 'book' },
            { label: 'uab.ca/scholarships', meta: 'Bookmarked Apr 12', icon: 'link' },
            { label: 'Co-op handbook', meta: 'PDF · 2.1 MB', icon: 'briefcase' },
          ]}
        />

        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 14, overflow: 'hidden' }}>
          <div
            style={{
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <Icon name="sparkles" size={16} color={C.green} />
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>What I&apos;ve learned</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>7 facts</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            {['Prefers morning classes', 'Strongest in BIOL 207 (87%)', 'Studies on North Campus', 'Drinks coffee mid-afternoon'].map(
              (f, i, arr) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, flexShrink: 0 }} />
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.text, flex: 1 }}>{f}</span>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textLight, padding: 4 }}>
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ),
            )}
          </div>
        </div>

        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 8 }}>
          {[
            { l: 'Notifications', ic: 'bell' },
            { l: 'Data & Privacy', ic: 'shield' },
            { l: 'Connected integrations', ic: 'link' },
            { l: 'Export my data', ic: 'arrow-down' },
            { l: 'Delete profile data', ic: 'trash', danger: true },
          ].map((it, i, arr) => (
            <button
              key={i}
              type="button"
              style={{
                width: '100%',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'none',
                border: 'none',
                borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Icon name={it.ic} size={17} color={it.danger ? C.err : C.textMid} />
              <span style={{ fontFamily: SANS, fontSize: 14, color: it.danger ? C.err : C.text, flex: 1, fontWeight: 500 }}>{it.l}</span>
              <Icon name="chevron-right" size={15} color={C.textLight} />
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '14px 0 8px', fontFamily: SANS, fontSize: 11, color: C.textLight }}>
          Beartracks · v0.1.0 · UAlberta
        </div>
      </div>
    </div>
  );
}
