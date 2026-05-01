'use client';

import { useEffect, useState } from 'react';
import { AskTab } from './AskTab';
import { AppTweaksPanel } from './AppTweaksPanel';
import { CreateTab } from './CreateTab';
import { ProfileTab } from './ProfileTab';
import { TrackTab } from './TrackTab';
import { Icon } from './Icon';
import { C, SANS } from './tokens';
import { BottomNav, StatusBar } from './ui';

export default function BeartracksApp() {
  const [tab, setTab] = useState('ask');
  const [flow, setFlow] = useState('idle');
  const [nudge, setNudge] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', h);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', h);
  }, []);

  const goTo = (t) => {
    if (t !== tab) setTab(t);
  };

  const onAskAdvance = () => {
    setFlow('create');
    setTimeout(() => goTo('create'), 350);
  };

  const onDeploy = () => {
    setFlow('track');
    setTimeout(() => goTo('track'), 350);
  };

  const onNudge = () => {
    setNudge(true);
    setTimeout(() => {
      setNudge(false);
      setFlow('nudge');
      goTo('ask');
    }, 2600);
  };

  const tabs = {
    ask: <AskTab flowState={flow} onAdvance={onAskAdvance} />,
    create: <CreateTab flowState={flow} onDeploy={onDeploy} />,
    track: <TrackTab flowState={flow} onNudge={onNudge} />,
    profile: <ProfileTab />,
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg,#0a1610 0%,#142318 50%,#0a1610 100%)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 430,
          height: '100%',
          maxHeight: 932,
          background: C.surface,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 40px 120px rgba(0,0,0,.6)',
        }}
      >
        {nudge && (
          <div
            style={{
              position: 'absolute',
              top: 54,
              left: 14,
              right: 14,
              zIndex: 500,
              background: C.greenDeep,
              borderRadius: 16,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: `0 12px 40px ${C.green}66`,
              animation: 'nudgePop .4s cubic-bezier(.34,1.56,.64,1) forwards',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(212,167,44,.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.gold,
              }}
            >
              <Icon name="target" size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: 'white' }}>Match found</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(255,255,255,.78)', marginTop: 2 }}>
                CAB 2-690 · Tomorrow 1–5 PM
              </div>
            </div>
            <button
              type="button"
              style={{
                background: C.gold,
                border: 'none',
                borderRadius: 10,
                padding: '7px 12px',
                color: '#1f1a08',
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View
            </button>
          </div>
        )}

        <StatusBar />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{tabs[tab]}</div>
        <BottomNav active={tab} onChange={goTo} />
      </div>
      <AppTweaksPanel
        open={tweaksOpen}
        onClose={() => {
          setTweaksOpen(false);
          window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
        }}
      />
    </div>
  );
}
