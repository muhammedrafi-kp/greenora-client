import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { setStep, setDetails } from '../../../redux/pickupSlice';
import PriceTable from '../PriceTable';

const DetailsForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const pickupType = useSelector((state: any) => state.pickup.pickupRequest.type);

  const [formData, setFormData] = useState(
    pickupType === 'waste' 
      ? {
          wasteCategory: '',
          quantity: '',
          preferredDate: '',
          contactNo: '',
          description: ''
        }
      : {
          scrapType: '',
          scrapQuantity: '',
          scrapPreferredDate: '',
          scrapContactNo: '',
          scrapDescription: ''
        }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(setDetails({ details: formData }));
      navigate('/pickup/review');
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    // Add your validation logic here
    return true;
  };

  const renderWasteForm = () => (
    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowPriceTable(!showPriceTable)}>
          <span className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            {showPriceTable ? "Hide" : "Show"} current waste prices
          </span>
          {showPriceTable ? (
            <ChevronUp className="h-4 w-4 text-blue-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-600" />
          )}
        </div>
        {showPriceTable && <PriceTable type="waste" />}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Waste Category</label>
            <select
              name="wasteCategory"
              value={formData.wasteCategory}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">Select category</option>
              <option value="household">Household Waste</option>
              <option value="recyclable">Recyclable Waste</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">Select quantity</option>
              <option value="small">Small (1-2 bags)</option>
              <option value="medium">Medium (3-5 bags)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
            <div className="relative">
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contact No</label>
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
              placeholder="Enter your contact number"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional details..."
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderScrapForm = () => (
    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowPriceTable(!showPriceTable)}>
          <span className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            {showPriceTable ? "Hide" : "Show"} current scrap prices
          </span>
          {showPriceTable ? (
            <ChevronUp className="h-4 w-4 text-blue-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-600" />
          )}
        </div>
        {showPriceTable && <PriceTable type="scrap" />}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Scrap Type</label>
            <select
              name="scrapType"
              value={formData.scrapType}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">Select type</option>
              <option value="metal">Metal Scrap</option>
              <option value="paper">Paper</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
            <input
              type="text"
              name="scrapQuantity"
              value={formData.scrapQuantity}
              onChange={handleChange}
              placeholder="Enter approximate weight"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
            <div className="relative">
              <input
                type="date"
                name="scrapPreferredDate"
                value={formData.scrapPreferredDate}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contact No</label>
            <input
              type="tel"
              name="scrapContactNo"
              value={formData.scrapContactNo}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea
            name="scrapDescription"
            value={formData.scrapDescription}
            onChange={handleChange}
            placeholder="Add any additional details..."
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {pickupType === 'waste' ? renderWasteForm() : renderScrapForm()}
        
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => {
              dispatch(setStep({ step: 2 }));
              navigate('/pickup/address');
            }}
            className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-1/2 bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-sm font-medium
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailsForm; 