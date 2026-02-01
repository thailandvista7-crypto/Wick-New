'use client';

import { ReactNode } from 'react';

interface DesignPreviewProps {
  settings: {
    logo?: { light?: string; dark?: string };
    colors?: { primary?: string; secondary?: string; accent?: string };
    fonts?: { primary?: string; secondary?: string };
    roundedCorners?: boolean;
    softShadows?: boolean;
  };
  children?: ReactNode;
}

export default function DesignPreview({ settings, children }: DesignPreviewProps) {
  const style = {
    '--color-primary': settings.colors?.primary || '#7d8c5a',
    '--color-secondary': settings.colors?.secondary || '#b8860b',
    '--color-accent': settings.colors?.accent || '#d4af37',
    '--font-primary': settings.fonts?.primary || 'Inter',
    '--font-secondary': settings.fonts?.secondary || 'serif',
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className={`design-preview ${settings.roundedCorners === false ? 'no-rounded-corners' : ''} ${settings.softShadows === false ? 'no-soft-shadows' : ''}`}
    >
      <style jsx>{`
        .design-preview {
          font-family: var(--font-primary), system-ui, sans-serif;
        }
        .design-preview h1,
        .design-preview h2,
        .design-preview h3 {
          font-family: var(--font-secondary), serif;
        }
        .design-preview .text-primary {
          color: var(--color-primary) !important;
        }
        .design-preview .bg-primary {
          background-color: var(--color-primary) !important;
        }
        .design-preview .text-secondary {
          color: var(--color-secondary) !important;
        }
        .design-preview .bg-secondary {
          background-color: var(--color-secondary) !important;
        }
        .design-preview .text-accent {
          color: var(--color-accent) !important;
        }
        .design-preview .bg-accent {
          background-color: var(--color-accent) !important;
        }
      `}</style>
      {children}
    </div>
  );
}
