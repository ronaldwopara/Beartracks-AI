'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';
import { Chip, PulsingDot, Sheet } from './ui';
import { WhatIfPanel } from './WhatIfPanel';

const CLASSES = [
  { id: 'agent', name: 'Agent', sub: 'Background search that runs continuously', icon: 'sparkles', color: C.green },
  { id: 'milestone', name: 'Milestone', sub: "Long-term goal you're working toward", icon: 'flag', color: '#7a4ec6' },
  { id: 'opportunity', name: 'Opportunity', sub: 'A specific event, deadline, or application', icon: 'star', color: C.gold },
  { id: 'whatif', name: 'What-If', sub: 'Snap a flyer — find similar events', icon: 'image', color: '#c8693a' },
];

function ChipZone({ title, sub, lockColor, chips, onTap }) {
  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1.5px solid ${lockColor}33`, overflow: 'hidden' }}>
      <div
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Icon name={title === 'Dealbreakers' ? 'lock' : 'star'} size={14} color={lockColor} strokeWidth={2} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: lockColor }}>{title}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>{sub}</div>
        </div>
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexWrap: 'wrap', gap: 7, minHeight: 54 }}>
        {chips.length === 0 ? (
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, fontStyle: 'italic', padding: '4px 0' }}>
            None yet
          </div>
        ) : (
          chips.map((c) => <Chip key={c.id} icon={c.icon} label={c.label} onTap={() => onTap(c)} small />)
        )}
      </div>
    </div>
  );
}

export function CreateTab({ flowState, onDeploy }) {
  const [selectedClass, setSelectedClass] = useState(flowState === 'create' ? 'agent' : null);
  const [draft, setDraft] = useState(flowState === 'create');
  const [db, setDb] = useState(
    flowState === 'create'
      ? [
          { id: 'loc', icon: 'pin', label: 'North Campus', type: 'location' },
          { id: 'date', icon: 'calendar', label: 'Tomorrow', type: 'date' },
          { id: 'noise', icon: 'volume-x', label: 'Quiet zone', type: 'amenity' },
          { id: 'time', icon: 'clock', label: '12:00–5:00 PM', type: 'time' },
        ]
      : [],
  );
  const [bon, setBon] = useState(
    flowState === 'create'
      ? [
          { id: 'wb', icon: 'eye', label: 'Whiteboard', type: 'amenity' },
          { id: 'cof', icon: 'compass', label: 'Coffee < 5 min', type: 'proximity' },
        ]
      : [],
  );
  const [editChip, setEditChip] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [nlInput, setNlInput] = useState('');

  useEffect(() => {
    if (flowState === 'create' && !draft) {
      setSelectedClass('agent');
      setDraft(true);
    }
  }, [flowState, draft]);

  const startNew = (cls) => {
    setSelectedClass(cls);
    setNlInput('');
    setDb([]);
    setBon([]);
    setDraft(true);
  };

  if (draft && selectedClass === 'whatif') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
        <div
          style={{
            padding: '14px 20px 12px',
            background: C.surface,
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() => setDraft(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMid, padding: 4, display: 'flex' }}
          >
            <span style={{ display: 'flex', transform: 'rotate(180deg)' }}>
              <Icon name="arrow-right" size={20} />
            </span>
          </button>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: C.text, letterSpacing: '-0.01em' }}>
              What-If
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>Find similar events from a flyer</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 100px' }}>
          <WhatIfPanel />
        </div>
      </div>
    );
  }

  const parse = () => {
    if (!nlInput.trim()) return;
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setDb([
        { id: 'loc', icon: 'pin', label: 'North Campus', type: 'location' },
        { id: 'date', icon: 'calendar', label: 'Tomorrow', type: 'date' },
        { id: 'noise', icon: 'volume-x', label: 'Quiet zone', type: 'amenity' },
        { id: 'time', icon: 'clock', label: '12:00–5:00 PM', type: 'time' },
      ]);
      setBon([
        { id: 'wb', icon: 'eye', label: 'Whiteboard', type: 'amenity' },
        { id: 'cof', icon: 'compass', label: 'Coffee < 5 min', type: 'proximity' },
      ]);
    }, 1200);
  };

  const moveChip = (chip, from) => {
    if (from === 'db') {
      setDb((p) => p.filter((c) => c.id !== chip.id));
      setBon((p) => [...p, chip]);
    } else {
      setBon((p) => p.filter((c) => c.id !== chip.id));
      setDb((p) => [...p, chip]);
    }
    setEditChip(null);
  };

  const removeChip = (chip, from) => {
    if (from === 'db') setDb((p) => p.filter((c) => c.id !== chip.id));
    else setBon((p) => p.filter((c) => c.id !== chip.id));
    setEditChip(null);
  };

  const deploy = () => {
    setDeploying(true);
    setTimeout(() => onDeploy(), 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, position: 'relative' }}>
      <div style={{ padding: '14px 20px 12px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>
          Create
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 1 }}>
          Agents · Milestones · Opportunities
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 130 }}>
        {!draft && (
          <div style={{ animation: 'fadeUp .35s ease' }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 700,
                color: C.textMid,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              What are you creating?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CLASSES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => startNew(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '18px 18px',
                    background: C.surface,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 18,
                    cursor: 'pointer',
                    transition: 'all .18s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = c.color;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: `${c.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: c.color,
                    }}
                  >
                    <Icon name={c.icon} size={22} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: C.text }}>{c.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 2 }}>{c.sub}</div>
                  </div>
                  <Icon name="chevron-right" size={18} color={C.textLight} />
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 28,
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 700,
                color: C.textMid,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Recent drafts
            </div>
            <div
              style={{
                padding: '14px 16px',
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: 0.7,
              }}
            >
              <Icon name="flag" size={18} color="#7a4ec6" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>
                  Find Summer Research Position
                </div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>3 parameters · 2d ago</div>
              </div>
              <Icon name="chevron-right" size={16} color={C.textLight} />
            </div>
          </div>
        )}

        {draft && (
          <div style={{ animation: 'fadeUp .3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => setDraft(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMid, padding: 4, display: 'flex' }}
              >
                <span style={{ display: 'flex', transform: 'rotate(180deg)' }}>
                  <Icon name="arrow-right" size={18} />
                </span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                {(() => {
                  const c = CLASSES.find((x) => x.id === selectedClass) || CLASSES[0];
                  return (
                    <>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 9,
                          background: `${c.color}18`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: c.color,
                        }}
                      >
                        <Icon name={c.icon} size={16} strokeWidth={2} />
                      </div>
                      <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: C.text }}>
                        New {c.name}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div
              style={{
                background: C.surface,
                border: `1.5px solid ${C.border}`,
                borderRadius: 16,
                padding: '12px 14px',
                marginBottom: 18,
              }}
            >
              <textarea
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                placeholder="Describe what you want to track in plain English…"
                style={{
                  width: '100%',
                  minHeight: 54,
                  border: 'none',
                  background: 'none',
                  resize: 'none',
                  fontSize: 14,
                  fontFamily: SANS,
                  color: C.text,
                  outline: 'none',
                  lineHeight: 1.5,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: C.textLight,
                    fontSize: 12,
                    fontFamily: SANS,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 0',
                  }}
                >
                  <Icon name="mic" size={14} />
                  Voice
                </button>
                <button
                  type="button"
                  onClick={parse}
                  disabled={!nlInput.trim()}
                  style={{
                    background: nlInput.trim() ? C.green : C.greenSoft,
                    color: nlInput.trim() ? 'white' : C.textLight,
                    border: 'none',
                    borderRadius: 12,
                    padding: '8px 16px',
                    fontFamily: SANS,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: nlInput.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Icon name="wand" size={14} strokeWidth={2} />
                  {parsing ? 'Parsing…' : 'Parse'}
                </button>
              </div>
            </div>

            {parsing && (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.textMid, marginBottom: 14 }}>
                  Reading intent → extracting parameters
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: C.green,
                        animation: `typingDot 1s ease ${i * 0.13}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!parsing && (db.length > 0 || bon.length > 0) && (
              <>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    padding: '10px 12px',
                    background: C.goldLight,
                    borderRadius: 12,
                    border: `1px solid ${C.gold}55`,
                    marginBottom: 16,
                  }}
                >
                  <Icon name="sparkles" size={14} color={C.gold} strokeWidth={2} />
                  <p style={{ margin: 0, fontFamily: SANS, fontSize: 12, color: '#7a5e1c', lineHeight: 1.5 }}>
                    Parsed &quot;quiet&quot; as a Dealbreaker, &quot;whiteboard&quot; as a Bonus. Tap any chip to adjust.
                  </p>
                </div>

                <ChipZone
                  title="Dealbreakers"
                  sub="Must match all"
                  lockColor={C.green}
                  chips={db}
                  onTap={(c) => setEditChip({ ...c, zone: 'db' })}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 4px' }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      color: C.textLight,
                      fontWeight: 700,
                      letterSpacing: '.12em',
                    }}
                  >
                    AND
                  </span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>

                <ChipZone
                  title="Bonuses"
                  sub="Nice-to-haves, ranked higher"
                  lockColor={C.gold}
                  chips={bon}
                  onTap={(c) => setEditChip({ ...c, zone: 'bon' })}
                />
              </>
            )}
          </div>
        )}
      </div>

      {draft && (db.length > 0 || bon.length > 0) && !parsing && (
        <div
          style={{
            position: 'absolute',
            bottom: 74,
            left: 0,
            right: 0,
            padding: '12px 16px',
            background: 'linear-gradient(180deg, rgba(250,251,249,0) 0%, rgba(250,251,249,1) 30%)',
          }}
        >
          <button
            type="button"
            onClick={deploy}
            style={{
              width: '100%',
              background: deploying ? C.greenDeep : C.green,
              color: 'white',
              border: 'none',
              borderRadius: 18,
              padding: '15px',
              fontFamily: SANS,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: `0 4px 18px ${C.green}55`,
              transition: 'all .25s',
              transform: deploying ? 'scale(.98)' : 'scale(1)',
            }}
          >
            {deploying ? (
              <>
                <PulsingDot color="white" size={6} />
                Deploying agent…
              </>
            ) : (
              <>
                Deploy agent <Icon name="arrow-right" size={16} strokeWidth={2.4} />
              </>
            )}
          </button>
        </div>
      )}

      <Sheet open={!!editChip} onClose={() => setEditChip(null)}>
        {editChip && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  background: C.greenSoft,
                  border: `1px solid ${C.green}33`,
                  borderRadius: 18,
                }}
              >
                <Icon name={editChip.icon} size={14} color={C.green} />
                <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>{editChip.label}</span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.textLight }}>
                in {editChip.zone === 'db' ? 'Dealbreakers' : 'Bonuses'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                onClick={() => moveChip(editChip, editChip.zone)}
                style={{
                  padding: '14px 16px',
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Icon name="arrow-up" size={16} color={C.green} />
                <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: C.text, flex: 1, textAlign: 'left' }}>
                  Move to {editChip.zone === 'db' ? 'Bonuses' : 'Dealbreakers'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => removeChip(editChip, editChip.zone)}
                style={{
                  padding: '14px 16px',
                  background: C.errLight,
                  border: `1.5px solid ${C.err}33`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Icon name="trash" size={16} color={C.err} />
                <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: C.err, flex: 1, textAlign: 'left' }}>
                  Remove
                </span>
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
