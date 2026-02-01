'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PreviewContextType {
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  previewData: Record<string, any>;
  updatePreview: (key: string, value: any) => void;
  resetPreview: () => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, any>>({});

  const updatePreview = (key: string, value: any) => {
    setPreviewData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreview = () => {
    setPreviewData({});
  };

  return (
    <PreviewContext.Provider
      value={{
        previewMode,
        setPreviewMode,
        previewData,
        updatePreview,
        resetPreview,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
}
