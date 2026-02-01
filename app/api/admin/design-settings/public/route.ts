import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public endpoint to fetch design settings for frontend
export async function GET() {
  try {
    const settings = await prisma.designSetting.findMany();
    const result: Record<string, any> = {};

    settings.forEach((setting) => {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(setting.value);
        result[setting.key] = parsed;
      } catch {
        // If not JSON, use as string (for boolean values stored as strings)
        result[setting.key] = setting.value;
      }
    });

    // Ensure we always return an object, even if empty
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Get public design settings error:', error);
    return NextResponse.json({}, { status: 200 }); // Return empty object on error
  }
}
