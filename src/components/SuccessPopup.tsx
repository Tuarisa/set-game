import { useEffect, useState } from 'react';

interface SuccessPopupProps {
  message: string | null;
  onClose: () => void;
}

export function SuccessPopup({ message, onClose }: SuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message && message.includes('Correct')) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-success-popup bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="text-4xl mb-2">+10</div>
          <div className="text-lg font-semibold">SET!</div>
        </div>
      </div>
    </div>
  );
}
