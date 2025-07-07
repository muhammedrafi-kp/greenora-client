// import { X } from 'lucide-react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string | React.ReactNode;
//   description: string;
//   confirmLabel: string | React.ReactNode;
//   cancelLabel?: string | React.ReactNode;
//   onConfirm: () => void;
//   confirmButtonClass?: string;
//   children?: React.ReactNode;
//   isDisabled?: boolean;
// }

// const scrollbarStyles = `
//   .scrollbar-thin::-webkit-scrollbar {
//     width: 5px;
//   }
  
//   .scrollbar-thin::-webkit-scrollbar-track {
//     background: #f1f1f1;
//     border-radius: 10px;
//   }
  
//   .scrollbar-thin::-webkit-scrollbar-thumb {
//     background: #888;
//     border-radius: 10px;
//   }
  
//   .scrollbar-thin::-webkit-scrollbar-thumb:hover {
//     background: #555;
//   }
// `;

// const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   description,
//   confirmLabel,
//   cancelLabel = 'Cancel',
//   onConfirm,
//   confirmButtonClass,
//   children,
//   isDisabled
// }) => {
//   if (!isOpen) return null;

//   return (
//     <>
//       <style>{scrollbarStyles}</style>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 overflow-y-auto max-h-[90vh] scrollbar-thin">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <p className="text-gray-600 mb-6 font-medium">{description}</p>
//           <div className="flex flex-col space-y-2">
//             {children}
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
//             >
//               {cancelLabel}
//             </button>
//             <button
//               onClick={onConfirm}
//               disabled={isDisabled}
//               className={confirmButtonClass || "px-4 py-2 rounded-lg text-white bg-blue-600 font-semibold hover:bg-blue-700 transition-colors"}
//             >
//               {confirmLabel}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Modal;



import { X } from 'lucide-react';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: string;
  confirmLabel: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onConfirm: () => void;
  confirmButtonClass?: string;
  isDisabled?: boolean;
}

const SCROLLBAR_CSS = `
.scrollbar-thin::-webkit-scrollbar{width:5px}
.scrollbar-thin::-webkit-scrollbar-track{background:#f1f1f1;border-radius:10px}
.scrollbar-thin::-webkit-scrollbar-thumb{background:#888;border-radius:10px}
.scrollbar-thin::-webkit-scrollbar-thumb:hover{background:#555}
`;

const BackdropStyle =
  'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
const CardStyle =
  'bg-white rounded-lg p-6 max-w-md w-full mx-4 overflow-y-auto max-h-[90vh] scrollbar-thin';

const ModalInner: React.FC<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  title,
  description = '',
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  confirmButtonClass = 'px-4 py-2 rounded-lg text-white bg-blue-600 font-semibold hover:bg-blue-700 transition-colors',
  children,
  isDisabled,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  /** Close when clicking outside the dialog */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  /** Close with ESC key */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{SCROLLBAR_CSS}</style>
      <div
        className={BackdropStyle}
        onMouseDown={handleBackdropClick}
        aria-modal="true"
        role="dialog"
      >
        <div ref={cardRef} className={CardStyle}>
          <header className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {description && (
            <p className="text-gray-600 mb-6 font-medium">{description}</p>
          )}

          <div className="flex flex-col space-y-2">{children}</div>

          <footer className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDisabled}
              className={`${confirmButtonClass} ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {confirmLabel}
            </button>
          </footer>
        </div>
      </div>
    </>,
    document.body,
  );
};

/** Export memoized component */
const Modal = React.memo(ModalInner);
export default Modal;
