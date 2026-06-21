import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, size = 'md', className, showClose = true
}) => {
  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm:   'max-w-sm',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl',
          'border border-slate-200 dark:border-slate-700',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          'max-h-[90vh] flex flex-col',
          sizes[size],
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-6 pb-0 flex-shrink-0">
            {title && (
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger'
}) => {
  const variantStyles = {
    danger:  { icon: '🗑️', btn: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' },
    warning: { icon: '⚠️', btn: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500' },
    info:    { icon: 'ℹ️', btn: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500' },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <div className="text-4xl mb-4">{variantStyles[variant].icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={cn('px-5 py-2.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2', variantStyles[variant].btn)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
