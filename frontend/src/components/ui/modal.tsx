'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface ModalProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onClose?: () => void;
}

export function Modal({ children, defaultOpen = false, onClose }: ModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (defaultOpen) {
      dialog.showModal();
    }

    const handleClose = () => {
      if (onClose) {
        onClose();
      } else {
        router.back();
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        handleClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    dialog.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [defaultOpen, onClose, router]);

  return (
    <dialog
      ref={dialogRef}
      className="modal-backdrop bg-black/50 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4 w-full h-full max-w-none max-h-none"
    >
      <div 
        className="modal-content bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      
      <style jsx>{`
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }
        
        dialog[open] {
          animation: modal-appear 0.2s ease-out;
        }
        
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .modal-content {
          animation: modal-content-appear 0.2s ease-out;
        }
        
        @keyframes modal-content-appear {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </dialog>
  );
}

export default Modal;
