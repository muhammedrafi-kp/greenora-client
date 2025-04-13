import React from 'react';
import Modal from '../common/Modal';

interface ICollector {
  _id: string;
  name: string;
  currentTasks: number;
  maxTasks: number;
  email: string;
  phone: string;
}

interface ScheduleCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: string;
  serviceArea: string;
  availableCollectors: ICollector[];
  selectedCollector: string;
  onCollectorSelect: (collectorId: string) => void;
  onSchedule: () => void;
  loading: boolean;
}

const ScheduleCollectionModal: React.FC<ScheduleCollectionModalProps> = ({
  isOpen,
  onClose,
  district,
  serviceArea,
  availableCollectors,
  selectedCollector,
  onCollectorSelect,
  onSchedule,
  loading
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Collection"
      description="Select a collector to schedule this collection"
      confirmLabel={loading ? "Scheduling..." : "Schedule"}
      onConfirm={onSchedule}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
            {district}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
            {serviceArea}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available Collectors</label>
          <select
            value={selectedCollector}
            onChange={(e) => onCollectorSelect(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white"
          >
            <option value="">Select a collector</option>
            {availableCollectors.map((collector) => (
              <option key={collector._id} value={collector._id}>
                {collector.name} ({collector.currentTasks}/{collector.maxTasks} tasks)
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleCollectionModal; 