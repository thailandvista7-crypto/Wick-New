import Link from 'next/link';
import { Order } from '@prisma/client';

interface RecentOrdersProps {
  orders: (Order & {
    items: Array<{
      product: { name: string };
      quantity: number;
      price: number;
    }>;
  })[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return <p className="text-olive-600">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-olive-200">
            <th className="text-left py-3 px-4 text-olive-700 font-semibold">
              Order ID
            </th>
            <th className="text-left py-3 px-4 text-olive-700 font-semibold">
              Customer
            </th>
            <th className="text-left py-3 px-4 text-olive-700 font-semibold">
              Items
            </th>
            <th className="text-left py-3 px-4 text-olive-700 font-semibold">
              Total
            </th>
            <th className="text-left py-3 px-4 text-olive-700 font-semibold">
              Status
            </th>
            <th className="text-left py-3 px-4 text-olive-700 font-semibold">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-olive-100 hover:bg-olive-50 transition-colors"
            >
              <td className="py-3 px-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-olive-700 hover:text-olive-900 font-medium"
                >
                  {order.id.slice(0, 8)}...
                </Link>
              </td>
              <td className="py-3 px-4 text-olive-700">{order.name}</td>
              <td className="py-3 px-4 text-olive-700">
                {order.items.length} item(s)
              </td>
              <td className="py-3 px-4 text-olive-900 font-semibold">
                ${order.total.toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'processing'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'shipped'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-4 text-olive-600 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
