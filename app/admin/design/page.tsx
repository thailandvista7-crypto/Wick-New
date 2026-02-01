'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Palette, Type, Settings, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import FullContextEditor from '@/components/admin/FullContextEditor';
import DesignPreview from '@/components/admin/DesignPreview';

interface DesignSettings {
  logo?: {
    light?: string;
    dark?: string;
  };
  favicon?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    primary?: string;
    secondary?: string;
  };
  roundedCorners?: boolean;
  softShadows?: boolean;
}

export default function AdminDesignPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<DesignSettings>({
    colors: {
      primary: '#7d8c5a',
      secondary: '#b8860b',
      accent: '#d4af37',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'serif',
    },
    roundedCorners: true,
    softShadows: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/design-settings', {
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
        { key: 'logo', value: settings.logo || {} },
        { key: 'favicon', value: settings.favicon || '' },
        { key: 'colors', value: settings.colors || {} },
        { key: 'fonts', value: settings.fonts || {} },
        { key: 'roundedCorners', value: settings.roundedCorners ?? true },
        { key: 'softShadows', value: settings.softShadows ?? true },
      ];

      const promises = settingsToSave.map(({ key, value }) =>
        fetch('/api/admin/design-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ key, value }),
        })
      );

      await Promise.all(promises);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('theme-settings-updated'));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (type: 'logoLight' | 'logoDark' | 'favicon', file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url;

      if (type === 'favicon') {
        setSettings((prev) => ({ ...prev, favicon: imageUrl }));
      } else {
        setSettings((prev) => ({
          ...prev,
          logo: {
            ...prev.logo,
            [type === 'logoLight' ? 'light' : 'dark']: imageUrl,
          },
        }));
      }
    } catch (error) {
      toast.error('Failed to upload image');
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
              Design & Branding
            </h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* Logo Settings with Preview */}
          <FullContextEditor
            title="Logo & Favicon"
            description="Upload and manage your brand logos. Changes are previewed in real-time."
            viewContent={
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-olive-700 mb-2">Light Logo</p>
                    {settings.logo?.light ? (
                      <img
                        src={settings.logo.light}
                        alt="Light logo"
                        className="max-h-20 mx-auto"
                      />
                    ) : (
                      <div className="h-20 flex items-center justify-center border-2 border-dashed border-olive-300 rounded-lg">
                        <ImageIcon className="w-8 h-8 text-olive-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-olive-700 mb-2">Dark Logo</p>
                    {settings.logo?.dark ? (
                      <img
                        src={settings.logo.dark}
                        alt="Dark logo"
                        className="max-h-20 mx-auto"
                      />
                    ) : (
                      <div className="h-20 flex items-center justify-center border-2 border-dashed border-olive-300 rounded-lg">
                        <ImageIcon className="w-8 h-8 text-olive-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-olive-700 mb-2">Favicon</p>
                    {settings.favicon ? (
                      <img
                        src={settings.favicon}
                        alt="Favicon"
                        className="w-16 h-16 mx-auto"
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto flex items-center justify-center border-2 border-dashed border-olive-300 rounded-lg">
                        <ImageIcon className="w-6 h-6 text-olive-400" />
                      </div>
                    )}
                  </div>
                </div>
                {/* Header Preview */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-olive-200">
                  <p className="text-xs font-semibold text-olive-700 mb-2">Header Preview:</p>
                  <div className="flex items-center justify-between p-3 bg-beige-50 rounded">
                    {settings.logo?.light ? (
                      <img src={settings.logo.light} alt="Logo" className="h-8" />
                    ) : (
                      <span className="text-olive-700 font-bold">Wick & Lather</span>
                    )}
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-olive-700 text-white rounded text-sm">
                        Shop
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
            editContent={
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Light Logo</label>
                    <div className="border-2 border-dashed border-olive-300 rounded-lg p-4 text-center">
                      {settings.logo?.light ? (
                        <img
                          src={settings.logo.light}
                          alt="Light logo"
                          className="max-h-20 mx-auto mb-2"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-olive-400 mx-auto mb-2" />
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('logoLight', file);
                          }}
                        />
                        <span className="text-sm text-olive-600 hover:text-olive-700">
                          {settings.logo?.light ? 'Change' : 'Upload'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Dark Logo</label>
                    <div className="border-2 border-dashed border-olive-300 rounded-lg p-4 text-center">
                      {settings.logo?.dark ? (
                        <img
                          src={settings.logo.dark}
                          alt="Dark logo"
                          className="max-h-20 mx-auto mb-2"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-olive-400 mx-auto mb-2" />
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('logoDark', file);
                          }}
                        />
                        <span className="text-sm text-olive-600 hover:text-olive-700">
                          {settings.logo?.dark ? 'Change' : 'Upload'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Favicon</label>
                    <div className="border-2 border-dashed border-olive-300 rounded-lg p-4 text-center">
                      {settings.favicon ? (
                        <img
                          src={settings.favicon}
                          alt="Favicon"
                          className="w-16 h-16 mx-auto mb-2"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-olive-400 mx-auto mb-2" />
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('favicon', file);
                          }}
                        />
                        <span className="text-sm text-olive-600 hover:text-olive-700">
                          {settings.favicon ? 'Change' : 'Upload'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            }
            onSave={handleSave}
            isLoading={false}
            isSaving={isSaving}
            mode="inline"
          />

          {/* Color Settings with Live Preview */}
          <FullContextEditor
            title="Brand Colors"
            description="Set your brand colors. Changes are previewed in real-time on UI components."
            viewContent={
              <DesignPreview settings={settings}>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div
                        className="h-20 rounded-lg mb-2"
                        style={{ backgroundColor: settings.colors?.primary || '#7d8c5a' }}
                      />
                      <p className="text-sm font-medium text-olive-700">Primary</p>
                      <p className="text-xs text-olive-600">{settings.colors?.primary || '#7d8c5a'}</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="h-20 rounded-lg mb-2"
                        style={{ backgroundColor: settings.colors?.secondary || '#b8860b' }}
                      />
                      <p className="text-sm font-medium text-olive-700">Secondary</p>
                      <p className="text-xs text-olive-600">{settings.colors?.secondary || '#b8860b'}</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="h-20 rounded-lg mb-2"
                        style={{ backgroundColor: settings.colors?.accent || '#d4af37' }}
                      />
                      <p className="text-sm font-medium text-olive-700">Accent</p>
                      <p className="text-xs text-olive-600">{settings.colors?.accent || '#d4af37'}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white rounded-lg border border-olive-200">
                    <p className="text-xs font-semibold text-olive-700 mb-3">Color Preview on UI:</p>
                    <div className="space-y-2">
                      <button
                        className="w-full px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: settings.colors?.primary || '#7d8c5a' }}
                      >
                        Primary Button
                      </button>
                      <div
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: settings.colors?.secondary || '#b8860b' }}
                      >
                        Secondary Element
                      </div>
                      <div
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: settings.colors?.accent || '#d4af37' }}
                      >
                        Accent Element
                      </div>
                    </div>
                  </div>
                </div>
              </DesignPreview>
            }
            editContent={
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.colors?.primary || '#7d8c5a'}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            colors: {
                              ...prev.colors,
                              primary: e.target.value,
                            },
                          }))
                        }
                        className="w-16 h-10 rounded border border-olive-300"
                      />
                      <input
                        type="text"
                        value={settings.colors?.primary || '#7d8c5a'}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            colors: {
                              ...prev.colors,
                              primary: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        placeholder="#7d8c5a"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Secondary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.colors?.secondary || '#b8860b'}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            colors: {
                              ...prev.colors,
                              secondary: e.target.value,
                            },
                          }))
                        }
                        className="w-16 h-10 rounded border border-olive-300"
                      />
                      <input
                        type="text"
                        value={settings.colors?.secondary || '#b8860b'}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            colors: {
                              ...prev.colors,
                              secondary: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        placeholder="#b8860b"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.colors?.accent || '#d4af37'}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            colors: {
                              ...prev.colors,
                              accent: e.target.value,
                            },
                          }))
                        }
                        className="w-16 h-10 rounded border border-olive-300"
                      />
                      <input
                        type="text"
                        value={settings.colors?.accent || '#d4af37'}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            colors: {
                              ...prev.colors,
                              accent: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        placeholder="#d4af37"
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
            onSave={handleSave}
            isLoading={false}
            isSaving={isSaving}
            mode="side-by-side"
            showPreview={true}
          />

          {/* Font Settings */}
          <FullContextEditor
            title="Typography"
            description="Choose fonts for body text and headings. Preview shows how they appear."
            viewContent={
              <DesignPreview settings={settings}>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-olive-700 mb-2">Primary Font (Body):</p>
                    <p style={{ fontFamily: settings.fonts?.primary || 'Inter' }}>
                      This is how body text appears with {settings.fonts?.primary || 'Inter'} font.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-olive-700 mb-2">Secondary Font (Headings):</p>
                    <h2 style={{ fontFamily: settings.fonts?.secondary || 'serif' }}>
                      This is a Heading with {settings.fonts?.secondary || 'serif'} Font
                    </h2>
                  </div>
                </div>
              </DesignPreview>
            }
            editContent={
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Primary Font (Body)
                  </label>
                  <select
                    value={settings.fonts?.primary || 'Inter'}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        fonts: {
                          ...prev.fonts,
                          primary: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-olive-700 font-medium mb-2">
                    Secondary Font (Headings)
                  </label>
                  <select
                    value={settings.fonts?.secondary || 'serif'}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        fonts: {
                          ...prev.fonts,
                          secondary: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                  >
                    <option value="serif">Serif</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Lora">Lora</option>
                    <option value="Crimson Text">Crimson Text</option>
                  </select>
                </div>
              </div>
            }
            onSave={handleSave}
            isLoading={false}
            isSaving={isSaving}
            mode="side-by-side"
            showPreview={true}
          />

          {/* Style Preferences */}
          <FullContextEditor
            title="Style Preferences"
            description="Toggle rounded corners and soft shadows. See the effect in the preview."
            viewContent={
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 bg-olive-100 ${settings.roundedCorners ? 'rounded-lg' : ''} ${settings.softShadows ? 'shadow-soft' : ''}`}>
                    <p className="text-sm font-medium text-olive-900">Card Example</p>
                    <p className="text-xs text-olive-600 mt-1">
                      Rounded Corners: {settings.roundedCorners ? 'Enabled' : 'Disabled'}
                    </p>
                    <p className="text-xs text-olive-600">
                      Soft Shadows: {settings.softShadows ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className={`p-4 bg-amber-100 ${settings.roundedCorners ? 'rounded-lg' : ''} ${settings.softShadows ? 'shadow-soft' : ''}`}>
                    <p className="text-sm font-medium text-amber-900">Button Example</p>
                    <button
                      className={`mt-2 px-4 py-2 bg-olive-700 text-white ${settings.roundedCorners ? 'rounded-lg' : ''} ${settings.softShadows ? 'shadow-soft' : ''}`}
                    >
                      Click Me
                    </button>
                  </div>
                </div>
              </div>
            }
            editContent={
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.roundedCorners ?? true}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        roundedCorners: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-olive-700"
                  />
                  <span className="text-olive-700">Enable Rounded Corners</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.softShadows ?? true}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        softShadows: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-olive-700"
                  />
                  <span className="text-olive-700">Enable Soft Shadows</span>
                </label>
              </div>
            }
            onSave={handleSave}
            isLoading={false}
            isSaving={isSaving}
            mode="side-by-side"
            showPreview={true}
          />
        </div>
      </div>
    </div>
  );
}
