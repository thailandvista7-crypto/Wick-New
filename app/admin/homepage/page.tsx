'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FullContextEditor from '@/components/admin/FullContextEditor';

interface HomepageSection {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  enabled: boolean;
  order: number;
  metadata: string | null;
}

export default function AdminHomepagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/admin/homepage-content', {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setSections(data.sort((a: HomepageSection, b: HomepageSection) => a.order - b.order));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingSection) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/homepage-content', {
        method: editingSection.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingSection),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      await fetchSections();
      setEditingSection(null);
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEnabled = async (section: HomepageSection) => {
    try {
      const response = await fetch('/api/admin/homepage-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...section, enabled: !section.enabled }),
      });

      if (response.ok) {
        await fetchSections();
      }
    } catch (error) {
      toast.error('Failed to toggle section');
    }
  };

  const handleEdit = (section: HomepageSection) => {
    setEditingSection(section);
  };

  const handleNew = () => {
    setEditingSection({
      id: '',
      section: '',
      title: null,
      subtitle: null,
      content: null,
      ctaText: null,
      ctaLink: null,
      enabled: true,
      order: sections.length,
      metadata: null,
    });
  };

  const handleDelete = async (section: HomepageSection) => {
    if (!confirm(`Are you sure you want to delete the "${section.section}" section?`)) {
      return;
    }

    try {
      // Note: You may need to add a DELETE endpoint
      toast.error('Delete functionality requires API endpoint');
    } catch (error) {
      toast.error('Failed to delete section');
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
              Homepage Content
            </h1>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Section
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Sections List */}
          {sections.map((section) => (
            <FullContextEditor
              key={section.id}
              title={`Section: ${section.section}`}
              description={`Edit the "${section.section}" homepage section. The full current content is shown below.`}
              viewContent={
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        section.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {section.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEnabled(section)}
                        className="p-2 text-olive-700 hover:bg-olive-100 rounded-lg transition-colors"
                        title={section.enabled ? 'Disable' : 'Enable'}
                      >
                        {section.enabled ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {section.title && (
                    <h2 className="text-3xl font-serif font-bold text-olive-900">
                      {section.title}
                    </h2>
                  )}
                  {section.subtitle && (
                    <p className="text-xl text-olive-700 font-medium">{section.subtitle}</p>
                  )}
                  {section.content && (
                    <div
                      className="prose prose-olive max-w-none text-olive-700"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                  {section.ctaText && section.ctaLink && (
                    <div className="pt-4">
                      <a
                        href={section.ctaLink}
                        className="inline-flex items-center px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
                      >
                        {section.ctaText}
                      </a>
                    </div>
                  )}
                  {!section.title && !section.subtitle && !section.content && (
                    <p className="text-olive-500 italic">No content set for this section</p>
                  )}
                </div>
              }
              editContent={
                <div className="space-y-6">
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">
                      Section Key *
                    </label>
                    <input
                      type="text"
                      value={section.section}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, section: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      placeholder="hero, featured, testimonials"
                      disabled={!!editingSection.id}
                    />
                    <p className="text-xs text-olive-500 mt-1">
                      {editingSection.id
                        ? 'Key cannot be changed after creation'
                        : 'Unique identifier for this section'}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={editingSection.title || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        placeholder="Section title"
                      />
                    </div>
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={editingSection.subtitle || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, subtitle: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        placeholder="Section subtitle"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Content (HTML)</label>
                    <textarea
                      value={editingSection.content || ''}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, content: e.target.value })
                      }
                      rows={8}
                      className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      placeholder="Enter HTML content for this section"
                    />
                    <p className="text-xs text-olive-500 mt-1">
                      HTML is supported. Use &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">CTA Text</label>
                      <input
                        type="text"
                        value={editingSection.ctaText || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, ctaText: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        placeholder="Button text"
                      />
                    </div>
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">CTA Link</label>
                      <input
                        type="text"
                        value={editingSection.ctaLink || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, ctaLink: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                        placeholder="/shop or /about"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingSection.enabled}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, enabled: e.target.checked })
                        }
                        className="w-4 h-4 text-olive-700"
                      />
                      <span className="text-olive-700">Enabled (visible on homepage)</span>
                    </label>
                  </div>
                </div>
              }
              onSave={handleSave}
              onCancel={() => setEditingSection(null)}
              isLoading={false}
              isSaving={isSaving}
              mode="side-by-side"
              showPreview={true}
            />
          ))}

          {/* New Section Form */}
          {editingSection && !editingSection.id && (
            <FullContextEditor
              title="New Homepage Section"
              description="Create a new section for your homepage. Fill in the details below."
              viewContent={
                <div className="p-4 bg-olive-50 rounded-lg border border-olive-200">
                  <p className="text-olive-600 italic">This is a new section. Preview will appear after you add content.</p>
                </div>
              }
              editContent={
                <div className="space-y-6">
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">
                      Section Key *
                    </label>
                    <input
                      type="text"
                      value={editingSection.section}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, section: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      placeholder="hero, featured, testimonials"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={editingSection.title || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      />
                    </div>
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={editingSection.subtitle || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, subtitle: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Content (HTML)</label>
                    <textarea
                      value={editingSection.content || ''}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, content: e.target.value })
                      }
                      rows={8}
                      className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">CTA Text</label>
                      <input
                        type="text"
                        value={editingSection.ctaText || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, ctaText: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      />
                    </div>
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">CTA Link</label>
                      <input
                        type="text"
                        value={editingSection.ctaLink || ''}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, ctaLink: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingSection.enabled}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, enabled: e.target.checked })
                        }
                        className="w-4 h-4 text-olive-700"
                      />
                      <span className="text-olive-700">Enabled</span>
                    </label>
                  </div>
                </div>
              }
              onSave={handleSave}
              onCancel={() => setEditingSection(null)}
              isLoading={false}
              isSaving={isSaving}
              mode="inline"
            />
          )}

          {sections.length === 0 && !editingSection && (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <p className="text-olive-600 mb-4">No sections yet</p>
              <button
                onClick={handleNew}
                className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
              >
                Create First Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
