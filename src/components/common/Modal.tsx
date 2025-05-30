import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  description: string;
  confirmLabel: string | React.ReactNode;
  cancelLabel?: string | React.ReactNode;
  onConfirm: () => void;
  confirmButtonClass?: string;
  children?: React.ReactNode;
  isDisabled?: boolean;
}

const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 5px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  confirmButtonClass,
  children,
  isDisabled
}) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 overflow-y-auto max-h-[90vh] scrollbar-thin">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-6 font-medium">{description}</p>
          <div className="flex flex-col space-y-2">
            {children}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isDisabled}
              className={confirmButtonClass || "px-4 py-2 rounded-lg text-white bg-blue-600 font-semibold hover:bg-blue-700 transition-colors"}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;


// import React, { useEffect, useRef } from 'react';
// import { X } from 'lucide-react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   description?: string;
//   confirmLabel: string;
//   cancelLabel?: string;
//   onConfirm: () => void;
//   confirmButtonClass?: string;
//   children?: React.ReactNode;
// }

// const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   description,
//   confirmLabel,
//   cancelLabel = 'Cancel',
//   onConfirm,
//   confirmButtonClass,
//   children
// }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         onClose();
//       }
//     };

//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.addEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg w-full max-w-md animate-in fade-in duration-200"
//       >
//         <div className="flex justify-between items-center border-b border-gray-200 p-4">
//           <h3 className="text-lg font-semibold text-gray-900">
//             {title}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>
        
//         <div className="p-4">
//           {description && (
//             <p className="text-gray-600 mb-4">
//               {description}
//             </p>
//           )}
//           {children}
//         </div>

//         <div className="flex justify-end gap-3 border-t border-gray-200 p-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             {cancelLabel}
//           </button>
//           <button
//             onClick={onConfirm}
//             className={confirmButtonClass || "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"}
//           >
//             {confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
