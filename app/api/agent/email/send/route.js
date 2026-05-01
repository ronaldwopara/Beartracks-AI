import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const recipient = body?.recipient || 'advisor@ualberta.ca';
  const title = body?.title || 'Opportunity';

  return NextResponse.json({
    ok: true,
    recipient,
    title,
    message: `Queued email for ${title} to ${recipient}.`,
    queuedAt: new Date().toISOString(),
  });
}
