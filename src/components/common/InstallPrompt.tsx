import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Stop the browser from auto-showing
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // @ts-ignore
    deferredPrompt.prompt(); // Show the install prompt

    // Optional: wait for the user's choice
    // @ts-ignore
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-black text-white p-4 rounded shadow-lg z-50">
      <p>Install this app for a better experience!</p>
      <button onClick={handleInstallClick} className="bg-blue-500 px-3 py-1 mt-2 rounded">
        Install App
      </button>
    </div>
  );
}
