import { ToastType } from '@/components/common/Toast';
import { useCallback, useState } from 'react';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

const initialToastState: ToastState = {
  message: '',
  type: 'info',
  isVisible: false,
};

export function useToast() {
  const [toast, setToast] = useState<ToastState>(initialToastState);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
} 