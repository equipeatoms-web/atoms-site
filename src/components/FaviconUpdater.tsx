import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export const FaviconUpdater = () => {
  const { data: settings } = useSettings();

  useEffect(() => {
    if (settings?.site_favicon_url) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = settings.site_favicon_url;
      }
    }
  }, [settings?.site_favicon_url]);

  return null;
};
