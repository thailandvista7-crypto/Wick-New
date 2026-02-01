'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import FullContextEditor from '@/components/admin/FullContextEditor';
import RichTextEditor from '@/components/admin/RichTextEditor';
import toast from 'react-hot-toast';

interface StaticContent {
  id: string;
  key: string;
  title: string | null;
  content: string;
}

export default function AdminContentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<StaticContent[]>([]);
  const [editingContent, setEditingContent] = useState<StaticContent | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/admin/static-content', {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setContents(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching contents:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingContent) return;

    try {
      const response = await fetch('/api/admin/static-content', {
        method: editingContent.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingContent),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      await fetchContents();
      setEditingContent(null);
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (content: StaticContent) => {
    setEditingContent(content);
  };

  const handleNew = () => {
    setEditingContent({
      id: '',
      key: '',
      title: null,
      content: '',
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
              Text & Copy Editor
            </h1>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
            >
              <FileText className="w-5 h-5" />
              New Content
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Content List */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-olive-900 mb-4">Content Sections</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contents.map((content) => (
                <button
                  key={content.id}
                  onClick={() => handleEdit(content)}
                  className={`text-left px-4 py-3 rounded-lg transition-colors border-2 ${
                    editingContent?.id === content.id
                      ? 'bg-olive-100 text-olive-900 border-olive-700'
                      : 'bg-beige-50 text-olive-700 border-olive-200 hover:bg-olive-50'
                  }`}
                >
                  <div className="font-medium">{content.key}</div>
                  {content.title && (
                    <div className="text-sm text-olive-600 mt-1">{content.title}</div>
                  )}
                  <div className="text-xs text-olive-500 mt-2 line-clamp-2">
                    {content.content.replace(/<[^>]*>/g, '').substring(0, 60)}...
                  </div>
                </button>
              ))}
              {contents.length === 0 && (
                <p className="text-olive-600 text-sm col-span-full text-center py-8">
                  No content sections yet. Click "New Content" to create one.
                </p>
              )}
            </div>
          </div>

          {/* Full-Context Editor */}
          {editingContent && (
            <FullContextEditor
              title={editingContent.id ? `Editing: ${editingContent.key}` : 'New Content Section'}
              description={
                editingContent.id
                  ? 'Edit the content below. The current content is shown above for reference.'
                  : 'Create a new content section. Enter a unique key and content.'
              }
              viewContent={
                <div className="space-y-4">
                  {editingContent.title && (
                    <h3 className="text-2xl font-semibold text-olive-900">
                      {editingContent.title}
                    </h3>
                  )}
                  <div
                    className="prose prose-olive max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: editingContent.content || '<p class="text-olive-500 italic">No content yet</p>',
                    }}
                  />
                </div>
              }
              editContent={
                <div className="space-y-6">
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">
                      Content Key *
                    </label>
                    <input
                      type="text"
                      value={editingContent.key}
                      onChange={(e) =>
                        setEditingContent({ ...editingContent, key: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      placeholder="about, footer, privacy"
                      disabled={!!editingContent.id}
                    />
                    <p className="text-xs text-olive-500 mt-1">
                      {editingContent.id
                        ? 'Key cannot be changed after creation'
                        : 'Choose a unique identifier (e.g., "about", "footer", "privacy")'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">Title (Optional)</label>
                    <input
                      type="text"
                      value={editingContent.title || ''}
                      onChange={(e) =>
                        setEditingContent({ ...editingContent, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-olive-300 rounded-lg bg-white text-olive-900"
                      placeholder="Section title"
                    />
                  </div>
                  <RichTextEditor
                    value={editingContent.content}
                    onChange={(value) =>
                      setEditingContent({ ...editingContent, content: value })
                    }
                    rows={16}
                  />
                </div>
              }
              onSave={handleSave}
              onCancel={() => setEditingContent(null)}
              isLoading={false}
              isSaving={false}
              mode="side-by-side"
              showPreview={true}
            />
          )}

          {/* Empty State */}
          {!editingContent && contents.length === 0 && (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <FileText className="w-16 h-16 text-olive-400 mx-auto mb-4" />
              <p className="text-olive-600 mb-4">
                No content sections yet. Create your first content section to get started.
              </p>
              <button
                onClick={handleNew}
                className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
              >
                Create New Content
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
