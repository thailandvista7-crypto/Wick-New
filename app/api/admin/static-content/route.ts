import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contents = await prisma.staticContent.findMany({
      orderBy: { key: 'asc' },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Get static content error:', error);
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
    const { key, title, content } = body;

    if (!key || !content) {
      return NextResponse.json(
        { error: 'Key and content are required' },
        { status: 400 }
      );
    }

    const staticContent = await prisma.staticContent.upsert({
      where: { key },
      update: {
        title: title || null,
        content,
      },
      create: {
        key,
        title: title || null,
        content,
      },
    });

    return NextResponse.json(staticContent);
  } catch (error) {
    console.error('Create static content error:', error);
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
    const { id, title, content } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const staticContent = await prisma.staticContent.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
      },
    });

    return NextResponse.json(staticContent);
  } catch (error) {
    console.error('Update static content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
