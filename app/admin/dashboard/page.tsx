import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

export default async function AdminDashboard() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      redirect('/admin/login');
      return null;
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      redirect('/admin/login');
      return null;
    }

  // Get stats
  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
  ]);

  const revenue = totalRevenue._sum.total || 0;

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-olive-900 mb-2">
            Dashboard
          </h1>
          <p className="text-olive-700">Welcome back, {user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olive-600 text-sm font-medium">Products</p>
                <p className="text-3xl font-bold text-olive-900 mt-2">
                  {totalProducts}
                </p>
              </div>
              <Package className="w-12 h-12 text-olive-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olive-600 text-sm font-medium">Orders</p>
                <p className="text-3xl font-bold text-olive-900 mt-2">
                  {totalOrders}
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-olive-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olive-600 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-olive-900 mt-2">
                  ${revenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-olive-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olive-600 text-sm font-medium">Customers</p>
                <p className="text-3xl font-bold text-olive-900 mt-2">
                  {totalCustomers}
                </p>
              </div>
              <Users className="w-12 h-12 text-olive-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/products"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <h3 className="text-xl font-semibold text-olive-900 mb-2">
              Manage Products
            </h3>
            <p className="text-olive-600">Add, edit, or remove products</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <h3 className="text-xl font-semibold text-olive-900 mb-2">
              View Orders
            </h3>
            <p className="text-olive-600">Manage and track orders</p>
          </Link>
          <Link
            href="/admin/coupons"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <h3 className="text-xl font-semibold text-olive-900 mb-2">
              Discount Codes
            </h3>
            <p className="text-olive-600">Create and manage coupons</p>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <h3 className="text-xl font-semibold text-olive-900 mb-2">
              Settings
            </h3>
            <p className="text-olive-600">Shipping rules & checkout settings</p>
          </Link>
        </div>

        {/* Design & Content Control */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-olive-900 mb-6">Design & Content</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/admin/design"
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
            >
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Branding & Design
              </h3>
              <p className="text-olive-600">Logo, colors, fonts, styles</p>
            </Link>
            <Link
              href="/admin/homepage"
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
            >
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Homepage Content
              </h3>
              <p className="text-olive-600">Manage homepage sections</p>
            </Link>
            <Link
              href="/admin/carousel"
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
            >
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Carousel Manager
              </h3>
              <p className="text-olive-600">Image carousel & slides</p>
            </Link>
            <Link
              href="/admin/content"
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
            >
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Text Editor
              </h3>
              <p className="text-olive-600">Edit static content & copy</p>
            </Link>
            <Link
              href="/admin/animations"
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
            >
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Animations
              </h3>
              <p className="text-olive-600">Control animations & interactions</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-olive-900 mb-6">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-olive-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-olive-900">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-olive-900">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-olive-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-olive-900">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-olive-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-olive-600">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-sm text-olive-600">{order.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-sm text-olive-900">{order.name}</td>
                    <td className="px-4 py-3 text-sm text-olive-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-olive-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-olive-100 text-olive-700 capitalize">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Dashboard error:', error);
    redirect('/admin/login');
    return null;
  }
}
