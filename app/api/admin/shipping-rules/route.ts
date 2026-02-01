import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rules = await prisma.shippingRule.findMany({
      orderBy: { priority: 'desc' },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error('Get shipping rules error:', error);
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
    const { name, type, value, freeThreshold, flatRate, active, priority } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const rule = await prisma.shippingRule.create({
      data: {
        name,
        type,
        value: value || null,
        freeThreshold: freeThreshold || null,
        flatRate: flatRate || null,
        active: active !== undefined ? active : true,
        priority: priority || 0,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error('Create shipping rule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
