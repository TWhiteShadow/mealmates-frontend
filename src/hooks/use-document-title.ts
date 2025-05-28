import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { unreadCountAtom } from '@/atoms/messages';

const DEFAULT_TITLE = 'MealMates !';

export const useDocumentTitle = () => {
  const unreadCount = useAtomValue(unreadCountAtom);

  useEffect(() => {
    if (unreadCount > 0) {
      const displayCount = unreadCount > 9 ? '9+' : unreadCount.toString();
      document.title = `(${displayCount}) ${DEFAULT_TITLE}`;
    } else {
      document.title = DEFAULT_TITLE;
    }
    const favicon = document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement;
    if (favicon) {
      if (unreadCount > 0) {
        favicon.href = '/MealMatesLogoBadge.ico';
      } else {
        favicon.href = '/MealMatesLogo.ico';
      }
    }
  }, [unreadCount]);

  useEffect(() => {
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);
};
