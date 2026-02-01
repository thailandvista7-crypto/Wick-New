import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const slides = await prisma.carouselSlide.findMany({
      where: { enabled: true },
      orderBy: { order: 'asc' },
    });

    const settings = await prisma.carouselSetting.findMany();
    const settingsObj: Record<string, any> = {};

    settings.forEach((setting) => {
      try {
        settingsObj[setting.key] = JSON.parse(setting.value);
      } catch {
        settingsObj[setting.key] = setting.value;
      }
    });

    return NextResponse.json({ slides, settings: settingsObj });
  } catch (error) {
    console.error('Get public carousel error:', error);
    return NextResponse.json({ slides: [], settings: {} }, { status: 200 });
  }
}
