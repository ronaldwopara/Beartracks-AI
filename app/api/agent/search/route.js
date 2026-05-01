import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const query = body?.query || 'student opportunity';

  return NextResponse.json({
    query,
    results: [
      {
        id: 'result-1',
        title: `${query} - alternative opening`,
        matchPercent: 90,
        url: 'https://www.ualberta.ca',
      },
      {
        id: 'result-2',
        title: `${query} - related scholarship`,
        matchPercent: 83,
        url: 'https://www.colorstack.org',
      },
    ],
  });
}
