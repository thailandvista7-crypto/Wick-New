'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Truck, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShippingRule {
  id: string;
  name: string;
  type: string;
  value: number | null;
  freeThreshold: number | null;
  flatRate: number | null;
  active: boolean;
  priority: number;
}

interface CheckoutSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'shipping' | 'checkout'>('shipping');
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
  const [checkoutSettings, setCheckoutSettings] = useState<CheckoutSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [editingRule, setEditingRule] = useState<ShippingRule | null>(null);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    type: 'free_threshold',
    value: '',
    freeThreshold: '',
    flatRate: '',
    active: true,
    priority: '0',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shippingRes, checkoutRes] = await Promise.all([
        fetch('/api/admin/shipping-rules', { credentials: 'include' }),
        fetch('/api/admin/checkout-settings', { credentials: 'include' }),
      ]);

      if (shippingRes.status === 401 || checkoutRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (shippingRes.ok) {
        const shippingData = await shippingRes.json();
        setShippingRules(shippingData);
      }

      if (checkoutRes.ok) {
        const checkoutData = await checkoutRes.json();
        setCheckoutSettings(checkoutData);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setIsLoading(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRule
        ? `/api/admin/shipping-rules/${editingRule.id}`
        : '/api/admin/shipping-rules';
      const method = editingRule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...shippingForm,
          value: shippingForm.value ? parseFloat(shippingForm.value) : null,
          freeThreshold: shippingForm.freeThreshold
            ? parseFloat(shippingForm.freeThreshold)
            : null,
          flatRate: shippingForm.flatRate ? parseFloat(shippingForm.flatRate) : null,
          priority: parseInt(shippingForm.priority),
        }),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save shipping rule');
      }

      toast.success(editingRule ? 'Shipping rule updated' : 'Shipping rule created');
      setShowShippingForm(false);
      setEditingRule(null);
      resetShippingForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save shipping rule');
    }
  };

  const updateCheckoutSetting = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/admin/checkout-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key, value }),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      toast.success('Setting updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update setting');
    }
  };

  const resetShippingForm = () => {
    setShippingForm({
      name: '',
      type: 'free_threshold',
      value: '',
      freeThreshold: '',
      flatRate: '',
      active: true,
      priority: '0',
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
          <h1 className="text-4xl font-serif font-bold text-olive-900">
            Settings
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-olive-200">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'shipping'
                ? 'border-olive-700 text-olive-900'
                : 'border-transparent text-olive-600 hover:text-olive-700'
            }`}
          >
            <Truck className="w-5 h-5 inline mr-2" />
            Shipping Rules
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'checkout'
                ? 'border-olive-700 text-olive-900'
                : 'border-transparent text-olive-600 hover:text-olive-700'
            }`}
          >
            <CreditCard className="w-5 h-5 inline mr-2" />
            Checkout Settings
          </button>
        </div>

        {/* Shipping Rules Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-olive-900">Shipping Rules</h2>
              <button
                onClick={() => {
                  resetShippingForm();
                  setEditingRule(null);
                  setShowShippingForm(true);
                }}
                className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
              >
                + New Rule
              </button>
            </div>

            {showShippingForm && (
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h3 className="text-xl font-semibold text-olive-900 mb-6">
                  {editingRule ? 'Edit Shipping Rule' : 'Create Shipping Rule'}
                </h3>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={shippingForm.name}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">Type *</label>
                      <select
                        value={shippingForm.type}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, type: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      >
                        <option value="free_threshold">Free Shipping Threshold</option>
                        <option value="flat_rate">Flat Rate</option>
                        <option value="weight_based">Weight Based</option>
                        <option value="zone_based">Zone Based</option>
                      </select>
                    </div>
                    {shippingForm.type === 'free_threshold' && (
                      <div>
                        <label className="block text-olive-700 font-medium mb-2">
                          Free Shipping Threshold ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={shippingForm.freeThreshold}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, freeThreshold: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        />
                      </div>
                    )}
                    {shippingForm.type === 'flat_rate' && (
                      <div>
                        <label className="block text-olive-700 font-medium mb-2">
                          Flat Rate ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={shippingForm.flatRate}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, flatRate: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">Priority</label>
                      <input
                        type="number"
                        value={shippingForm.priority}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, priority: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      />
                      <p className="text-sm text-olive-600 mt-1">
                        Higher priority rules are checked first
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={shippingForm.active}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, active: e.target.checked })
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
                      {editingRule ? 'Update' : 'Create'} Rule
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowShippingForm(false);
                        setEditingRule(null);
                        resetShippingForm();
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
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                        Value
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive-100">
                    {shippingRules.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-olive-600">
                          No shipping rules yet
                        </td>
                      </tr>
                    ) : (
                      shippingRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-beige-50">
                          <td className="px-6 py-4 font-semibold text-olive-900">
                            {rule.name}
                          </td>
                          <td className="px-6 py-4 text-olive-700 capitalize">
                            {rule.type.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 text-olive-600">
                            {rule.freeThreshold
                              ? `Free over $${rule.freeThreshold}`
                              : rule.flatRate
                              ? `$${rule.flatRate}`
                              : '-'}
                          </td>
                          <td className="px-6 py-4 text-olive-600">{rule.priority}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                rule.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {rule.active ? 'Active' : 'Inactive'}
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
        )}

        {/* Checkout Settings Tab */}
        {activeTab === 'checkout' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-olive-900">Checkout Settings</h2>
            <div className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Free Shipping Threshold ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={
                    checkoutSettings.find((s) => s.key === 'freeShippingThreshold')?.value || '60'
                  }
                  onBlur={(e) =>
                    updateCheckoutSetting('freeShippingThreshold', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                />
                <p className="text-sm text-olive-600 mt-1">
                  Orders above this amount qualify for free shipping
                </p>
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Default Shipping Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={
                    checkoutSettings.find((s) => s.key === 'defaultShippingRate')?.value || '5.99'
                  }
                  onBlur={(e) =>
                    updateCheckoutSetting('defaultShippingRate', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                />
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={
                    checkoutSettings.find((s) => s.key === 'taxRate')?.value || '0'
                  }
                  onBlur={(e) => updateCheckoutSetting('taxRate', e.target.value)}
                  className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
