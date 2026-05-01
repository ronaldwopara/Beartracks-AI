// Ask Tab — Chat interface with AI clarification loop + bottom sheet

const AskTab = ({ onFlowAdvance, flowState, setFlowState }) => {
  const [messages, setMessages] = React.useState([]);
  const [inputVal, setInputVal] = React.useState('');
  const [sheet, setSheet] = React.useState(null); // null | 'clarify1' | 'clarify2' | 'confirm'
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [nudgeVisible, setNudgeVisible] = React.useState(false);
  const msgEndRef = React.useRef(null);

  const scrollToBottom = () => {
    if (msgEndRef.current) {
      msgEndRef.current.parentElement.scrollTop = msgEndRef.current.parentElement.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle reverse nudge from Track tab
  React.useEffect(() => {
    if (flowState === 'nudge') {
      setNudgeVisible(true);
      setMessages([
        { role: 'agent', text: '🎯 Found it. CAB 2-690 is available tomorrow 1:00–5:00 PM. Quiet zone. Has a whiteboard. The Remedy Café is 180m away.', time: 'Just now', action: { label: 'Reserve Room', icon: '✓' } },
        { role: 'hint', text: 'I\'m marking this room as a preferred North Campus location — is that right?' }
      ]);
    }
  }, [flowState]);

  const initialMessage = {
    role: 'agent',
    text: 'Hey. What do you need?',
    time: '9:41 AM',
  };

  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, []);

  const simulateTyping = (callback, delay = 1200) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      callback();
    }, delay);
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = { role: 'user', text: inputVal, time: 'Now' };
    setInputVal('');
    setMessages(prev => [...prev, userMsg]);

    simulateTyping(() => {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: 'On it — North Campus study room, tomorrow afternoon. Two quick things before I start tracking:',
        time: 'Now',
      }]);
      setTimeout(() => {
        setSheet('clarify1');
        setSheetVisible(true);
      }, 600);
    }, 1000);
  };

  const handleClarify1 = (duration) => {
    closeSheet();
    const userMsg = { role: 'user', text: duration, time: 'Now', chip: true };
    setMessages(prev => [...prev, userMsg]);
    simulateTyping(() => {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: `Got it — ${duration}. Do you need the room to yourself, or is a shared quiet space fine?`,
        time: 'Now',
      }]);
      setTimeout(() => {
        setSheet('clarify2');
        setSheetVisible(true);
      }, 400);
    }, 900);
  };

  const handleClarify2 = (type) => {
    closeSheet();
    const userMsg = { role: 'user', text: type, time: 'Now', chip: true };
    setMessages(prev => [...prev, userMsg]);
    simulateTyping(() => {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: "Solid. I'm parsing this into tracking parameters — confirm and I'll deploy the agent.",
        time: 'Now',
        confirmAction: true,
      }]);
    }, 900);
  };

  const handleConfirm = () => {
    setMessages(prev => [...prev, {
      role: 'agent',
      text: "Agent deployed. Scanning UAIMS room booking system + North Campus space data now.",
      time: 'Now',
      agentStatus: true,
    }]);
    setTimeout(() => {
      onFlowAdvance('create');
    }, 800);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setSheet(null), 350);
  };

  const lastMsg = messages[messages.length - 1];
  const showConfirmBtn = lastMsg && lastMsg.confirmAction && flowState !== 'deployed';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: COLORS.bg, position: 'relative' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: COLORS.text, lineHeight: 1.1 }}>Ask</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
              {flowState === 'nudge' ? '1 new lead found' : 'Beartracks AI · U of A'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {flowState === 'deployed' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: COLORS.greenLight, padding: '4px 10px', borderRadius: 12 }}>
                <PulsingDot />
                <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.green, fontFamily: 'DM Sans, sans-serif' }}>1 Agent Live</span>
              </div>
            )}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke={COLORS.green} strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={COLORS.green} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Nudge Banner */}
      {nudgeVisible && (
        <div style={{
          margin: '10px 16px 0',
          background: COLORS.green,
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideDown 0.4s ease',
          cursor: 'pointer',
        }}
        onClick={() => setNudgeVisible(false)}>
          <div style={{ fontSize: 18 }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'white' }}>Agent found a match</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>CAB 2-690 · Tomorrow 1–5 PM</div>
          </div>
          <div style={{ color: 'white', fontSize: 12, opacity: 0.7 }}>✕</div>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 100px',
        scrollbarWidth: 'none',
      }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onConfirm={showConfirmBtn && i === messages.length - 1 ? handleConfirm : null} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={msgEndRef}></div>
      </div>

      {/* Input */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${COLORS.border}`,
        padding: '10px 16px 16px',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            flex: 1, background: COLORS.bg, borderRadius: 24,
            border: `1.5px solid ${COLORS.border}`,
            display: 'flex', alignItems: 'center', padding: '0 16px',
            transition: 'border-color 0.2s',
          }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={flowState === 'nudge' ? 'Ask a follow-up...' : 'What do you need?'}
              style={{
                flex: 1, border: 'none', background: 'none',
                padding: '12px 0', fontSize: 14,
                fontFamily: 'DM Sans, sans-serif', color: COLORS.text,
                outline: 'none',
              }}
            />
          </div>
          <button onClick={handleSend} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: inputVal.trim() ? COLORS.green : COLORS.border,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, transform 0.15s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {messages.length === 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {['Find a study room', 'Check my schedule', 'Research opportunities'].map(q => (
              <button key={q} onClick={() => setInputVal(q)} style={{
                background: COLORS.greenLight, border: 'none', borderRadius: 16,
                padding: '6px 12px', fontSize: 12, fontFamily: 'DM Sans, sans-serif',
                color: COLORS.green, fontWeight: 500, cursor: 'pointer',
              }}>{q}</button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      {sheet && (
        <BottomSheet visible={sheetVisible} onClose={closeSheet}>
          {sheet === 'clarify1' && <Clarify1Sheet onSelect={handleClarify1} />}
          {sheet === 'clarify2' && <Clarify2Sheet onSelect={handleClarify2} />}
        </BottomSheet>
      )}
    </div>
  );
};

const MessageBubble = ({ msg, onConfirm }) => {
  const isUser = msg.role === 'user';
  const isHint = msg.role === 'hint';

  if (isHint) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '8px 0 12px', padding: '10px 14px', background: COLORS.goldLight, borderRadius: 12, border: `1px solid ${COLORS.gold}44` }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <p style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#8a6a00', lineHeight: 1.5 }}>{msg.text}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }}>
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: COLORS.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: 'white', fontWeight: 700, fontFamily: 'DM Sans' }}>B</span>
          </div>
          <span style={{ fontSize: 11, color: COLORS.textLight, fontFamily: 'DM Sans, sans-serif' }}>Beartracks · {msg.time}</span>
        </div>
      )}
      <div style={{
        maxWidth: '82%',
        background: isUser ? COLORS.green : COLORS.surface,
        color: isUser ? 'white' : COLORS.text,
        borderRadius: isUser ? '20px 20px 6px 20px' : '6px 20px 20px 20px',
        padding: '10px 14px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: isUser ? 'none' : `1px solid ${COLORS.border}`,
      }}>
        {msg.chip ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>{msg.text}</span>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 14, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{msg.text}</p>
        )}

        {msg.agentStatus && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: COLORS.greenLight, borderRadius: 8 }}>
            <PulsingDot />
            <span style={{ fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: COLORS.green, fontWeight: 500 }}>Scanning UAIMS · room.ualberta.ca</span>
          </div>
        )}

        {msg.action && (
          <button style={{
            marginTop: 8, width: '100%', background: COLORS.green, color: 'white',
            border: 'none', borderRadius: 12, padding: '10px', fontFamily: 'DM Sans, sans-serif',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span>{msg.action.icon}</span> {msg.action.label}
          </button>
        )}
      </div>

      {onConfirm && (
        <button onClick={onConfirm} style={{
          marginTop: 10, background: COLORS.green, color: 'white',
          border: 'none', borderRadius: 20, padding: '12px 28px',
          fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', boxShadow: `0 4px 16px ${COLORS.green}44`,
          transition: 'transform 0.15s, box-shadow 0.15s',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>Review Tracking Parameters →</span>
        </button>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
    <div style={{ width: 22, height: 22, borderRadius: '50%', background: COLORS.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>B</span>
    </div>
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '6px 20px 20px 20px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: COLORS.textLight,
          animation: `typingDot 1.2s ease ${i * 0.2}s infinite`,
        }}></div>
      ))}
    </div>
  </div>
);

const BottomSheet = ({ visible, onClose, children }) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 200,
    background: visible ? 'rgba(0,0,0,0.35)' : 'transparent',
    transition: 'background 0.3s',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    pointerEvents: visible ? 'all' : 'none',
  }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div style={{
      background: COLORS.surface, borderRadius: '24px 24px 0 0',
      padding: '20px 20px 36px',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
    }}>
      <div style={{ width: 36, height: 4, background: COLORS.border, borderRadius: 2, margin: '0 auto 20px' }}></div>
      {children}
    </div>
  </div>
);

const Clarify1Sheet = ({ onSelect }) => {
  const options = [
    { label: '1–2 hours', sub: 'Quick session' },
    { label: '2–4 hours', sub: 'Afternoon block' },
    { label: '4+ hours', sub: 'All day' },
    { label: 'Flexible', sub: 'Show all options' },
  ];
  return (
    <div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: COLORS.text, marginBottom: 4 }}>How long do you need it?</div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: COLORS.textLight, marginBottom: 20 }}>Helps narrow availability windows</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(o => (
          <button key={o.label} onClick={() => onSelect(o.label)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: COLORS.bg, border: `1.5px solid ${COLORS.border}`,
            borderRadius: 16, cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.background = COLORS.greenLight; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.bg; }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: COLORS.text }}>{o.label}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textLight }}>{o.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Clarify2Sheet = ({ onSelect }) => {
  const options = [
    { label: 'Solo only', icon: '👤', sub: 'Private booking' },
    { label: 'Quiet shared OK', icon: '🤫', sub: 'Low-traffic space' },
    { label: 'Either', icon: '↕', sub: 'Show all' },
  ];
  return (
    <div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: COLORS.text, marginBottom: 4 }}>Room type?</div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: COLORS.textLight, marginBottom: 20 }}>I'll set your preference as a Dealbreaker</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {options.map(o => (
          <button key={o.label} onClick={() => onSelect(o.label)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            padding: '16px 8px', background: COLORS.bg, border: `1.5px solid ${COLORS.border}`,
            borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.background = COLORS.greenLight; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.bg; }}>
            <span style={{ fontSize: 24 }}>{o.icon}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: COLORS.text, textAlign: 'center' }}>{o.label}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: COLORS.textLight, textAlign: 'center' }}>{o.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { AskTab, BottomSheet });
