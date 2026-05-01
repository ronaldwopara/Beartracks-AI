'use client';

import { useEffect, useState } from 'react';
import { AppTweaksPanel } from './AppTweaksPanel';
import { CreateTab } from './CreateTab';
import { ProfileTab } from './ProfileTab';
import { TrackTab } from './TrackTab';
import { Icon } from './Icon';
import { C, SANS } from './tokens';
import { BottomNav, StatusBar } from './ui';

const DEFAULT_TRACKERS = {
  milestones: [],
  opportunities: [],
  events: [],
  calendarEvents: [],
  missedItems: [],
};

function generateSimilarItems(title = 'Missed item') {
  return [
    {
      id: crypto.randomUUID(),
      title: `${title} - related campus event`,
      opens: 'Opens next week',
      matchPercent: 91,
      kind: 'event',
    },
    {
      id: crypto.randomUUID(),
      title: `${title} - alternate opportunity`,
      opens: 'Open now',
      matchPercent: 84,
      kind: 'opportunity',
    },
  ];
}

export default function BeartracksApp({ studentProfile }) {
  const [tab, setTab] = useState('create');
  const [flow, setFlow] = useState('create');
  const [nudge, setNudge] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [trackers, setTrackers] = useState(DEFAULT_TRACKERS);

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

  const showNudge = (label = 'Similar match discovered') => {
    setNudge(true);
    setTimeout(() => {
      setNudge(false);
      setFlow('track');
    }, 2600);
    return label;
  };

  const addCalendarEvents = (incomingEvents) => {
    setTrackers((prev) => {
      const all = [...incomingEvents, ...prev.calendarEvents];
      return { ...prev, calendarEvents: all };
    });
  };

  const importIcsEvents = (incomingEvents) => {
    if (!incomingEvents?.length) return;
    addCalendarEvents(incomingEvents);
  };

  const onAcceptDraft = (draft) => {
    setTrackers((prev) => {
      const next = { ...prev };

      if (draft.type === 'milestone') {
        next.milestones = [draft, ...prev.milestones];
      } else if (draft.type === 'opportunity') {
        next.opportunities = [draft, ...prev.opportunities];
      } else if (draft.type === 'event') {
        next.events = [draft, ...prev.events];
        if (draft.isUpcoming) {
          next.calendarEvents = [
            {
              id: draft.id,
              title: draft.title,
              date: draft.date,
              time: draft.time,
              location: draft.location,
              source: 'Create',
            },
            ...prev.calendarEvents,
          ];
        } else {
          next.missedItems = [
            {
              id: draft.id,
              title: draft.title,
              closedLabel: draft.date || 'Date passed',
              reason: 'This event date already passed.',
              similar: generateSimilarItems(draft.title),
            },
            ...prev.missedItems,
          ];
          showNudge();
        }
      }

      return next;
    });

    setFlow('track');
    setTimeout(() => goTo('track'), 250);
  };

  const tabs = {
    create: <CreateTab flowState={flow} onAcceptDraft={onAcceptDraft} />,
    track: (
      <TrackTab
        flowState={flow}
        studentProfile={studentProfile}
        milestones={trackers.milestones}
        opportunities={trackers.opportunities}
        events={trackers.events}
        calendarEvents={trackers.calendarEvents}
        missedItems={trackers.missedItems}
        onImportIcsEvents={importIcsEvents}
        onSignalNudge={showNudge}
      />
    ),
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
                Similar opportunity ready in Track
              </div>
            </div>
            <button
              type="button"
              onClick={() => goTo('track')}
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
