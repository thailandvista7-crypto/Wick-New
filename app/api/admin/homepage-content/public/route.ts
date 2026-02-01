import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contents = await prisma.homepageContent.findMany({
      where: { enabled: true },
      orderBy: { order: 'asc' },
    });

    const result = contents.map((content) => ({
      ...content,
      metadata: content.metadata ? JSON.parse(content.metadata) : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get public homepage content error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
