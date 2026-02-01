import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const content = await prisma.staticContent.findUnique({
        where: { key },
      });
      return NextResponse.json(content || null);
    }

    const contents = await prisma.staticContent.findMany();
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Get public static content error:', error);
    return NextResponse.json(null, { status: 200 });
  }
}
