import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}    console.error('Get my orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
