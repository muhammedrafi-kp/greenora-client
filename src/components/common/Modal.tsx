// Modal.tsx
// import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  confirmButtonClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  confirmButtonClass
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 font-medium">
          {description}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={confirmButtonClass || "px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
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
