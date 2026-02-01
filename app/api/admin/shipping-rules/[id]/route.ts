import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const rule = await prisma.shippingRule.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        value: body.value !== undefined ? body.value : null,
        freeThreshold: body.freeThreshold !== undefined ? body.freeThreshold : null,
        flatRate: body.flatRate !== undefined ? body.flatRate : null,
        active: body.active,
        priority: body.priority,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error('Update shipping rule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.shippingRule.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete shipping rule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
