'use client';

import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';
import { Sheet } from './ui';

const DEFAULT_MILESTONES = [
  {
    id: 'm-default',
    title: 'Summer research position',
    metricCurrent: 'Applications: 7 · Emails: 4 · Replies: 2',
    nextGoal: 'Send 5 more applications by Friday',
    date: 'This week',
  },
];

const DEFAULT_OPPORTUNITIES = [
  {
    id: 'o-default',
    title: 'BIOL 207 add/drop deadline',
    deadline: 'Friday · 4:30 PM',
    action: 'Email advisor for override options',
    summary: 'Need approval path and quick follow-up.',
  },
];

function toDateString(input, fallback = 'TBD') {
  if (!input) return fallback;
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  return parsed.toLocaleDateString();
}

function toIcsDateStamp(dateText, timeText = '120000') {
  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) return null;
  const y = parsed.getUTCFullYear();
  const m = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const d = String(parsed.getUTCDate()).padStart(2, '0');
  const cleanTime = timeText.replace(/[^0-9]/g, '').padEnd(6, '0').slice(0, 6);
  return `${y}${m}${d}T${cleanTime}Z`;
}

function buildIcs(events) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Beartracks AI//EN'];
  events.forEach((event) => {
    const start = toIcsDateStamp(event.date, event.time);
    if (!start) return;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id || `beartracks-${Date.now()}`}`);
    lines.push(`DTSTAMP:${start}`);
    lines.push(`DTSTART:${start}`);
    lines.push(`SUMMARY:${event.title || 'Beartracks event'}`);
    lines.push(`LOCATION:${event.location || 'UAlberta'}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\n');
}

function parseIcs(content) {
  const blocks = content.split('BEGIN:VEVENT').slice(1);
  return blocks
    .map((block, index) => {
      const lines = block.split('\n');
      const summary = lines.find((line) => line.startsWith('SUMMARY:'))?.replace('SUMMARY:', '').trim();
      const location = lines.find((line) => line.startsWith('LOCATION:'))?.replace('LOCATION:', '').trim();
      const rawDate = lines.find((line) => line.startsWith('DTSTART:'))?.replace('DTSTART:', '').trim();
      if (!summary || !rawDate) return null;
      const y = rawDate.slice(0, 4);
      const m = rawDate.slice(4, 6);
      const d = rawDate.slice(6, 8);
      return {
        id: `ics-${Date.now()}-${index}`,
        title: summary,
        date: `${y}-${m}-${d}`,
        time: '1200',
        location: location || 'Imported',
        source: 'ICS import',
      };
    })
    .filter(Boolean);
}

async function callJson(endpoint, body) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Request failed');
  return response.json();
}

