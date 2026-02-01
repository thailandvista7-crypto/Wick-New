'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

interface ThemeContextType {
  settings: DesignSettings | null;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: null,
  isLoading: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DesignSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch design settings from public API endpoint
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/design-settings/public', {
          cache: 'no-store', // Always fetch fresh settings
        });
        const data = await res.json();
        
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          // Merge settings from database - data comes as {logo: {...}, colors: {...}, etc.}
          const merged: DesignSettings = {};
          
          // Parse each setting key - they're stored separately in DB
          if (data.logo) {
            try {
              merged.logo = typeof data.logo === 'string' ? JSON.parse(data.logo) : data.logo;
            } catch {
              merged.logo = typeof data.logo === 'object' ? data.logo : undefined;
            }
          }
          if (data.favicon) {
            merged.favicon = typeof data.favicon === 'string' ? data.favicon : undefined;
          }
          if (data.colors) {
            try {
              merged.colors = typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors;
            } catch {
              merged.colors = typeof data.colors === 'object' ? data.colors : undefined;
            }
          }
          if (data.fonts) {
            try {
              merged.fonts = typeof data.fonts === 'string' ? JSON.parse(data.fonts) : data.fonts;
            } catch {
              merged.fonts = typeof data.fonts === 'object' ? data.fonts : undefined;
            }
          }
          if (data.roundedCorners !== undefined) {
            merged.roundedCorners = typeof data.roundedCorners === 'string' 
              ? data.roundedCorners === 'true' 
              : Boolean(data.roundedCorners);
          }
          if (data.softShadows !== undefined) {
            merged.softShadows = typeof data.softShadows === 'string'
              ? data.softShadows === 'true'
              : Boolean(data.softShadows);
          }
          
          if (Object.keys(merged).length > 0) {
            setSettings(merged);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching theme settings:', error);
        setIsLoading(false);
      }
    };
    
    fetchSettings();
    
    // Listen for settings update events
    const handleUpdate = () => {
      fetchSettings();
    };
    window.addEventListener('theme-settings-updated', handleUpdate);
    
    // Refresh settings every 30 seconds to pick up changes
    const interval = setInterval(fetchSettings, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('theme-settings-updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!settings) return;

    // Apply CSS variables dynamically
    const root = document.documentElement;

    // Apply colors
    if (settings.colors?.primary) {
      root.style.setProperty('--color-primary', settings.colors.primary);
    }
    if (settings.colors?.secondary) {
      root.style.setProperty('--color-secondary', settings.colors.secondary);
    }
    if (settings.colors?.accent) {
      root.style.setProperty('--color-accent', settings.colors.accent);
    }

    // Apply fonts
    if (settings.fonts?.primary) {
      root.style.setProperty('--font-primary', `'${settings.fonts.primary}', sans-serif`);
      // Also apply to body
      document.body.style.fontFamily = `'${settings.fonts.primary}', sans-serif`;
    }
    if (settings.fonts?.secondary) {
      root.style.setProperty('--font-secondary', `'${settings.fonts.secondary}', serif`);
      // Apply to headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        (heading as HTMLElement).style.fontFamily = `'${settings.fonts?.secondary}', serif`;
      });
    }

    // Apply rounded corners and shadows globally via CSS classes
    if (settings.roundedCorners === false) {
      document.documentElement.classList.add('no-rounded-corners');
    } else {
      document.documentElement.classList.remove('no-rounded-corners');
    }
    
    if (settings.softShadows === false) {
      document.documentElement.classList.add('no-soft-shadows');
    } else {
      document.documentElement.classList.remove('no-soft-shadows');
    }

    // Apply favicon
    if (settings.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = settings.favicon;
      } else {
        link = document.createElement('link');
        link.rel = 'icon';
        link.href = settings.favicon;
        document.head.appendChild(link);
      }
    }
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
