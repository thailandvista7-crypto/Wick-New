'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Image as ImageIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CarouselSlide {
  id: string;
  imageUrl: string;
  caption: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  order: number;
  enabled: boolean;
}

interface CarouselSettings {
  autoplay?: boolean;
  speed?: number;
  transition?: string;
}

export default function AdminCarouselPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [settings, setSettings] = useState<CarouselSettings>({
    autoplay: true,
    speed: 5000,
    transition: 'fade',
  });
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slidesRes, settingsRes] = await Promise.all([
        fetch('/api/admin/carousel', { credentials: 'include' }),
        fetch('/api/admin/carousel/settings', { credentials: 'include' }),
      ]);

      if (slidesRes.status === 401 || settingsRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (slidesRes.ok) {
        const slidesData = await slidesRes.json();
        setSlides(slidesData);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData && Object.keys(settingsData).length > 0) {
          setSettings((prev) => ({ ...prev, ...settingsData }));
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleSaveSlide = async (slide: CarouselSlide) => {
    try {
      const response = await fetch('/api/admin/carousel', {
        method: slide.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(slide),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      toast.success('Slide saved successfully');
      setShowForm(false);
      setEditingSlide(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save slide');
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/admin/carousel?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Slide deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/admin/carousel/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ key, value }),
        })
      );

      await Promise.all(promises);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'carousel');

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
      if (editingSlide) {
        setEditingSlide({ ...editingSlide, imageUrl: data.url });
      }
      toast.success('Image uploaded successfully');
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
              Carousel Manager
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-6 py-3 bg-olive-100 text-olive-700 rounded-lg hover:bg-olive-200 transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={() => {
                  setEditingSlide({
                    id: '',
                    imageUrl: '',
                    caption: null,
                    ctaText: null,
                    ctaLink: null,
                    order: slides.length,
                    enabled: true,
                  });
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Slide
              </button>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6">Carousel Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.autoplay ?? true}
                    onChange={(e) =>
                      setSettings({ ...settings, autoplay: e.target.checked })
                    }
                    className="w-5 h-5 text-olive-700"
                  />
                  <span className="text-olive-700">Enable Autoplay</span>
                </label>
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Transition Speed (ms)
                </label>
                <input
                  type="number"
                  value={settings.speed || 5000}
                  onChange={(e) =>
                    setSettings({ ...settings, speed: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                  min="1000"
                  step="500"
                />
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Transition Type
                </label>
                <select
                  value={settings.transition || 'fade'}
                  onChange={(e) =>
                    setSettings({ ...settings, transition: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="scale">Scale</option>
                </select>
              </div>
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {showForm && editingSlide && (
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-6">
              {editingSlide.id ? 'Edit Slide' : 'New Slide'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-olive-700 font-medium mb-2">Image</label>
                <div className="border-2 border-dashed border-olive-300 rounded-lg p-4">
                  {editingSlide.imageUrl ? (
                    <img
                      src={editingSlide.imageUrl}
                      alt="Slide"
                      className="max-h-48 mx-auto mb-2"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-olive-400 mx-auto mb-2" />
                  )}
                  <label className="cursor-pointer block text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    <span className="text-sm text-olive-600 hover:text-olive-700">
                      {editingSlide.imageUrl ? 'Change Image' : 'Upload Image'}
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">Caption</label>
                <input
                  type="text"
                  value={editingSlide.caption || ''}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, caption: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-olive-700 font-medium mb-2">CTA Text</label>
                  <input
                    type="text"
                    value={editingSlide.ctaText || ''}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaText: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                  />
                </div>
                <div>
                  <label className="block text-olive-700 font-medium mb-2">CTA Link</label>
                  <input
                    type="text"
                    value={editingSlide.ctaLink || ''}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaLink: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingSlide.enabled}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, enabled: e.target.checked })
                    }
                    className="w-4 h-4 text-olive-700"
                  />
                  <span className="text-olive-700">Enabled</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleSaveSlide(editingSlide)}
                  disabled={!editingSlide.imageUrl}
                  className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingSlide(null);
                  }}
                  className="px-6 py-3 bg-olive-100 text-olive-700 rounded-lg hover:bg-olive-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-2xl shadow-soft p-6 flex items-center gap-6"
            >
              <GripVertical className="w-5 h-5 text-olive-400 cursor-move" />
              <img
                src={slide.imageUrl}
                alt={slide.caption || 'Slide'}
                className="w-32 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-olive-900">
                  {slide.caption || 'Untitled Slide'}
                </h3>
                {slide.ctaText && (
                  <p className="text-sm text-olive-600">CTA: {slide.ctaText}</p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  slide.enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {slide.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleSaveSlide({ ...slide, enabled: !slide.enabled })
                  }
                  className="p-2 text-olive-700 hover:bg-olive-100 rounded-lg transition-colors"
                >
                  {slide.enabled ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingSlide(slide);
                    setShowForm(true);
                  }}
                  className="p-2 text-olive-700 hover:bg-olive-100 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <p className="text-olive-600 mb-4">No slides yet</p>
              <button
                onClick={() => {
                  setEditingSlide({
                    id: '',
                    imageUrl: '',
                    caption: null,
                    ctaText: null,
                    ctaLink: null,
                    order: 0,
                    enabled: true,
                  });
                  setShowForm(true);
                }}
                className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
              >
                Create First Slide
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
