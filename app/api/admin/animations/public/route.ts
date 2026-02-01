import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.animationSetting.findMany();
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
    console.error('Get public animation settings error:', error);
    return NextResponse.json({}, { status: 200 });
  }
}
