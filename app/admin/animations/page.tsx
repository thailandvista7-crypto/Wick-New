'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Zap, MousePointerClick } from 'lucide-react';
import toast from 'react-hot-toast';

interface AnimationSettings {
  enabled?: boolean;
  style?: string;
  buttonHover?: string;
  cardHover?: string;
  pageTransition?: string;
  respectReducedMotion?: boolean;
}

export default function AdminAnimationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<AnimationSettings>({
    enabled: true,
    style: 'fade',
    buttonHover: 'lift',
    cardHover: 'lift',
    pageTransition: 'fade',
    respectReducedMotion: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/animations', {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = [
        { key: 'enabled', value: settings.enabled ?? true },
        { key: 'style', value: settings.style || 'fade' },
        { key: 'buttonHover', value: settings.buttonHover || 'lift' },
        { key: 'cardHover', value: settings.cardHover || 'lift' },
        { key: 'pageTransition', value: settings.pageTransition || 'fade' },
        { key: 'respectReducedMotion', value: settings.respectReducedMotion ?? true },
      ];

      const promises = settingsToSave.map(({ key, value }) =>
        fetch('/api/admin/animations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ key, value }),
        })
      );

      await Promise.all(promises);
      toast.success('Animation settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
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
            href="/admin/dashboard"
            className="inline-flex items-center text-olive-700 hover:text-olive-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-serif font-bold text-olive-900">
              Animations & Interactions
            </h1>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Global Animation Toggle */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Global Animation Settings
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.enabled ?? true}
                  onChange={(e) =>
                    setSettings({ ...settings, enabled: e.target.checked })
                  }
                  className="w-5 h-5 text-olive-700"
                />
                <span className="text-olive-700">Enable Animations Globally</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.respectReducedMotion ?? true}
                  onChange={(e) =>
                    setSettings({ ...settings, respectReducedMotion: e.target.checked })
                  }
                  className="w-5 h-5 text-olive-700"
                />
                <span className="text-olive-700">
                  Respect prefers-reduced-motion (Accessibility)
                </span>
              </label>
            </div>
          </div>

          {/* Animation Style */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6">Animation Style</h2>
            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Default Animation Style
              </label>
              <select
                value={settings.style || 'fade'}
                onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="scale">Scale</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Button Hover Effects */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6 flex items-center gap-2">
              <MousePointerClick className="w-6 h-6" />
              Button Hover Effects
            </h2>
            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Hover Effect Style
              </label>
              <select
                value={settings.buttonHover || 'lift'}
                onChange={(e) => setSettings({ ...settings, buttonHover: e.target.value })}
                className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
              >
                <option value="lift">Lift (translate up)</option>
                <option value="glow">Glow (shadow effect)</option>
                <option value="ripple">Ripple (scale effect)</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Card Hover Effects */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6">Card Hover Effects</h2>
            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Hover Effect Style
              </label>
              <select
                value={settings.cardHover || 'lift'}
                onChange={(e) => setSettings({ ...settings, cardHover: e.target.value })}
                className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
              >
                <option value="lift">Lift (translate up)</option>
                <option value="scale">Scale (zoom in)</option>
                <option value="glow">Glow (shadow effect)</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Page Transitions */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6">Page Transitions</h2>
            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Transition Style
              </label>
              <select
                value={settings.pageTransition || 'fade'}
                onChange={(e) => setSettings({ ...settings, pageTransition: e.target.value })}
                className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="scale">Scale</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
