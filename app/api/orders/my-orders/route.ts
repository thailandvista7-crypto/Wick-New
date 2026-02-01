import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth"; 

export async function GET() {
  try {
    // 1. Get the authenticated user using the v5 helper
    const userSession = await getAuthUser();

    // 2. If no user or email is found, return 401 Unauthorized
    if (!userSession?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' }, 
        { status: 401 }
      );
    }

    // 3. Find the user in the database
    // We fetch by email to get the internal DB user ID
    const dbUser = await prisma.user.findUnique({
      where: { email: userSession.email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User account not found in database' }, 
        { status: 404 }
      );
    }

    // 4. Fetch orders belonging to this user
    const orders = await prisma.order.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // 5. Return the list of orders
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Get my orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
            product: {
              select: {
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // 5. Return the list of orders
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Get my orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
        },
      },
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
