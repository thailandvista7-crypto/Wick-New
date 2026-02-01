'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    expiresAt: '',
    active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons', {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load coupons');
      }

      const data = await response.json();
      setCoupons(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save coupon');
      }

      toast.success(editingCoupon ? 'Coupon updated' : 'Coupon created');
      setShowForm(false);
      setEditingCoupon(null);
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      active: coupon.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete coupon');
      }

      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...coupon,
          active: !coupon.active,
        }),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update coupon');
      }

      toast.success(`Coupon ${!coupon.active ? 'activated' : 'deactivated'}`);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      maxDiscount: '',
      expiresAt: '',
      active: true,
    });
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
            href="/admin/dashboard"
            className="inline-flex items-center text-olive-700 hover:text-olive-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-serif font-bold text-olive-900">
              Discount Codes
            </h1>
            <button
              onClick={() => {
                resetForm();
                setEditingCoupon(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Coupon
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    required
                    placeholder="SAVE20"
                  />
                </div>
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Value * ({formData.type === 'percentage' ? '%' : '$'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Minimum Purchase ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minPurchase}
                    onChange={(e) =>
                      setFormData({ ...formData, minPurchase: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Max Discount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDiscount: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Expires At
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="w-4 h-4 text-olive-700"
                  />
                  <span className="text-olive-700">Active</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
                >
                  {editingCoupon ? 'Update' : 'Create'} Coupon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCoupon(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-olive-100 text-olive-700 rounded-lg hover:bg-olive-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-olive-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Min Purchase
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Max Discount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive-100">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-olive-600">
                      No coupons yet. Create your first coupon!
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-beige-50">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-olive-900">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-olive-700 capitalize">
                        {coupon.type}
                      </td>
                      <td className="px-6 py-4 text-olive-900 font-semibold">
                        {coupon.type === 'percentage'
                          ? `${coupon.value}%`
                          : `$${coupon.value.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 text-olive-600">
                        {coupon.minPurchase
                          ? `$${coupon.minPurchase.toFixed(2)}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-olive-600">
                        {coupon.maxDiscount
                          ? `$${coupon.maxDiscount.toFixed(2)}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-olive-600">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(coupon)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            coupon.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {coupon.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="p-2 text-olive-700 hover:bg-olive-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
}
