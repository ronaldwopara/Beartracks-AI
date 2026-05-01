'use client';

import { useEffect, useMemo, useState } from 'react';
import BeartracksApp from '@/components/beartracks/BeartracksApp';
import { Icon } from '@/components/beartracks/Icon';
import { C, SANS, SERIF } from '@/components/beartracks/tokens';

const SPLASH_DURATION_MS = 2000;

function OnboardingGate({ onComplete }) {
  const [university, setUniversity] = useState('UAlberta');
  const [cardFileName, setCardFileName] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth > 820);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const canContinue = useMemo(() => name.trim() && studentId.trim() && (program.trim() || name.trim()), [name, studentId, program]);

  const onCardChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCardFileName(file.name);

    if (!name.trim()) setName('Student Name');
    if (!studentId.trim()) setStudentId('1234567');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        height: '100%',
        maxHeight: 932,
        background: C.surface,
        boxShadow: '0 40px 120px rgba(0,0,0,.6)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '22px 20px 10px' }}>
        <p style={{ margin: 0, color: C.green, fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Welcome to Beartracks AI
        </p>
        <h1 style={{ margin: '8px 0 4px', fontFamily: SERIF, color: C.text, fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em' }}>
          Let&apos;s get you set up
        </h1>
        <p style={{ margin: 0, color: C.textLight, fontFamily: SANS, fontSize: 13, lineHeight: 1.45 }}>
          Select your university, then verify your student details using your OneCard or manual entry.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="university" style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, fontWeight: 600 }}>
            University
          </label>
          <select
            id="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            style={{
              width: '100%',
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              padding: '11px 12px',
              fontFamily: SANS,
              fontSize: 14,
            }}
          >
            <option value="UAlberta">UAlberta</option>
          </select>
        </div>

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, background: C.bg, padding: '12px 12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="camera" size={16} color={C.green} />
            <span style={{ fontFamily: SANS, color: C.text, fontSize: 13, fontWeight: 700 }}>OneCard photo (optional)</span>
          </div>
          <p style={{ margin: '0 0 10px', fontFamily: SANS, color: C.textLight, fontSize: 12, lineHeight: 1.45 }}>
            We can prefill your name and student number from your card image. You can always edit manually.
          </p>
          <label
            htmlFor="onecard-upload"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 10,
              border: `1px solid ${C.green}`,
              color: C.green,
              padding: '8px 10px',
              cursor: 'pointer',
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 700,
              background: '#fff',
            }}
          >
            <Icon name="image" size={14} color={C.green} />
            Upload OneCard
          </label>
          <input id="onecard-upload" type="file" accept="image/*" onChange={onCardChange} style={{ display: 'none' }} />
          {cardFileName && (
            <p style={{ margin: '8px 0 0', fontFamily: SANS, fontSize: 11, color: C.textLight }}>
              Added: {cardFileName}
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="name" style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, fontWeight: 600 }}>
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: '#fff',
                color: C.text,
                padding: '11px 12px',
                fontFamily: SANS,
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="student-id" style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, fontWeight: 600 }}>
              Student number
            </label>
            <input
              id="student-id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. 1234567"
              style={{
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: '#fff',
                color: C.text,
                padding: '11px 12px',
                fontFamily: SANS,
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="program" style={{ fontFamily: SANS, fontSize: 12, color: C.textMid, fontWeight: 600 }}>
              Program (or confirm name/program details)
            </label>
            <input
              id="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g. BSc Computer Science"
              style={{
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: '#fff',
                color: C.text,
                padding: '11px 12px',
                fontFamily: SANS,
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {isDesktop && (
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${C.gold}`,
              background: C.goldLight,
              padding: '10px 11px',
              fontFamily: SANS,
              color: '#7d6220',
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            For the best experience, switch to mobile view or use your phone camera for OneCard capture.
          </div>
        )}
      </div>

      <div style={{ padding: '14px 20px 20px', borderTop: `1px solid ${C.border}` }}>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => onComplete({ university, name: name.trim(), studentId: studentId.trim(), program: program.trim() })}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 14,
            background: canContinue ? C.green : C.greenSoft,
            color: canContinue ? '#fff' : C.textLight,
            padding: '14px 16px',
            fontFamily: SANS,
            fontSize: 14,
            fontWeight: 700,
            cursor: canContinue ? 'pointer' : 'default',
          }}
        >
          Continue to Beartracks
        </button>
      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        height: '100%',
        maxHeight: 932,
        background: 'radial-gradient(circle at 20% 10%, #1d4930 0%, #0b1811 60%, #09110d 100%)',
        boxShadow: '0 40px 120px rgba(0,0,0,.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#b5c9bb', fontFamily: SANS, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          UAlberta x ColorStack
        </p>
        <h2 style={{ margin: '10px 0 8px', fontFamily: SERIF, color: 'white', fontSize: 34, letterSpacing: '-0.01em' }}>Beartracks AI</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,.72)', fontFamily: SANS, fontSize: 13 }}>Preparing your agentic workspace...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState('onboarding');
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    if (phase !== 'splash') return undefined;
    const timeoutId = setTimeout(() => setPhase('app'), SPLASH_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, [phase]);

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
      {phase === 'onboarding' && (
        <OnboardingGate
          onComplete={(profile) => {
            setStudentProfile(profile);
            setPhase('splash');
          }}
        />
      )}
      {phase === 'splash' && <SplashScreen />}
      {phase === 'app' && <BeartracksApp studentProfile={studentProfile} />}
    </div>
  );
}
