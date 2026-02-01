import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contents = await prisma.homepageContent.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Get homepage content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, title, subtitle, content, ctaText, ctaLink, enabled, order, metadata } = body;

    if (!section) {
      return NextResponse.json(
        { error: 'Section is required' },
        { status: 400 }
      );
    }

    const homepageContent = await prisma.homepageContent.upsert({
      where: { section },
      update: {
        title: title || null,
        subtitle: subtitle || null,
        content: content || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        enabled: enabled !== undefined ? enabled : true,
        order: order !== undefined ? order : 0,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      create: {
        section,
        title: title || null,
        subtitle: subtitle || null,
        content: content || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        enabled: enabled !== undefined ? enabled : true,
        order: order !== undefined ? order : 0,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json(homepageContent);
  } catch (error) {
    console.error('Create homepage content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, subtitle, content, ctaText, ctaLink, enabled, order, metadata } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const homepageContent = await prisma.homepageContent.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        content: content !== undefined ? content : undefined,
        ctaText: ctaText !== undefined ? ctaText : undefined,
        ctaLink: ctaLink !== undefined ? ctaLink : undefined,
        enabled: enabled !== undefined ? enabled : undefined,
        order: order !== undefined ? order : undefined,
        metadata: metadata !== undefined ? JSON.stringify(metadata) : undefined,
      },
    });

    return NextResponse.json(homepageContent);
  } catch (error) {
    console.error('Update homepage content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
