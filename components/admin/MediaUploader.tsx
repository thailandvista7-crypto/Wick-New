'use client';

import { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaUploaderProps {
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  type: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export default function MediaUploader({
  currentUrl,
  onUploadComplete,
  type,
  accept = 'image/*',
  maxSize = 5,
  className = '',
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

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
        toast.error('Unauthorized');
        return;
      }

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url;

      setPreview(imageUrl);
      onUploadComplete(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative border-2 border-olive-300 rounded-lg p-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto mb-2 rounded-lg"
          />
          <div className="flex gap-2 justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-olive-100 text-olive-700 rounded-lg hover:bg-olive-200 transition-colors text-sm">
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Change'}
              </span>
            </label>
            <button
              onClick={handleRemove}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="cursor-pointer">
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="border-2 border-dashed border-olive-300 rounded-lg p-8 text-center hover:border-olive-400 transition-colors">
            <ImageIcon className="w-12 h-12 text-olive-400 mx-auto mb-2" />
            <p className="text-olive-600 mb-1">
              {isUploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className="text-sm text-olive-500">
              Max size: {maxSize}MB
            </p>
          </div>
        </label>
      )}
    </div>
  );
}
