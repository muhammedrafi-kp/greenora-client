import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const ResponsiveToaster = () => {
  const [position, setPosition] = useState<'top-center' | 'bottom-center'>('top-center');

  useEffect(() => {
    const checkPosition = () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        setPosition('bottom-center');
      } else {
        setPosition('top-center');
      }
    };
    checkPosition();
    window.addEventListener('resize', checkPosition);
    return () => window.removeEventListener('resize', checkPosition);
  }, []);

  return (
    <Toaster
      position={position}
      toastOptions={{
        success: {
          style: { background: "#1E1E1E", color: "#fff" },
          iconTheme: { primary: "#4CAF50", secondary: "#fff" },
        },
        error: {
          style: { background: "#1E1E1E", color: "#fff" },
          iconTheme: { primary: "#FF5252", secondary: "#fff" },
        },
      }}
    />
  );
};

export default ResponsiveToaster; 