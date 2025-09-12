import React, { useEffect } from 'react';
import { CheckCircleIcon, XIcon } from 'lucide-react';
import { Button } from './button';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  icon?: React.ReactNode;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const getToastStyles = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800';
  }
};

const getDefaultIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
    case 'error':
      return <XIcon className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <span className="w-4 h-4 text-yellow-500">⚠️</span>;
    case 'info':
    default:
      return <span className="w-4 h-4 text-blue-500">ℹ️</span>;
  }
};

export const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border shadow-sm animate-slide-in-from-right ${getToastStyles(
        toast.type
      )}`}
    >
      <div className="flex-shrink-0">
        {toast.icon || getDefaultIcon(toast.type)}
      </div>
      
      <div className="flex-1 text-sm font-medium">
        {toast.message}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onClose(toast.id)}
        className="h-6 w-6 rounded-full hover:bg-white/50 flex-shrink-0"
      >
        <XIcon className="w-3 h-3" />
      </Button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right'
}) => {
  if (toasts.length === 0) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div
      className={`absolute z-50 flex flex-col gap-2 max-w-sm w-full ${getPositionClasses()}`}
    >
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
