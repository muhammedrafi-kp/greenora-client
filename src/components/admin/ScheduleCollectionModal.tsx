import React, { useState } from 'react';
import Modal from '../common/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';

interface ICollector {
  _id: string;
  name: string;
  taskCount: number;
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
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  originalPreferredDate?: string;
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
  loading,
  selectedDate,
  onDateSelect,
  originalPreferredDate
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [collectorError, setCollectorError] = useState('');

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(1);
    today.setMonth(today.getMonth() + 2);
    today.setDate(0);
    return today;
  };

  const handleClose = () => {
    // Reset to original preferred date or tomorrow if original date is expired
    if (originalPreferredDate) {
      const originalDate = new Date(originalPreferredDate);
      const tomorrow = getTomorrowDate();
      onDateSelect(originalDate >= tomorrow ? originalDate : tomorrow);
    } else {
      onDateSelect(getTomorrowDate());
    }
    setCollectorError('');
    onClose();
  };

  const handleCollectorSelect = (collectorId: string) => {
    onCollectorSelect(collectorId);
    setCollectorError('');
  };

  const handleSchedule = () => {
    if (!selectedCollector) {
      setCollectorError('Please select a collector');
      return;
    }
    onSchedule();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule Collection"
      description="Select a date and collector to schedule this collection"
      confirmLabel={loading ? "Scheduling..." : "Schedule"}
      onConfirm={handleSchedule}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white flex items-center justify-between"
            >
              <span>{selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}</span>
              <Calendar className="w-4 h-4 text-gray-500" />
            </button>
            {isCalendarOpen && (
              <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    onDateSelect(date);
                    setIsCalendarOpen(false);
                  }}
                  minDate={getTomorrowDate()}
                  maxDate={getMaxDate()}
                  inline
                  calendarClassName="rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available Collectors</label>
          <select
            value={selectedCollector}
            onChange={(e) => handleCollectorSelect(e.target.value)}
            className={`w-full p-2 border ${collectorError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white`}
            disabled={!selectedDate}
          >
            <option value="" disabled>
              {selectedDate ? 'Select a collector' : 'Select a date first'}
            </option>
            {availableCollectors.map((collector) => (
              <option key={collector._id} value={collector._id}>
                {collector.name} ({collector.taskCount} tasks)
              </option>
            ))}
          </select>
          {collectorError && (
            <p className="mt-1 text-sm text-red-500">{collectorError}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleCollectionModal; 