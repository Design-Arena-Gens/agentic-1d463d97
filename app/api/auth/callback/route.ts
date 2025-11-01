import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  // In production, exchange code for tokens and store them
  // This is a placeholder for Google OAuth callback

  return NextResponse.redirect(new URL('/', request.url));
}
