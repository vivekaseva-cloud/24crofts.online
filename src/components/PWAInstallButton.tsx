import React, { useEffect, useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowGuideModal(true);
          }
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:border-[#E5A93C] hover:text-white transition-colors whitespace-nowrap shrink-0"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#E5A93C]" />
        <span>Install iOS / Android App</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#12141D] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-[#E5A93C]" />
                <h3 id="pwa-modal-title" className="text-base font-semibold text-white">
                  24crofts.com Mobile App (iOS & Android)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Close app install guide"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-zinc-300">
              <p className="text-xs text-zinc-400 leading-relaxed">
                ఈ యాప్ ఆండ్రాయిడ్ మరియు ఐఓఎస్ (iPhone/iPad) రెండింటికీ ఆఫ్‌లైన్ మోడ్ సదుపాయంతో రూపొందించబడింది.
              </p>

              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-4 space-y-2">
                <div className="font-semibold text-white">Android (Chrome / Edge)</div>
                <p className="text-xs text-zinc-400">
                  బ్రౌజర్ మెనూ (⋮) ఓపెన్ చేసి <strong>&ldquo;Install App&rdquo;</strong> లేదా <strong>&ldquo;Add to Home Screen&rdquo;</strong> పై ట్యాప్ చేయండి.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-4 space-y-2">
                <div className="font-semibold text-white">
                  iOS — iPhone / iPad {isIOS ? '(Detected)' : '(Safari)'}
                </div>
                <p className="text-xs text-zinc-400">
                  1. Safari దిగువన ఉన్న <strong>Share</strong> బటన్‌పై ట్యాప్ చేయండి.<br />
                  2. కిందకు స్క్రోల్ చేసి <strong>&ldquo;Add to Home Screen&rdquo;</strong> ఎంచుకోండి.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="rounded-lg bg-[#E5A93C] px-4 py-2 text-xs font-semibold text-[#090A0F] hover:bg-[#f0b84d] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC<{ simulatedOffline?: boolean }> = ({
  simulatedOffline = false,
}) => {
  const isOnline = useOnlineStatus();

  if (isOnline && !simulatedOffline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-[#141722] px-4 py-2.5 text-xs font-medium text-amber-300 shadow-xl"
    >
      <WifiOff className="h-4 w-4 text-amber-400 shrink-0" />
      <span>
        ఆఫ్‌లైన్ మోడ్ (Offline Mode Active) — Cached 24Crofts profiles & directory available without internet.
      </span>
    </div>
  );
};
