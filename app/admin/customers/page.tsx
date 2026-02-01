'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication via API since cookie is httpOnly
    fetchCustomers();
  }, [router]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers', {
        credentials: 'include',
      });
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to load customers');
      }
      
      const data = await response.json();
      setCustomers(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-olive-700 hover:text-olive-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-serif font-bold text-olive-900">
            Customers
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-olive-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Member Since
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-beige-50">
                    <td className="px-6 py-4 font-semibold text-olive-900">
                      {customer.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-olive-700">{customer.email}</td>
                    <td className="px-6 py-4 text-olive-600">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
