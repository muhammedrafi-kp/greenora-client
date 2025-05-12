import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trash2, Recycle } from 'lucide-react';
import { setType, setStep } from '../../../redux/pickupSlice';

const TypeSelection = () => {
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  const dispatch = useDispatch();

  const handlePickupTypeSelect = async (type: 'waste' | 'scrap') => {
    dispatch(setType({ type }));
    dispatch(setStep({ step: 2 }));
    navigate('/pickup/address');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => !isLoading && handlePickupTypeSelect('waste')}
          className={`bg-white border border-gray-200 p-6 rounded-xl shadow-sm 
            hover:shadow-md transition-shadow duration-200 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Waste Pickup
          </h3>
          <p className="text-sm text-gray-600">
            Schedule a pickup for your household or recyclable waste
          </p>
        </div>

        <div
          onClick={() => !isLoading && handlePickupTypeSelect('scrap')}
          className={`bg-white border border-gray-200 p-6 rounded-xl shadow-sm 
            hover:shadow-md transition-shadow duration-200 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Recycle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Scrap Pickup
          </h3>
          <p className="text-sm text-gray-600">
            Schedule a pickup for your recyclable scrap materials
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypeSelection; 