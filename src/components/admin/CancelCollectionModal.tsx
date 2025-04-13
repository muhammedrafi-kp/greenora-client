import React from 'react';
import Modal from '../common/Modal';

interface ICancellationReason {
  id: string;
  reason: string;
}

interface CancelCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReason: string;
  onReasonSelect: (reasonId: string) => void;
  onCancel: () => void;
  loading: boolean;
}

const cancellationReasons: ICancellationReason[] = [
  { id: '1', reason: 'Customer requested cancellation' },
  { id: '2', reason: 'No collector available' },
  { id: '3', reason: 'Invalid address' },
  { id: '4', reason: 'Customer not reachable' },
  { id: '5', reason: 'Other' }
];

const CancelCollectionModal: React.FC<CancelCollectionModalProps> = ({
  isOpen,
  onClose,
  selectedReason,
  onReasonSelect,
  onCancel,
  loading
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Collection"
      description="Please select a reason for cancellation"
      confirmLabel={loading ? "Cancelling..." : "Confirm Cancellation"}
      onConfirm={onCancel}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {cancellationReasons.map((reason) => (
            <label key={reason.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="cancellationReason"
                value={reason.id}
                checked={selectedReason === reason.id}
                onChange={(e) => onReasonSelect(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{reason.reason}</span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default CancelCollectionModal; 