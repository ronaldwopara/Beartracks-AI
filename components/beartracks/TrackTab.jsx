'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';
import { PulsingDot } from './ui';

function Stat({ label, value, icon, highlight }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
        <Icon name={icon} size={11} color={highlight ? C.green : C.textLight} />
        <span style={{ fontFamily: SANS, fontSize: 10, color: C.textLight, fontWeight: 500 }}>{label}</span>
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 18,
          fontWeight: 600,
          color: highlight ? C.green : C.text,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ScanningCard({ progress, stage, stageNames, stageDetails }) {
  const isFound = stage === 3;
  return (
    <div
      style={{
        background: C.surface,
        borderRadius: 18,
        border: `1.5px solid ${isFound ? C.green : C.border}`,
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isFound ? `0 4px 20px ${C.green}22` : '0 1px 3px rgba(0,0,0,.04)',
        transition: 'border-color .4s, box-shadow .4s',
      }}
    >
      {!isFound && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg,transparent,${C.green}66,transparent)`,
              animation: 'scanLine 2s linear infinite',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12, position: 'relative' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: C.greenSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="sparkles" size={18} color={C.green} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 700,
                color: C.green,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              Agent
            </span>
            <span style={{ fontFamily: SANS, fontSize: 10, color: C.textLight }}>· just now</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.text }}>Quiet study room</div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: isFound ? C.green : C.textMid,
              marginTop: 3,
              fontWeight: isFound ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {!isFound && <PulsingDot size={5} />}
            {isFound ? '✓ ' : ''}
            {stageDetails[stage]}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {stageNames.map((n, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: i <= stage ? C.green : C.border,
                transition: 'background .3s',
              }}
            />
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9.5,
                color: i === stage ? C.green : C.textLight,
                fontWeight: i === stage ? 700 : 500,
                letterSpacing: '.02em',
              }}
            >
              {n}
            </div>
          </div>
        ))}
      </div>

      {!isFound && (
        <div style={{ display: 'flex', gap: 14, padding: '10px 12px', background: C.bg, borderRadius: 10 }}>
          <Stat label="Scanned" value={Math.round(progress * 8.4)} icon="eye" />
          <Stat label="Filtered" value={stage >= 1 ? Math.round(progress * 1.7) : 0} icon="sliders" />
          <Stat label="Matches" value={stage >= 2 ? Math.max(0, Math.round((progress - 66) / 12)) : 0} icon="target" highlight />
        </div>
      )}

      {isFound && (
        <div style={{ padding: '12px 14px', background: C.greenSoft, borderRadius: 12, border: `1px solid ${C.green}33` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.text }}>CAB 2-690</div>
            <div
              style={{
                padding: '2px 8px',
                borderRadius: 9,
                background: C.green,
                fontFamily: SANS,
                fontSize: 9,
                fontWeight: 700,
                color: 'white',
                letterSpacing: '.04em',
              }}
            >
              OPEN
            </div>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textMid }}>
            Tomorrow · 1:00–5:00 PM · Whiteboard ✓
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneCard() {
  const subs = [
    { l: 'Identify 3 advisors', done: true },
    { l: 'Email Dr. Lin', done: true },
    { l: 'Submit 2 grant apps', done: false },
    { l: 'Lock summer position', done: false },
  ];
  const completed = subs.filter((s) => s.done).length;
  return (
    <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: '#7a4ec618',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="flag" size={18} color="#7a4ec6" strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 700,
                color: '#7a4ec6',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              Milestone
            </span>
            <span style={{ fontFamily: SANS, fontSize: 10, color: C.textLight }}>· 14 days left</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.text }}>Summer research position</div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, marginTop: 3 }}>
            {completed}/{subs.length} steps complete
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {subs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                border: `1.5px solid ${s.done ? '#7a4ec6' : C.border}`,
                background: s.done ? '#7a4ec6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {s.done && <Icon name="check" size={11} color="white" strokeWidth={3} />}
            </div>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: s.done ? C.textLight : C.text,
                textDecoration: s.done ? 'line-through' : 'none',
              }}
            >
              {s.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpportunityCard() {
  const days = 4;
  const hrs = 12;
  return (
    <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: C.goldLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="star" size={18} color={C.gold} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 700,
                color: '#9a7400',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              Opportunity
            </span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.text }}>BIOL 207 add/drop deadline</div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, marginTop: 3 }}>Friday · 4:30 PM</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              fontWeight: 600,
              color: C.gold,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {days}d
          </div>
          <div style={{ fontFamily: SANS, fontSize: 10, color: C.textLight, marginTop: 2 }}>{hrs}h left</div>
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
        <button
          type="button"
          style={{
            flex: 1,
            padding: '9px',
            background: C.gold,
            border: 'none',
            borderRadius: 10,
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 700,
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Draft email to advisor
        </button>
        <button
          type="button"
          style={{
            padding: '9px 12px',
            background: 'transparent',
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 600,
            color: C.textMid,
            cursor: 'pointer',
          }}
        >
          Snooze
        </button>
      </div>
    </div>
  );
}

export function TrackTab({ flowState, onNudge }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState(0);
  const nudged = useRef(false);

  const stageNames = ['Scanning', 'Filtering', 'Matching', 'Match found'];
  const stageDetails = ['Crawling room.ualberta.ca', 'Applying dealbreakers', 'Ranking by bonuses', 'CAB 2-690 available'];

  useEffect(() => {
    if (flowState !== 'track') {
      setScanProgress(0);
      setScanStage(0);
      return;
    }
    let v = 0;
    const iv = setInterval(() => {
      v += Math.random() * 5 + 2;
      if (v >= 100) {
        v = 100;
        clearInterval(iv);
        setScanStage(3);
        if (!nudged.current) {
          nudged.current = true;
          setTimeout(() => onNudge && onNudge(), 900);
        }
      } else if (v >= 66) setScanStage(2);
      else if (v >= 33) setScanStage(1);
      setScanProgress(Math.min(v, 100));
    }, 350);
    return () => clearInterval(iv);
  }, [flowState, onNudge]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <div style={{ padding: '14px 20px 12px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>
            Track
          </div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 1 }}>
            {flowState === 'track' ? '3 active · 1 scanning' : '2 active'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 16px 100px' }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 700,
            color: C.textMid,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            marginBottom: 10,
            padding: '0 4px',
          }}
        >
          Active
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {flowState === 'track' && (
            <ScanningCard progress={scanProgress} stage={scanStage} stageNames={stageNames} stageDetails={stageDetails} />
          )}
          <MilestoneCard />
          <OpportunityCard />
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 700,
            color: C.textMid,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            marginBottom: 10,
            padding: '0 4px',
          }}
        >
          Missed
        </div>
        <div style={{ background: C.surface, borderRadius: 16, border: `1px dashed ${C.border}`, padding: '14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: '#fdf6e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="clock" size={16} color={C.gold} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>ALES Undergraduate Award</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>94% match · Closed Jan 15</div>
            </div>
          </div>
          <div
            style={{
              padding: '9px 12px',
              background: C.greenSoft,
              borderRadius: 10,
              fontFamily: SANS,
              fontSize: 12,
              color: C.green,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon name="sparkles" size={13} color={C.green} />
            <span>
              Similar: <strong>FGSR Travel Award</strong> opens Jun 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
