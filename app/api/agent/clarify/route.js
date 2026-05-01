import { NextResponse } from 'next/server';

const CLARIFY_STEPS = {
  milestone: [
    { key: 'metricCurrent', question: 'What are your current metrics (applications, emails, replies)?' },
    { key: 'nextGoal', question: 'What next goal should we target this week?' },
  ],
  opportunity: [
    { key: 'deadline', question: 'What is the deadline/date for this opportunity?' },
    { key: 'action', question: 'Should I prioritize application, email outreach, or signup?' },
  ],
  event: [
    { key: 'date', question: 'What date is this event happening?' },
    { key: 'location', question: 'What is the location or link for this event?' },
  ],
};

export async function POST(request) {
  const body = await request.json();
  const type = body?.type || 'event';
  const step = Number(body?.step || 0);
  const queue = CLARIFY_STEPS[type] || CLARIFY_STEPS.event;
  const next = queue[step] || null;

  return NextResponse.json({
    next,
    done: !next,
  });
}
