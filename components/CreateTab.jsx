// Create Tab — Smart Chip Canvas with Dealbreakers / Bonuses logic

const STUDY_CHIPS = {
  dealbreakers: [
    { id: 'loc', type: 'location', label: 'North Campus' },
    { id: 'date', type: 'date', label: 'Tomorrow' },
    { id: 'noise', type: 'noise', label: 'Quiet zone' },
    { id: 'time', type: 'time', label: '12:00–5:00 PM' },
  ],
  bonuses: [
    { id: 'amenity', type: 'amenity', label: 'Whiteboard' },
    { id: 'proximity', type: 'proximity', label: 'Coffee < 5 min' },
    { id: 'capacity', type: 'capacity', label: 'Solo only' },
  ],
};

const CreateTab = ({ onDeploy, flowState }) => {
  const [dealbreakers, setDealbreakers] = React.useState(
    flowState === 'create' ? STUDY_CHIPS.dealbreakers : []
  );
  const [bonuses, setBonuses] = React.useState(
    flowState === 'create' ? STUDY_CHIPS.bonuses : []
  );
  const [editChip, setEditChip] = React.useState(null);
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [deployAnim, setDeployAnim] = React.useState(false);
  const [nlInput, setNlInput] = React.useState('');
  const [showCanvas, setShowCanvas] = React.useState(flowState === 'create');
  const [parsing, setParsing] = React.useState(false);

  React.useEffect(() => {
    if (flowState === 'create' && !showCanvas) {
      setShowCanvas(true);
      setDealbreakers(STUDY_CHIPS.dealbreakers);
      setBonuses(STUDY_CHIPS.bonuses);
    }
  }, [flowState]);

  const handleChipTap = (chip, zone) => {
    setEditChip({ ...chip, zone });
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setEditChip(null), 350);
  };

  const moveChip = (chip, from, to) => {
    if (from === 'dealbreakers') {
      setDealbreakers(prev => prev.filter(c => c.id !== chip.id));
      setBonuses(prev => [...prev, chip]);
    } else {
      setBonuses(prev => prev.filter(c => c.id !== chip.id));
      setDealbreakers(prev => [...prev, chip]);
    }
  };

  const handleDeploy = () => {
    setDeployAnim(true);
    setTimeout(() => {
      onDeploy();
    }, 900);
  };

  const handleNLParse = () => {
    if (!nlInput.trim()) return;
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setShowCanvas(true);
      setDealbreakers(STUDY_CHIPS.dealbreakers);
      setBonuses(STUDY_CHIPS.bonuses);
      setNlInput('');
    }, 1400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: COLORS.bg }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: COLORS.text }}>Create</div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>Logic canvas · Agents, Milestones, Budgets</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 100, scrollbarWidth: 'none' }}>

        {/* NL Input */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            background: COLORS.surface, borderRadius: 16, border: `1.5px solid ${COLORS.border}`,
            padding: '4px 4px 4px 16px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <input
              value={nlInput}
              onChange={e => setNlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNLParse()}
              placeholder={showCanvas ? 'Add a new agent or milestone...' : 'Describe what you want to track...'}
              style={{
                flex: 1, border: 'none', background: 'none', padding: '12px 0',
                fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: COLORS.text, outline: 'none',
              }}
            />
            <button onClick={handleNLParse} style={{
              background: nlInput.trim() ? COLORS.green : COLORS.border,
              border: 'none', borderRadius: 12, padding: '10px 16px',
              color: 'white', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}>
              {parsing ? '...' : 'Parse →'}
            </button>
          </div>
        </div>

        {parsing && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: COLORS.textMid, marginBottom: 8 }}>Reading your intent...</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.green, animation: `typingDot 1s ease ${i*0.15}s infinite` }}></div>
              ))}
            </div>
          </div>
        )}

        {!showCanvas && !parsing && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⊙</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: COLORS.text, marginBottom: 8 }}>Logic Canvas</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: COLORS.textLight, lineHeight: 1.6 }}>
              Describe what you want in plain English. Beartracks will parse it into a visual query you can tweak.
            </div>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Find a study room on North Campus', 'Alert me when research positions open', 'Track housing under $900/month'].map(s => (
                <button key={s} onClick={() => setNlInput(s)} style={{
                  background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12,
                  padding: '10px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: COLORS.textMid,
                  cursor: 'pointer', textAlign: 'left',
                }}>"{s}"</button>
              ))}
            </div>
          </div>
        )}

        {showCanvas && !parsing && (
          <>
            {/* Agent Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ background: COLORS.greenLight, border: `1px solid ${COLORS.green}33`, borderRadius: 10, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <PulsingDot color={COLORS.green} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: COLORS.green }}>New Agent · Study Room</span>
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: COLORS.textLight }}>Campus Life</div>
            </div>

            {/* Anti-slop hint */}
            <div style={{
              background: COLORS.goldLight, border: `1px solid ${COLORS.gold}55`,
              borderRadius: 12, padding: '10px 14px', marginBottom: 16,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <p style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#8a6a00', lineHeight: 1.5 }}>
                I parsed "quiet" as a <strong>Dealbreaker</strong> and "whiteboard" as a <strong>Bonus</strong>. Tap any chip to adjust — drag to swap zones.
              </p>
            </div>

            {/* Dealbreakers zone */}
            <ChipZone
              title="Dealbreakers"
              subtitle="Must match all of these"
              icon="🔒"
              chips={dealbreakers}
              zone="dealbreakers"
              onChipTap={(c) => handleChipTap(c, 'dealbreakers')}
              onMove={(c) => moveChip(c, 'dealbreakers', 'bonuses')}
              accentColor={COLORS.green}
              bgColor={COLORS.greenLight}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
              <div style={{ flex: 1, height: 1, background: COLORS.border }}></div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: COLORS.textLight, fontWeight: 500 }}>AND</div>
              <div style={{ flex: 1, height: 1, background: COLORS.border }}></div>
            </div>

            {/* Bonuses zone */}
            <ChipZone
              title="Bonuses"
              subtitle="Nice-to-haves — rank higher"
              icon="✦"
              chips={bonuses}
              zone="bonuses"
              onChipTap={(c) => handleChipTap(c, 'bonuses')}
              onMove={(c) => moveChip(c, 'bonuses', 'dealbreakers')}
              accentColor="#8a6a00"
              bgColor={COLORS.goldLight}
            />
          </>
        )}
      </div>

      {/* Deploy Button */}
      {showCanvas && (
        <div style={{
          position: 'absolute', bottom: 64, left: 0, right: 0,
          padding: '12px 20px',
          background: 'rgba(247,248,246,0.95)', backdropFilter: 'blur(12px)',
          borderTop: `1px solid ${COLORS.border}`,
        }}>
          <button onClick={handleDeploy} style={{
            width: '100%', background: deployAnim ? COLORS.greenMid : COLORS.green,
            color: 'white', border: 'none', borderRadius: 20, padding: '16px',
            fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: `0 4px 20px ${COLORS.green}44`,
            transform: deployAnim ? 'scale(0.97)' : 'scale(1)',
          }}>
            {deployAnim ? (
              <>
                <PulsingDot color="white" />
                <span>Deploying Agent...</span>
              </>
            ) : (
              <>
                <span>Deploy Agent</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Edit chip bottom sheet */}
      <BottomSheet visible={sheetVisible} onClose={closeSheet}>
        {editChip && <ChipEditSheet chip={editChip} onMove={() => { moveChip(editChip, editChip.zone, editChip.zone === 'dealbreakers' ? 'bonuses' : 'dealbreakers'); closeSheet(); }} onClose={closeSheet} />}
      </BottomSheet>
    </div>
  );
};

const ChipZone = ({ title, subtitle, icon, chips, zone, onChipTap, onMove, accentColor, bgColor }) => (
  <div style={{
    background: COLORS.surface, borderRadius: 20,
    border: `1.5px solid ${accentColor}33`,
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '12px 16px 10px',
      background: bgColor, borderBottom: `1px solid ${accentColor}22`,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: accentColor }}>{title}</div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: COLORS.textLight }}>{subtitle}</div>
      </div>
    </div>
    <div style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 60 }}>
      {chips.length === 0 ? (
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: COLORS.textLight, fontStyle: 'italic', padding: '8px 0' }}>
          Drag chips here...
        </div>
      ) : (
        chips.map(chip => (
          <div key={chip.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Chip type={chip.type} label={chip.label} onTap={() => onChipTap(chip)} />
          </div>
        ))
      )}
    </div>
  </div>
);

const ChipEditSheet = ({ chip, onMove, onClose }) => {
  const style = CHIP_TYPES[chip.type] || CHIP_TYPES.location;
  const otherZone = chip.zone === 'dealbreakers' ? 'Bonuses' : 'Dealbreakers';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ background: style.bg, border: `1px solid ${style.text}22`, borderRadius: 20, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{style.icon}</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: style.text }}>{chip.label}</span>
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: COLORS.textLight }}>
          Currently in <strong>{chip.zone === 'dealbreakers' ? 'Dealbreakers' : 'Bonuses'}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onMove} style={{
          padding: '14px 16px', background: COLORS.bg, border: `1.5px solid ${COLORS.border}`,
          borderRadius: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
          color: COLORS.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}>
          <span>Move to {otherZone}</span>
          <span style={{ fontSize: 18 }}>↕</span>
        </button>
        <button onClick={onClose} style={{
          padding: '14px 16px', background: COLORS.errorLight, border: `1.5px solid ${COLORS.error}33`,
          borderRadius: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
          color: COLORS.error, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}>
          <span>Remove chip</span>
          <span>✕</span>
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { CreateTab });
