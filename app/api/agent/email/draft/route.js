import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const title = body?.title || 'Opportunity follow-up';
  const context = body?.context || 'I am interested and would like next steps.';

  return NextResponse.json({
    subject: `Interest in ${title}`,
    preview: `Hello, I am reaching out about ${title}. ${context}`,
    body: `Hello,\n\nI am reaching out about ${title}. ${context}\n\nThank you,\nStudent`,
  });
}
