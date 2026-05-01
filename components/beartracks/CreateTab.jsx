'use client';

import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { C, SERIF, SANS } from './tokens';
import { Sheet } from './ui';

const CREATE_TYPES = [
  { id: 'milestone', label: 'Milestone', icon: 'flag', color: '#7a4ec6' },
  { id: 'opportunity', label: 'Opportunity', icon: 'star', color: C.gold },
  { id: 'event', label: 'Event', icon: 'calendar', color: C.green },
];

const CLARIFY_STEPS = {
  milestone: [
    { key: 'metricCurrent', question: 'What are your current metrics (e.g. applications sent, emails sent)?' },
    { key: 'nextGoal', question: 'What should the next target goal be for this milestone?' },
  ],
  opportunity: [
    { key: 'deadline', question: 'What is the deadline or critical date for this opportunity?' },
    { key: 'action', question: 'What action should I prioritize (email, apply, sign up)?' },
  ],
  event: [
    { key: 'date', question: 'When is this event happening?' },
    { key: 'location', question: 'Where is this event happening?' },
  ],
};

const DEFAULT_DRAFTS = [
  { id: 'draft-1', type: 'milestone', title: 'Research applications sprint', dateLabel: 'Saved 1d ago' },
  { id: 'draft-2', type: 'opportunity', title: 'Campus ambassador role', dateLabel: 'Saved 3d ago' },
];

function fallbackQuestion(type, step) {
  const sequence = CLARIFY_STEPS[type] || [];
  return sequence[step] || null;
}

function buildStructuredDraft({ type, prompt, answers, attachmentName }) {
  const nowIso = new Date().toISOString();
  const id = `${type}-${Date.now()}`;
  const parsedDate = answers.date || answers.deadline || '';
  const upcoming = parsedDate ? new Date(parsedDate) >= new Date() : true;

  return {
    id,
    createdAt: nowIso,
    type,
    title: prompt.slice(0, 80) || `${type} draft`,
    summary: prompt,
    date: parsedDate,
    time: answers.time || '',
    location: answers.location || '',
    isUpcoming: upcoming,
    attachmentName: attachmentName || '',
    program: answers.program || '',
    metricCurrent: answers.metricCurrent || '',
    nextGoal: answers.nextGoal || '',
    deadline: answers.deadline || '',
    action: answers.action || '',
  };
}

