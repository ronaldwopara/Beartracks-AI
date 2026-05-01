'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';

export function WhatIfPanel() {
  const [stage, setStage] = useState('intro');
  const [matches, setMatches] = useState([]);

  const handleUpload = () => {
    setStage('analyzing');
    setTimeout(() => {
      setMatches([
        {
          title: 'CCIS Career Fair',
          org: 'Faculty of Science',
          date: 'Apr 22 · 10–3 PM',
          similarity: 96,
          tags: ['Career', 'STEM', 'On-campus'],
        },
        {
          title: 'Engineering Co-op Meet',
          org: 'EAS',
          date: 'Apr 25 · 4–7 PM',
          similarity: 88,
          tags: ['Career', 'Co-op', 'Networking'],
        },
        {
          title: 'Bio Research Showcase',
          org: 'Biology Department',
          date: 'May 3 · 12–4 PM',
          similarity: 81,
          tags: ['Research', 'STEM', 'Posters'],
        },
      ]);
      setStage('matches');
    }, 1600);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Icon name="image" size={16} color={C.green} />
        <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: C.text }}>What-If</div>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 13, color: C.textLight, marginBottom: 18 }}>
        Snap a flyer of an event you missed — I&apos;ll surface similar ones coming up.
      </div>

      {stage === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            onClick={handleUpload}
            style={{
              padding: '24px 18px',
              background: C.greenSoft,
              border: `2px dashed ${C.green}55`,
              borderRadius: 18,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: C.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.green,
              }}
            >
              <Icon name="camera" size={22} />
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.text }}>Snap a flyer</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, textAlign: 'center' }}>
              I&apos;ll pull dates, themes, and tags
            </div>
          </button>
          <button
            type="button"
            onClick={handleUpload}
            style={{
              padding: '14px 16px',
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon name="link" size={16} color={C.textMid} />
            <span style={{ fontFamily: SANS, fontSize: 14, color: C.text, flex: 1, textAlign: 'left' }}>
              Paste an event URL
            </span>
            <Icon name="chevron-right" size={14} color={C.textLight} />
          </button>
          <button
            type="button"
            onClick={handleUpload}
            style={{
              padding: '14px 16px',
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon name="chat" size={16} color={C.textMid} />
            <span style={{ fontFamily: SANS, fontSize: 14, color: C.text, flex: 1, textAlign: 'left' }}>
              Describe it instead
            </span>
            <Icon name="chevron-right" size={14} color={C.textLight} />
          </button>
        </div>
      )}

      {stage === 'analyzing' && (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 18px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${C.greenSoft}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${C.green}`,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                animation: 'pulseRing 1s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.green,
              }}
            >
              <Icon name="image" size={22} />
            </div>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.text }}>Reading your flyer…</div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 6 }}>
            Extracting themes · matching events
          </div>
        </div>
      )}

      {stage === 'matches' && (
        <div>
          <div
            style={{
              padding: '10px 12px',
              background: C.greenSoft,
              borderRadius: 12,
              border: `1px solid ${C.green}33`,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon name="sparkles" size={14} color={C.green} />
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.green, fontWeight: 600 }}>
              Found 3 similar events on the way
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {matches.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  animation: `fadeUp .35s ease ${i * 0.08}s both`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: C.text }}>{m.title}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight }}>
                      {m.org} · {m.date}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 9px',
                      borderRadius: 11,
                      background: C.greenSoft,
                    }}
                  >
                    <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.green }}>
                      {m.similarity}%
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  {m.tags.map((t) => (
                    <div
                      key={t}
                      style={{
                        padding: '3px 8px',
                        background: C.bg,
                        borderRadius: 9,
                        fontFamily: SANS,
                        fontSize: 10,
                        color: C.textMid,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: C.green,
                      border: 'none',
                      borderRadius: 9,
                      fontFamily: SANS,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    Add to Track
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '8px 12px',
                      background: 'transparent',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      fontFamily: SANS,
                      fontSize: 12,
                      fontWeight: 500,
                      color: C.textMid,
                      cursor: 'pointer',
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
