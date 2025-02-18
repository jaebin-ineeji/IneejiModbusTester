import { toast as toastify, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type ToastType = 'success' | 'error' | 'info';

const toastConfig = {
  position: 'top-center' as ToastPosition,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info') => {
    toastify[type](message, toastConfig);
  };

  return {
    showToast,
  };
} 