// Track Tab — Dashboard with agent cards, what-if engine, heatmap

const TrackTab = ({ flowState, onNudge }) => {
  const [agentProgress, setAgentProgress] = React.useState(0);
  const [agentStatus, setAgentStatus] = React.useState('scanning');
  const [matchFound, setMatchFound] = React.useState(false);
  const [whatIfVisible, setWhatIfVisible] = React.useState(false);
  const [sliderVal, setSliderVal] = React.useState(50);

  // Simulate agent scanning progress
  React.useEffect(() => {
    if (flowState !== 'track') return;
    let val = 0;
    const interval = setInterval(() => {
      val += Math.random() * 8 + 2;
      if (val >= 100) {
        val = 100;
        clearInterval(interval);
        setAgentStatus('found');
        setMatchFound(true);
        setTimeout(() => onNudge && onNudge(), 1200);
      }
      setAgentProgress(Math.min(val, 100));
    }, 400);
    return () => clearInterval(interval);
  }, [flowState]);

  const domainData = [
    { domain: 'Academics', value: 72, color: COLORS.green },
    { domain: 'Campus Life', value: 45, color: '#9c27b0' },
    { domain: 'Finances', value: 30, color: '#f5c842' },
    { domain: 'Wellness', value: 18, color: '#e91e63' },
    { domain: 'Housing', value: 55, color: '#2196f3' },
  ];

  const existingCards = [
    {
      id: 'bio-research',
      title: 'Summer Bio Research',
      subtitle: 'Scanning UAIMS grant database...',
      domain: 'Academics',
      status: 'active',
      progress: 0.34,
      timestamp: '2d ago',
      chips: [{ type: 'amenity', label: 'Biology Dept' }, { type: 'date', label: 'May–Aug' }],
    },
    {
      id: 'missed',
      title: 'ALES Undergraduate Award',
      subtitle: 'Deadline passed — 94% match',
      domain: 'Finances',
      status: 'missed',
      progress: 0,
      timestamp: '5d ago',
      chips: [{ type: 'date', label: 'Deadline passed' }],
      similar: 'FGSR Travel Award opens June 1',
    },
  ];

  const studyRoomCard = {
    id: 'study-room',
    title: 'Quiet Study Room',
    subtitle: agentStatus === 'found' ? 'CAB 2-690 available · Match found' : `Scanning room.ualberta.ca · ${Math.round(agentProgress)}%`,
    domain: 'Campus Life',
    status: agentStatus,
    progress: agentProgress / 100,
    timestamp: 'Just now',
    chips: [
      { type: 'location', label: 'North Campus' },
      { type: 'date', label: 'Tomorrow' },
      { type: 'time', label: '12–5 PM' },
    ],
    match: matchFound ? 'CAB 2-690' : null,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: COLORS.bg }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: COLORS.text }}>Track</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
              {flowState === 'track' ? '3 active agents' : '2 active agents'}
            </div>
          </div>
          <button onClick={() => setWhatIfVisible(v => !v)} style={{
            background: whatIfVisible ? COLORS.greenLight : COLORS.bg,
            border: `1.5px solid ${whatIfVisible ? COLORS.green : COLORS.border}`,
            borderRadius: 12, padding: '6px 12px',
            fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
            color: whatIfVisible ? COLORS.green : COLORS.textMid,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 14 }}>⟷</span> What-If
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: 90 }}>

        {/* What-If Engine */}
        {whatIfVisible && (
          <div style={{ margin: '12px 16px 0', background: COLORS.surface, borderRadius: 18, border: `1.5px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: COLORS.greenLight, borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: COLORS.green }}>⟷ What-If Engine</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: COLORS.textLight }}>Drag to test schedule impact</div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textMid, marginBottom: 8 }}>
                If I add a study block tomorrow afternoon:
              </div>
              <input type="range" min="0" max="100" value={sliderVal}
                onChange={e => setSliderVal(e.target.value)}
                style={{ width: '100%', accentColor: COLORS.green, marginBottom: 10 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: COLORS.textLight }}>
                <span>12:00 PM</span><span>3:00 PM</span><span>6:00 PM</span>
              </div>
              <div style={{ marginTop: 12, padding: '10px 12px', background: COLORS.bg, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textMid }}>
                  {sliderVal > 70 ? '⚠ Conflicts with BIOL 307 lab at 4 PM' : '✓ No conflicts detected in this window'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Domain Heatmap */}
        <div style={{ margin: '12px 16px 0', background: COLORS.surface, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: '14px 16px' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: COLORS.textMid, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Engagement Balance
          </div>
          {domainData.map(d => (
            <div key={d.domain} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textMid }}>{d.domain}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: d.color }}>{d.value}%</span>
              </div>
              <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${d.value}%`, height: '100%', background: d.color, borderRadius: 3, transition: 'width 1s ease' }}></div>
              </div>
            </div>
          ))}
          {domainData.find(d => d.value < 25) && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: '#fce4ec', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#a0294a' }}>
              💡 Wellness is low — want me to find campus recreation options?
            </div>
          )}
        </div>

        {/* Active Agents */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: COLORS.textMid, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Active Agents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {flowState === 'track' && <AgentCard card={studyRoomCard} />}
            {existingCards.map(card => <AgentCard key={card.id} card={card} />)}
          </div>
        </div>

        {/* Missed Connections */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: COLORS.textMid, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Missed Connections
          </div>
          <div style={{ background: COLORS.surface, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5c842', marginTop: 5, flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: COLORS.text }}>ALES Undergraduate Award</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>94% match · Deadline Jan 15</div>
                <div style={{ marginTop: 8, padding: '8px 10px', background: COLORS.greenLight, borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.green }}>
                  Similar: FGSR Travel Award opens June 1 →
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const AgentCard = ({ card }) => {
  const domainStyle = DOMAIN_COLORS[card.domain] || DOMAIN_COLORS['Campus Life'];
  const isScanning = card.status === 'scanning';
  const isFound = card.status === 'found';
  const isMissed = card.status === 'missed';

  return (
    <div style={{
      background: COLORS.surface, borderRadius: 20,
      border: `1.5px solid ${isFound ? COLORS.green + '66' : COLORS.border}`,
      padding: '16px',
      transition: 'border-color 0.5s',
      boxShadow: isFound ? `0 4px 20px ${COLORS.green}22` : '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: domainStyle.dot, flexShrink: 0 }}></div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700, color: domainStyle.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {card.domain}
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: COLORS.textLight }}>{card.timestamp}</span>
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: COLORS.text }}>{card.title}</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: isFound ? COLORS.green : COLORS.textLight, marginTop: 2, fontWeight: isFound ? 600 : 400 }}>
            {isScanning && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><PulsingDot />{card.subtitle}</span>}
            {!isScanning && card.subtitle}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginLeft: 12 }}>
          {(isScanning || isFound) && (
            <ProgressRing
              progress={card.progress}
              size={48}
              color={isFound ? COLORS.green : COLORS.textLight}
              label={isFound ? '✓' : `${Math.round(card.progress * 100)}%`}
            />
          )}
          {isMissed && (
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: COLORS.errorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⏱</div>
          )}
        </div>
      </div>

      {/* Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: isFound ? 12 : 0 }}>
        {card.chips && card.chips.map((c, i) => (
          <Chip key={i} type={c.type} label={c.label} small />
        ))}
      </div>

      {/* Found result */}
      {isFound && card.match && (
        <div style={{
          background: COLORS.greenLight, borderRadius: 12, padding: '10px 14px',
          border: `1px solid ${COLORS.green}33`,
        }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: COLORS.green, marginBottom: 2 }}>
            🎯 {card.match} · Available
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.green }}>Tomorrow 1:00–5:00 PM · Quiet zone · Whiteboard</div>
        </div>
      )}

      {/* Similar for missed */}
      {isMissed && card.similar && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: COLORS.greenLight, borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.green }}>
          Similar opportunity: {card.similar}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { TrackTab });