function fieldLabel(name) {
  if (name === 'metricCurrent') return 'Current metrics';
  if (name === 'nextGoal') return 'Next goal';
  if (name === 'attachmentName') return 'Image';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function CreateTab({ flowState, onAcceptDraft }) {
  const [selectedType, setSelectedType] = useState(flowState === 'create' ? 'event' : 'milestone');
  const [prompt, setPrompt] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [chat, setChat] = useState([]);
  const [clarifyStep, setClarifyStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answerInput, setAnswerInput] = useState('');
  const [clarifying, setClarifying] = useState(false);
  const [draft, setDraft] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentDrafts, setRecentDrafts] = useState(DEFAULT_DRAFTS);

  const selectedMeta = useMemo(
    () => CREATE_TYPES.find((t) => t.id === selectedType) || CREATE_TYPES[0],
    [selectedType],
  );

  const resetConversation = () => {
    setChat([]);
    setClarifyStep(0);
    setAnswers({});
    setAnswerInput('');
    setClarifying(false);
  };

  const requestQuestion = async (step, currentAnswers = answers) => {
    try {
      const response = await fetch('/api/agent/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          prompt,
          step,
          answers: currentAnswers,
          attachmentName,
        }),
      });
      if (!response.ok) throw new Error('Agent unavailable');
      const data = await response.json();
      if (!data.next) return null;
      return data.next;
    } catch (_err) {
      return fallbackQuestion(selectedType, step);
    }
  };

  const startAgentFlow = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const userMessage = { role: 'user', text: prompt.trim() };
    const first = await requestQuestion(0, {});
    if (!first) {
      const readyDraft = buildStructuredDraft({ type: selectedType, prompt: prompt.trim(), answers: {}, attachmentName });
      setDraft(readyDraft);
      setDrawerOpen(true);
      setLoading(false);
      return;
    }
    setClarifying(true);
    setChat([
      userMessage,
      {
        role: 'assistant',
        text: first.question,
      },
    ]);
    setClarifyStep(0);
    setLoading(false);
  };

  const sendAnswer = async () => {
    if (!answerInput.trim()) return;
    const previousQuestion = fallbackQuestion(selectedType, clarifyStep);
    const field = previousQuestion?.key || `answer${clarifyStep + 1}`;
    const nextAnswers = { ...answers, [field]: answerInput.trim() };
    const userMessage = { role: 'user', text: answerInput.trim() };
    setAnswerInput('');
    setAnswers(nextAnswers);

    const nextStep = clarifyStep + 1;
    const nextQuestion = await requestQuestion(nextStep, nextAnswers);
    if (!nextQuestion) {
      setChat((prev) => [...prev, userMessage]);
      const readyDraft = buildStructuredDraft({ type: selectedType, prompt: prompt.trim(), answers: nextAnswers, attachmentName });
      setDraft(readyDraft);
      setDrawerOpen(true);
      setClarifying(false);
      return;
    }

    setClarifyStep(nextStep);
    setChat((prev) => [...prev, userMessage, { role: 'assistant', text: nextQuestion.question }]);
  };

  const acceptDraft = () => {
    if (!draft) return;
    if (onAcceptDraft) onAcceptDraft(draft);
    setRecentDrafts((prev) => [
      { id: draft.id, type: draft.type, title: draft.title, dateLabel: 'Saved just now' },
      ...prev.slice(0, 3),
    ]);
    setDrawerOpen(false);
    setDraft(null);
    setPrompt('');
    setAttachmentName('');
    resetConversation();
  };

  const onAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAttachmentName(file.name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, position: 'relative' }}>
      <div style={{ padding: '14px 20px 12px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>
          Create
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.textLight, marginTop: 1 }}>
          Milestones · Opportunities · Events
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 100 }}>
        <div style={{ animation: 'fadeUp .25s ease' }}>
          <div
            style={{
              border: `1.5px solid ${C.border}`,
              borderRadius: 16,
              background: C.surface,
              padding: '12px 12px 10px',
            }}
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create or track..."
              style={{
                width: '100%',
                minHeight: 96,
                border: 'none',
                background: 'none',
                resize: 'vertical',
                outline: 'none',
                fontFamily: SANS,
                fontSize: 14,
                color: C.text,
                lineHeight: 1.5,
              }}
            />
            {attachmentName && (
              <div
                style={{
                  marginBottom: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 9px',
                  background: C.bg,
                  borderRadius: 999,
                  border: `1px solid ${C.border}`,
                  fontFamily: SANS,
                  fontSize: 11,
                  color: C.textMid,
                }}
              >
                <Icon name="image" size={12} />
                {attachmentName}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label
                  htmlFor="create-image-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    color: C.textMid,
                    padding: '7px 10px',
                    cursor: 'pointer',
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <Icon name="image" size={13} />
                  Image
                </label>
                <input id="create-image-upload" type="file" accept="image/*" onChange={onAttachment} style={{ display: 'none' }} />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: C.bg,
                    padding: '7px 9px',
                    fontFamily: SANS,
                    fontSize: 12,
                    color: C.text,
                  }}
                >
                  {CREATE_TYPES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={startAgentFlow}
                disabled={!prompt.trim() || loading}
                style={{
                  border: 'none',
                  borderRadius: 12,
                  background: prompt.trim() ? C.green : C.greenSoft,
                  color: prompt.trim() ? 'white' : C.textLight,
                  width: 38,
                  height: 38,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: prompt.trim() ? 'pointer' : 'default',
                }}
              >
                <Icon name="send" size={16} color={prompt.trim() ? 'white' : C.textLight} />
              </button>
            </div>
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            {CREATE_TYPES.map((item) => {
              const active = selectedType === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedType(item.id)}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    border: `1px solid ${active ? item.color : C.border}`,
                    background: active ? `${item.color}18` : C.surface,
                    color: active ? item.color : C.textLight,
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '9px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    opacity: active ? 1 : 0.5,
                  }}
                >
                  <Icon name={item.icon} size={13} color={active ? item.color : C.textLight} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {chat.length > 0 && (
            <div
              style={{
                marginTop: 14,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                background: C.surface,
                padding: '12px',
              }}
            >
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textMid, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                Agent clarification
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {chat.map((msg, idx) => (
                  <div
                    key={`${msg.role}-${idx}`}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '90%',
                      borderRadius: 10,
                      background: msg.role === 'user' ? C.green : C.bg,
                      color: msg.role === 'user' ? 'white' : C.text,
                      fontFamily: SANS,
                      fontSize: 12,
                      padding: '8px 10px',
                      lineHeight: 1.45,
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              {clarifying && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <input
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Answer question..."
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      background: 'white',
                      padding: '9px 10px',
                      fontFamily: SANS,
                      fontSize: 13,
                      color: C.text,
                    }}
                  />
                  <button
                    type="button"
                    onClick={sendAnswer}
                    disabled={!answerInput.trim()}
                    style={{
                      border: 'none',
                      borderRadius: 10,
                      background: answerInput.trim() ? C.green : C.greenSoft,
                      color: answerInput.trim() ? 'white' : C.textLight,
                      padding: '0 12px',
                      fontFamily: SANS,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: answerInput.trim() ? 'pointer' : 'default',
                    }}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          )}

          {draft && !drawerOpen && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              style={{
                marginTop: 12,
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${C.green}`,
                background: C.greenSoft,
                color: C.green,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 700,
                padding: '11px 12px',
                cursor: 'pointer',
              }}
            >
              Open draft details
            </button>
          )}

          <div
            style={{
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 700,
              color: C.textMid,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Recent drafts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentDrafts.map((item) => {
              const typeMeta = CREATE_TYPES.find((t) => t.id === item.type) || selectedMeta;
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 12px',
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: `${typeMeta.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: typeMeta.color,
                    }}
                  >
                    <Icon name={typeMeta.icon} size={15} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text }}>{item.title}</div>
                    <div style={{ fontFamily: SANS, fontSize: 11, color: C.textLight, marginTop: 1 }}>
                      {typeMeta.label} · {item.dateLabel}
                    </div>
                  </div>
                  <Icon name="chevron-right" size={16} color={C.textLight} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Sheet open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {draft && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 11,
                  background: `${selectedMeta.color}18`,
                  color: selectedMeta.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={selectedMeta.icon} size={15} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontFamily: SANS, color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  Review draft
                </div>
                <div style={{ fontFamily: SERIF, color: C.text, fontSize: 20, fontWeight: 600 }}>
                  {selectedMeta.label}
                </div>
              </div>
            </div>

            {Object.entries(draft)
              .filter(([key]) => !['id', 'createdAt', 'type'].includes(key))
              .map(([key, value]) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontFamily: SANS, fontSize: 11, color: C.textLight, marginBottom: 4 }}>
                    {fieldLabel(key)}
                  </label>
                  <input
                    value={typeof value === 'boolean' ? String(value) : value || ''}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [key]: key === 'isUpcoming' ? e.target.value !== 'false' : e.target.value,
                      }))
                    }
                    placeholder={fieldLabel(key)}
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      background: 'white',
                      padding: '10px 10px',
                      fontFamily: SANS,
                      fontSize: 13,
                      color: C.text,
                    }}
                  />
                </div>
              ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={acceptDraft}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: 12,
                  background: C.green,
                  color: 'white',
                  padding: '12px 10px',
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Accept tracker
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  background: C.surface,
                  color: C.textMid,
                  padding: '12px 12px',
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Later
              </button>
            </div>
          </div>
        )}
      </Sheet>

      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15,23,18,.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div
            style={{
              padding: '11px 14px',
              borderRadius: 10,
              background: C.surface,
              border: `1px solid ${C.border}`,
              fontFamily: SANS,
              fontSize: 12,
              color: C.textMid,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon name="sparkles" size={14} color={C.green} />
            Agent is preparing a follow-up question...
          </div>
        </div>
      )}
    </div>
  );
}
