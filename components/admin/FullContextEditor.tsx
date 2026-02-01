'use client';

import { useState, ReactNode } from 'react';
import { Edit2, Eye, X, Save, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface FullContextEditorProps {
  title: string;
  description?: string;
  viewContent: ReactNode; // Full content as users see it
  editContent: ReactNode; // Editor form
  onSave: () => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  mode?: 'inline' | 'side-by-side'; // Inline editing or side-by-side preview
  showPreview?: boolean; // Show preview in edit mode
}

export default function FullContextEditor({
  title,
  description,
  viewContent,
  editContent,
  onSave,
  onCancel,
  isLoading = false,
  isSaving = false,
  mode = 'inline',
  showPreview = true,
}: FullContextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }
    setIsEditing(false);
    setHasChanges(false);
    onCancel?.();
  };

  const handleSave = async () => {
    try {
      await onSave();
      setIsEditing(false);
      setHasChanges(false);
      toast.success('Changes saved successfully');
    } catch (error) {
      toast.error('Failed to save changes');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700 mx-auto"></div>
      </div>
    );
  }

  if (!isEditing) {
    // View Mode - Show full content
    return (
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-olive-900 mb-2">{title}</h2>
            {description && (
              <p className="text-olive-600 text-sm">{description}</p>
            )}
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
        
        {/* Full Content Preview */}
        <div className="border border-olive-200 rounded-lg p-6 bg-beige-50">
          {viewContent}
        </div>
      </div>
    );
  }

  // Edit Mode
  if (mode === 'side-by-side' && showPreview) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-olive-900 mb-2">Editing: {title}</h2>
            {description && (
              <p className="text-olive-600 text-sm">{description}</p>
            )}
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-olive-600 hover:text-olive-700 hover:bg-olive-50 rounded-lg transition-colors"
            title="Cancel editing"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-4">
            <div className="bg-olive-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-olive-900 mb-2">Editor</h3>
              <p className="text-sm text-olive-600">Make your changes below</p>
            </div>
            <div onChange={() => setHasChanges(true)}>
              {editContent}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </h3>
              <p className="text-sm text-blue-600">This is how it will appear to users</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-6 bg-beige-50 min-h-[400px]">
              {viewContent}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-olive-200">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-3 bg-olive-100 text-olive-700 rounded-lg hover:bg-olive-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // Inline Edit Mode
  return (
    <div className="bg-white rounded-2xl shadow-soft p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-olive-900 mb-2">Editing: {title}</h2>
          {description && (
            <p className="text-olive-600 text-sm">{description}</p>
          )}
        </div>
        <button
          onClick={handleCancel}
          className="p-2 text-olive-600 hover:text-olive-700 hover:bg-olive-50 rounded-lg transition-colors"
          title="Cancel editing"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Current Content Display */}
      <div className="mb-6 p-4 bg-olive-50 rounded-lg border border-olive-200">
        <h3 className="font-semibold text-olive-900 mb-2 text-sm">Current Content:</h3>
        <div className="text-sm text-olive-700">{viewContent}</div>
      </div>

      {/* Editor */}
      <div className="space-y-4" onChange={() => setHasChanges(true)}>
        {editContent}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-olive-200">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-6 py-3 bg-olive-100 text-olive-700 rounded-lg hover:bg-olive-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
