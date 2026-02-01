import { NextResponse } from 'next/server';

// Endpoint to trigger a refresh of design settings on the frontend
export async function POST() {
  return NextResponse.json({ success: true, message: 'Settings refresh triggered' });
}