export function TrackTab({
  studentProfile,
  milestones,
  opportunities,
  events,
  calendarEvents,
  missedItems,
  onImportIcsEvents,
  onSignalNudge,
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [emailDraftResult, setEmailDraftResult] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const milestoneCards = milestones?.length ? milestones : DEFAULT_MILESTONES;
  const opportunityCards = opportunities?.length ? opportunities : DEFAULT_OPPORTUNITIES;
  const eventCards = events || [];
  const missedCards = missedItems || [];
  const calendarItems = calendarEvents || [];

  const sortedCalendar = useMemo(() => {
    return [...calendarItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [calendarItems]);

  const exportIcs = () => {
    if (!calendarItems.length) return;
    const content = buildIcs(calendarItems);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'beartracks-events.ics';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onImportIcs = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseIcs(text);
    if (parsed.length && onImportIcsEvents) onImportIcsEvents(parsed);
  };

  const draftEmail = async (opportunity) => {
    setBusy(true);
    try {
      const result = await callJson('/api/agent/email/draft', {
        title: opportunity.title,
        context: opportunity.summary || opportunity.action || '',
      });
      setEmailDraftResult(`${result.subject}: ${result.preview}`);
    } catch (_err) {
      setEmailDraftResult('Unable to draft email right now.');
    } finally {
      setBusy(false);
    }
  };

  const sendEmail = async (opportunity) => {
    const approved = window.confirm(`Send this email action now for "${opportunity.title}"?`);
    if (!approved) return;
    setBusy(true);
    try {
      await callJson('/api/agent/email/send', {
        title: opportunity.title,
        recipient: 'advisor@ualberta.ca',
      });
      setEmailDraftResult('Email action sent successfully.');
      if (onSignalNudge) onSignalNudge('Email sent');
    } catch (_err) {
      setEmailDraftResult('Could not send email.');
    } finally {
      setBusy(false);
    }
  };

  const runSearch = async (title) => {
    setBusy(true);
    try {
      const result = await callJson('/api/agent/search', { query: title });
      const top = result.results?.[0];
      setSearchResult(top ? `${top.title} (${top.matchPercent}% match)` : 'No similar results right now.');
    } catch (_err) {
      setSearchResult('Search service unavailable.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <div style={{ padding: '14px 20px 12px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>
              Track
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 1 }}>
              {milestoneCards.length + opportunityCards.length + eventCards.length} active ·{' '}
              {studentProfile?.name ? `for ${studentProfile.name}` : 'UAlberta workspace'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              background: C.bg,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: C.textMid,
            }}
            aria-label="Open calendar"
          >
            <Icon name="calendar" size={18} color={C.textMid} />
          </button>
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
          {milestoneCards.map((item) => (
            <div key={item.id} style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: '#7a4ec618', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="flag" size={16} color="#7a4ec6" strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SERIF, color: C.text, fontSize: 18, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontFamily: SANS, color: C.textLight, fontSize: 11, marginTop: 2 }}>
                    Milestone metrics · {toDateString(item.date, 'No date')}
                  </div>
                </div>
              </div>
              <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg, padding: '10px 11px', marginBottom: 8 }}>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight, marginBottom: 4 }}>Current metrics</div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>{item.metricCurrent || 'Set your metrics from Create.'}</div>
              </div>
              <div style={{ borderRadius: 12, border: `1px solid ${C.green}40`, background: C.greenSoft, padding: '10px 11px' }}>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight, marginBottom: 4 }}>Next goal</div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.green, fontWeight: 700 }}>{item.nextGoal || 'Set next target in your draft drawer.'}</div>
              </div>
            </div>
          ))}

          {opportunityCards.map((item) => (
            <div key={item.id} style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: C.goldLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="star" size={16} color={C.gold} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SERIF, color: C.text, fontSize: 18, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontFamily: SANS, color: C.textLight, fontSize: 12, marginTop: 2 }}>{item.deadline || 'Deadline TBD'}</div>
                  <div style={{ fontFamily: SANS, color: C.textMid, fontSize: 12, marginTop: 6 }}>{item.action || item.summary || 'No action configured.'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => draftEmail(item)}
                  disabled={busy}
                  style={{
                    flex: 1,
                    border: 'none',
                    borderRadius: 10,
                    background: C.gold,
                    color: 'white',
                    padding: '9px 10px',
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Draft email
                </button>
                <button
                  type="button"
                  onClick={() => sendEmail(item)}
                  disabled={busy}
                  style={{
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    background: C.surface,
                    color: C.textMid,
                    padding: '9px 10px',
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          ))}

          {eventCards.map((item) => (
            <div key={item.id} style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: C.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="calendar" size={16} color={C.green} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.text }}>{item.title}</div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight }}>
                    {toDateString(item.date)} {item.time ? `· ${item.time}` : ''} {item.location ? `· ${item.location}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!missedCards.length && (
            <div style={{ background: C.surface, borderRadius: 16, border: `1px dashed ${C.border}`, padding: '14px 14px', fontFamily: SANS, fontSize: 12, color: C.textLight }}>
              Missed events and opportunities will appear here with new similar matches.
            </div>
          )}
          {missedCards.map((missed) => (
            <div key={missed.id} style={{ background: C.surface, borderRadius: 16, border: `1px dashed ${C.border}`, padding: '14px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fdf6e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="clock" size={16} color={C.gold} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>{missed.title}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight }}>Closed {toDateString(missed.closedLabel, missed.closedLabel)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(missed.similar || []).map((suggestion) => (
                  <div key={suggestion.id} style={{ padding: '10px 12px', background: C.greenSoft, borderRadius: 10, border: `1px solid ${C.green}40` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="sparkles" size={13} color={C.green} />
                        <div>
                          <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: C.green }}>{suggestion.title}</div>
                          <div style={{ fontFamily: SANS, fontSize: 11, color: '#285f3b', marginTop: 1 }}>{suggestion.opens}</div>
                        </div>
                      </div>
                      <div
                        style={{
                          borderRadius: 999,
                          background: 'white',
                          border: `1px solid ${C.green}55`,
                          padding: '3px 8px',
                          fontFamily: SANS,
                          fontSize: 11,
                          color: C.green,
                          fontWeight: 700,
                        }}
                      >
                        {suggestion.matchPercent}% match
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => runSearch(missed.title)}
                disabled={busy}
                style={{
                  marginTop: 10,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  background: C.surface,
                  color: C.textMid,
                  padding: '8px 10px',
                  fontFamily: SANS,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Search web for more similar
              </button>
            </div>
          ))}
        </div>

        {(emailDraftResult || searchResult) && (
          <div style={{ marginTop: 12, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '10px 11px' }}>
            {emailDraftResult && (
              <p style={{ margin: 0, fontFamily: SANS, fontSize: 12, color: C.textMid }}>
                <strong style={{ color: C.text }}>Email:</strong> {emailDraftResult}
              </p>
            )}
            {searchResult && (
              <p style={{ margin: emailDraftResult ? '6px 0 0' : 0, fontFamily: SANS, fontSize: 12, color: C.textMid }}>
                <strong style={{ color: C.text }}>Search:</strong> {searchResult}
              </p>
            )}
          </div>
        )}
      </div>

      <Sheet open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.text, fontWeight: 600, marginBottom: 8 }}>Calendar</div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginBottom: 14 }}>In-app calendar + ICS support</div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={exportIcs}
              disabled={!calendarItems.length}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 10,
                background: calendarItems.length ? C.green : C.greenSoft,
                color: calendarItems.length ? 'white' : C.textLight,
                padding: '10px 11px',
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 700,
                cursor: calendarItems.length ? 'pointer' : 'default',
              }}
            >
              Export ICS
            </button>
            <label
              htmlFor="ics-import"
              style={{
                flex: 1,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                background: C.surface,
                color: C.textMid,
                padding: '10px 11px',
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Import ICS
            </label>
            <input id="ics-import" type="file" accept=".ics,text/calendar" onChange={onImportIcs} style={{ display: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {!sortedCalendar.length && (
              <div style={{ borderRadius: 10, border: `1px dashed ${C.border}`, padding: '10px 11px', fontFamily: SANS, fontSize: 12, color: C.textLight }}>
                No calendar events yet. Accept an upcoming event from Create.
              </div>
            )}
            {sortedCalendar.map((event) => (
              <div key={event.id} style={{ borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, padding: '10px 11px' }}>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, fontWeight: 700 }}>{event.title}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight, marginTop: 2 }}>
                  {toDateString(event.date)} {event.time ? `· ${event.time}` : ''} {event.location ? `· ${event.location}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sheet>
    </div>
  );
}
