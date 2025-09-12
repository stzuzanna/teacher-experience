import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from '../components/ui/toast';

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string, options?: Partial<Toast>) => void;
  showError: (message: string, options?: Partial<Toast>) => void;
  showInfo: (message: string, options?: Partial<Toast>) => void;
  showWarning: (message: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 4000,
  position = 'top-right'
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: defaultDuration,
      ...toast,
    };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      // Keep only the most recent toasts
      return updated.slice(0, maxToasts);
    });
  }, [defaultDuration, maxToasts]);

  const showSuccess = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({
      message,
      type: 'success',
      ...options,
    });
  }, [addToast]);

  const showError = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({
      message,
      type: 'error',
      ...options,
    });
  }, [addToast]);

  const showInfo = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({
      message,
      type: 'info',
      ...options,
    });
  }, [addToast]);

  const showWarning = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({
      message,
      type: 'warning',
      ...options,
    });
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};
