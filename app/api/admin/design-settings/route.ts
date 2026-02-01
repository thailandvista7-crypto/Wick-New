import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET - Fetch all design settings
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.designSetting.findMany();
    const result: Record<string, any> = {};

    settings.forEach((setting) => {
      try {
        result[setting.key] = JSON.parse(setting.value);
      } catch {
        result[setting.key] = setting.value;
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get design settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update design settings
export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    const setting = await prisma.designSetting.upsert({
      where: { key },
      update: {
        value: stringValue,
        description: description || null,
      },
      create: {
        key,
        value: stringValue,
        description: description || null,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Update design setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
