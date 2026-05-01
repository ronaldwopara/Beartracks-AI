'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';
import { Chip, PulsingDot, Sheet } from './ui';

function Bubble({ m, onConfirm }) {
  if (m.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14, animation: 'fadeUp .3s ease' }}>
        <div
          style={{
            maxWidth: '78%',
            background: C.green,
            color: 'white',
            borderRadius: '20px 20px 6px 20px',
            padding: m.compact ? '8px 14px' : '10px 14px',
            fontSize: 14,
            fontFamily: SANS,
            lineHeight: 1.5,
          }}
        >
          {m.text}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 14, animation: 'fadeUp .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: C.greenDeep,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 11, color: C.gold, fontWeight: 800, fontFamily: SERIF }}>B</span>
        </div>
        <span style={{ fontSize: 11, color: C.textLight, fontFamily: SANS, fontWeight: 500 }}>
          Beartracks · {m.time}
        </span>
      </div>
      <div
        style={{
          maxWidth: '85%',
          background: m.inline ? 'transparent' : C.surface,
          borderRadius: m.inline ? 0 : '4px 18px 18px 18px',
          padding: m.inline ? '2px 0' : '12px 16px',
          border: m.inline ? 'none' : `1px solid ${C.border}`,
          boxShadow: m.inline ? 'none' : '0 1px 3px rgba(0,0,0,.04)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontFamily: SANS,
            color: m.inline ? C.textMid : C.text,
            lineHeight: 1.55,
            fontStyle: m.inline ? 'italic' : 'normal',
          }}
        >
          {m.inline && <span style={{ color: C.gold, marginRight: 6, fontStyle: 'normal' }}>◆</span>}
          {m.text}
        </p>

        {m.scanning && (
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: C.greenSoft,
              borderRadius: 10,
            }}
          >
            <PulsingDot size={6} />
            <span style={{ fontSize: 12, fontFamily: SANS, color: C.green, fontWeight: 600 }}>
              Scanning room.ualberta.ca
            </span>
          </div>
        )}

        {m.rich?.type === 'roomCard' && (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              background: C.greenSoft,
              borderRadius: 14,
              border: `1px solid ${C.green}33`,
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
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: C.text }}>{m.rich.room}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, marginTop: 2 }}>
                  Cameron Library · 2nd floor
                </div>
              </div>
              <div
                style={{
                  padding: '3px 9px',
                  borderRadius: 11,
                  background: C.green,
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '.04em',
                }}
              >
                OPEN
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: SANS,
                fontSize: 13,
                color: C.text,
                marginBottom: 10,
              }}
            >
              <Icon name="clock" size={14} color={C.green} />
              {m.rich.time}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {m.rich.amenities.map((a) => (
                <div
                  key={a}
                  style={{
                    padding: '4px 10px',
                    background: 'white',
                    borderRadius: 11,
                    fontFamily: SANS,
                    fontSize: 11,
                    color: C.textMid,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
            <button
              type="button"
              style={{
                width: '100%',
                background: C.green,
                color: 'white',
                border: 'none',
                borderRadius: 14,
                padding: '12px',
                fontFamily: SANS,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Icon name="check" size={16} strokeWidth={2.4} />
              Reserve room
            </button>
          </div>
        )}

        {m.confirmBtn && (
          <button
            type="button"
            onClick={onConfirm}
            style={{
              marginTop: 14,
              background: C.green,
              color: 'white',
              border: 'none',
              borderRadius: 18,
              padding: '12px 22px',
              fontFamily: SANS,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: `0 3px 12px ${C.green}33`,
            }}
          >
            Review parameters <Icon name="arrow-right" size={14} strokeWidth={2.4} />
          </button>
        )}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: C.greenDeep,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: C.gold, fontWeight: 800, fontFamily: SERIF }}>B</span>
      </div>
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '4px 18px 18px 18px',
          padding: '12px 16px',
          display: 'flex',
          gap: 5,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: C.textLight,
              animation: `typingDot 1.2s ease ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AskTab({ flowState, onAdvance }) {
  const [msgs, setMsgs] = useState([
    { role: 'agent', text: 'Morning, Alex. What do you need?', time: '9:41' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [step, setStep] = useState(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    if (flowState === 'nudge') {
      setTimeout(() => {
        setMsgs((p) => [
          ...p,
          {
            role: 'agent',
            time: 'now',
            text: "Got it. CAB 2-690 just opened up tomorrow 1–5 PM. Whiteboard's there. Remedy Café is 180m away.",
            rich: {
              type: 'roomCard',
              room: 'CAB 2-690',
              time: 'Tue · 1:00–5:00 PM',
              amenities: ['Quiet zone', 'Whiteboard', 'Window seat'],
            },
          },
          {
            role: 'agent',
            time: 'now',
            text: "I'm tagging this room as a North Campus preference for next time. Sound right?",
            inline: true,
          },
        ]);
      }, 200);
    }
  }, [flowState]);

  const reply = (m, delay = 900) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((p) => [...p, { role: 'agent', time: 'now', ...m }]);
    }, delay);
  };

  const send = (override) => {
    const text = override || input.trim();
    if (!text) return;
    setMsgs((p) => [...p, { role: 'user', text, time: 'now' }]);
    setInput('');
    if (step === 0) {
      setStep(1);
      reply({ text: 'On it — North Campus, tomorrow afternoon. Two quick things first.' }, 950);
      setTimeout(() => setSheet('duration'), 1900);
    }
  };

  const onDuration = (v) => {
    setSheet(null);
    setMsgs((p) => [...p, { role: 'user', text: v, time: 'now', compact: true }]);
    setStep(2);
    reply({ text: `${v}, noted. Solo room, or quiet shared space?` }, 850);
    setTimeout(() => setSheet('roomtype'), 1800);
  };

  const onRoomType = (v) => {
    setSheet(null);
    setMsgs((p) => [...p, { role: 'user', text: v, time: 'now', compact: true }]);
    setStep(3);
    reply({ text: "Solid. I'll deploy the agent — confirm to start tracking.", confirmBtn: true }, 900);
  };

  const confirm = () => {
    setMsgs((p) => [
      ...p,
      { role: 'agent', text: 'Agent live. Scanning room.ualberta.ca + UAIMS now.', time: 'now', scanning: true },
    ]);
    setTimeout(() => onAdvance(), 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, position: 'relative' }}>
      <div
        style={{
          padding: '14px 20px 12px',
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              fontWeight: 500,
              color: C.text,
              letterSpacing: '-0.01em',
            }}
          >
            Ask
          </div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 1 }}>
            {flowState === 'nudge' ? '1 match found' : 'Beartracks · UAlberta'}
          </div>
        </div>
        {(flowState === 'track' || flowState === 'nudge') && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: C.greenLight,
              padding: '5px 10px',
              borderRadius: 11,
            }}
          >
            <PulsingDot size={6} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.green, fontFamily: SANS }}>1 LIVE</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 130px' }}>
        {msgs.map((m, i) => (
          <Bubble key={i} m={m} onConfirm={confirm} />
        ))}
        {typing && <Typing />}
        <div ref={endRef} />
      </div>

      {step === 0 && msgs.length === 1 && !typing && (
        <div style={{ padding: '4px 16px 0', marginTop: -8, marginBottom: 18, animation: 'fadeUp .35s ease' }}>
          <div
            style={{
              background: C.surface,
              border: `1.5px solid ${input.trim() ? C.green : C.border}`,
              borderRadius: 18,
              padding: '4px 6px 4px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'border-color .2s',
              marginLeft: 30,
              boxShadow: input.trim() ? `0 4px 16px ${C.green}22` : 'none',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a request…"
              style={{
                flex: 1,
                border: 'none',
                background: 'none',
                padding: '10px 0',
                fontSize: 14,
                fontFamily: SANS,
                color: C.text,
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => send()}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: input.trim() ? C.green : C.greenSoft,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background .2s',
              }}
            >
              <Icon name="arrow-up" size={15} color={input.trim() ? 'white' : C.textLight} strokeWidth={2.4} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 12, marginLeft: 30 }}>
            {[
              { label: 'Find a quiet study room', icon: 'book' },
              { label: 'My schedule today', icon: 'calendar' },
              { label: 'Research grants', icon: 'sparkles' },
            ].map((q) => (
              <Chip key={q.label} icon={q.icon} label={q.label} onTap={() => send(q.label)} small />
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background:
            'linear-gradient(180deg, rgba(250,251,249,0) 0%, rgba(250,251,249,.95) 25%, rgba(250,251,249,1) 100%)',
          padding: '14px 14px 22px',
        }}
      >
        <div
          style={{
            background: C.surface,
            border: `1.5px solid ${input.trim() ? C.green : C.border}`,
            borderRadius: 24,
            padding: '4px 6px 4px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'border-color .2s',
            boxShadow: input.trim() ? `0 4px 16px ${C.green}22` : '0 1px 4px rgba(0,0,0,.04)',
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Message Beartracks…"
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              padding: '13px 0',
              fontSize: 15,
              fontFamily: SANS,
              color: C.text,
              outline: 'none',
            }}
          />
          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', color: C.textLight }}
          >
            <Icon name="mic" size={20} />
          </button>
          <button
            type="button"
            onClick={() => send()}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: input.trim() ? C.green : C.greenSoft,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background .2s',
            }}
          >
            <Icon name="arrow-up" size={18} color={input.trim() ? 'white' : C.textLight} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <Sheet open={sheet === 'duration'} onClose={() => setSheet(null)}>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 4 }}>
          How long do you need it?
        </div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.textLight, marginBottom: 20 }}>
          I&apos;ll narrow availability windows.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { l: '1–2 hours', s: 'Quick session', ic: 'clock' },
            { l: '2–4 hours', s: 'Afternoon block', ic: 'clock' },
            { l: '4+ hours', s: 'All day', ic: 'clock' },
            { l: 'Flexible', s: 'Show all options', ic: 'sliders' },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              onClick={() => onDuration(o.l)}
              className="hover-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                background: C.bg,
                border: `1.5px solid ${C.border}`,
                borderRadius: 14,
                cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.green;
                e.currentTarget.style.background = C.greenSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.bg;
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: C.surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: C.green,
                }}
              >
                <Icon name={o.ic} size={18} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.text }}>{o.l}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight }}>{o.s}</div>
              </div>
              <Icon name="chevron-right" size={16} color={C.textLight} />
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === 'roomtype'} onClose={() => setSheet(null)}>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: C.text, marginBottom: 4 }}>
          Room type?
        </div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.textLight, marginBottom: 20 }}>
          Setting this as a Dealbreaker.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { l: 'Solo only', s: 'Private', ic: 'user' },
            { l: 'Quiet shared', s: 'Low traffic', ic: 'volume-x' },
            { l: 'Either', s: 'Show all', ic: 'users' },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              onClick={() => onRoomType(o.l)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '18px 8px',
                background: C.bg,
                border: `1.5px solid ${C.border}`,
                borderRadius: 16,
                cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.green;
                e.currentTarget.style.background = C.greenSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.bg;
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: C.surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: C.green,
                }}
              >
                <Icon name={o.ic} size={20} />
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text, textAlign: 'center' }}>
                {o.l}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>{o.s}</div>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
