import React, { Fragment, ReactNode, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex items-center justify-center min-h-screen px-4 text-center"
        onClick={handleBackdropClick}
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div
          ref={modalRef}
          className={`inline-block w-full ${sizeClasses[size]} p-6 my-8 text-left align-middle bg-white rounded-lg shadow-xl transform transition-all animate-fade-in`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              {title}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="!p-1 border-0 text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="mt-2">{children}</div>
          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;