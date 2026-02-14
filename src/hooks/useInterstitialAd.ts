import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleAdMob } from '@apps-in-toss/web-framework';

const AD_GROUP_ID = 'ait.v2.live.17f5fdb480bc4331';

interface AdCallback {
  onDismiss?: () => void;
}

export function useInterstitialAd(adGroupId: string = AD_GROUP_ID) {
  const [loading, setLoading] = useState(true);
  const [adSupported, setAdSupported] = useState(true);
  const dismissRef = useRef<(() => void) | undefined>();

  useEffect(() => {
    try {
      const isUnsupported = GoogleAdMob?.loadAppsInTossAdMob?.isSupported?.() === false;
      if (isUnsupported) {
        setAdSupported(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      const cleanup = GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId },
        onEvent: (event: any) => {
          if (event.type === 'loaded') setLoading(false);
        },
        onError: () => setLoading(false),
      });
      return cleanup;
    } catch {
      setAdSupported(false);
      setLoading(false);
    }
  }, [adGroupId]);

  const showAd = useCallback(({ onDismiss }: AdCallback = {}) => {
    try {
      const isUnsupported = GoogleAdMob?.showAppsInTossAdMob?.isSupported?.() === false;
      if (isUnsupported) throw new Error('unsupported');
    } catch {
      onDismiss?.();
      return;
    }
    if (!adSupported || loading) {
      onDismiss?.();
      return;
    }
    dismissRef.current = onDismiss;
    GoogleAdMob.showAppsInTossAdMob({
      options: { adGroupId },
      onEvent: (event: any) => {
        switch (event.type) {
          case 'requested':
            setLoading(true);
            break;
          case 'dismissed':
            dismissRef.current?.();
            dismissRef.current = undefined;
            reloadAd();
            break;
          case 'failedToShow':
            dismissRef.current?.();
            dismissRef.current = undefined;
            break;
        }
      },
      onError: () => {
        dismissRef.current?.();
        dismissRef.current = undefined;
      },
    });
  }, [loading, adSupported, adGroupId]);

  const reloadAd = useCallback(() => {
    if (!adSupported) return;
    setLoading(true);
    GoogleAdMob.loadAppsInTossAdMob({
      options: { adGroupId },
      onEvent: (event: any) => {
        if (event.type === 'loaded') setLoading(false);
      },
      onError: () => setLoading(false),
    });
  }, [adSupported, adGroupId]);

  return { loading, adSupported, showAd };
}
