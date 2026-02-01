'use client';

import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter your content here. HTML is supported.',
  rows = 12,
  className = '',
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Ensure the textarea shows the full existing content
    if (textareaRef.current && value) {
      textareaRef.current.value = value;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="block text-olive-700 font-medium mb-2">
        Content (HTML supported)
      </label>
      
      {/* Show current content preview */}
      {value && (
        <div className="mb-4 p-4 bg-olive-50 rounded-lg border border-olive-200">
          <p className="text-xs font-semibold text-olive-700 mb-2">Current Content Preview:</p>
          <div 
            className="text-sm text-olive-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-4 py-3 border border-olive-300 rounded-lg bg-white text-olive-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent ${className}`}
        placeholder={placeholder}
      />
      <p className="text-sm text-olive-600">
        You can use HTML tags like &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;p&gt;, etc.
      </p>
    </div>
  );
}
