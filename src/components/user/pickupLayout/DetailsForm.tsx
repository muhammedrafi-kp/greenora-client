import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { setStep, setDetails } from '../../../redux/pickupSlice';
import PriceTable from '../PriceTable';
import { getCategories } from '../../../services/userService';

export interface ICategory {
  _id: string;
  name: string;
  type: "waste" | "scrap";
  description: string;
  rate: number;
}

interface IFormData {
  items: {
    categoryId: string;
    qty: number;
  }[];
  preferredDate: string;
  instructions: string;
}

const DetailsForm = () => {

  console.log("DetailsForm");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pickupType = useSelector((state: any) => state.pickup.pickupRequest.type);
  const details = useSelector((state: any) => state.pickup.pickupRequest.details);

  console.log("pickupType", pickupType);
  console.log("details", details);
  console.log(typeof details);
  // States
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    items: details?.items || [],
    preferredDate: details?.preferredDate || '',
    instructions: details?.instructions || ''
  });
  const [newItem, setNewItem] = useState({
    categoryId: '',
    qty: 0,
  });
  const [errors, setErrors] = useState({
    category: '',
    qty: '',
    preferredDate: '',
    items: ''
  });

  useEffect(() => {
    if (details) {
      setFormData({
        items: details.items || [],
        preferredDate: details.preferredDate || '',
        instructions: details.instructions || ''
      });
    }
  }, [details]);

  // Memoized values
  const filteredCategories = useMemo(() =>
    categories.filter(category => category.type === pickupType),
    [categories, pickupType]
  );

  const availableCategories = useMemo(() =>
    filteredCategories.filter(
      category => !formData.items.some(item => item.categoryId === category._id)
    ),
    [filteredCategories, formData.items]
  );

  // Handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddItemClick = useCallback(() => {
    if (!validateNewItem()) return;

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        categoryId: newItem.categoryId,
        qty: newItem.qty
      }]
    }));
    setNewItem({ categoryId: '', qty: 0 });
  }, [newItem]);

  const handleRemoveItem = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getCategories();
      console.log("response", response);
      if (response.success) {
        console.log(response.data);
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    console.log("formData", formData);
    try {
      setIsLoading(true);

      dispatch(setDetails({ details: formData }));
      dispatch(setStep({ step: 4 }));
      navigate('/pickup/review');
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors = { items: '', preferredDate: '' };
    let isValid = true;

    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one item';
      isValid = false;
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date';
      isValid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const maxDate = new Date(getMaxDate());
      const selectedDate = new Date(formData.preferredDate);

      if (selectedDate <= today) {
        newErrors.preferredDate = 'Please select a future date (starting from tomorrow)';
        isValid = false;
      } else if (selectedDate > maxDate) {
        newErrors.preferredDate = 'Please select a date within the next 2 months';
        isValid = false;
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const validateNewItem = () => {
    let newErrors = { category: '', qty: '' };
    let isValid = true;

    if (!newItem.categoryId) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    if (!newItem.qty) {
      newErrors.qty = 'Please enter quantity';
      isValid = false;
    } else if (isNaN(Number(newItem.qty)) || Number(newItem.qty) < 1) {
      newErrors.qty = 'Quantity must be at least 1';
      isValid = false;
    } else if (Number(newItem.qty) > 20) {
      newErrors.qty = 'Quantity cannot exceed 20';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(1);
    today.setMonth(today.getMonth() + 2);
    today.setDate(0);
    return today.toISOString().split('T')[0];
  };

  // Render form
  const renderForm = useMemo(() => (
    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowPriceTable(!showPriceTable)}>
          <span className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            {showPriceTable ? "Hide" : "Show"} current {pickupType} prices
          </span>
          {showPriceTable ? (
            <ChevronUp className="h-4 w-4 text-blue-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-600" />
          )}
        </div>
        {showPriceTable && <PriceTable categories={categories} type={pickupType} />}

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {pickupType === 'waste' ? 'Waste Category' : 'Scrap Type'}
              </label>
              <select
                value={newItem.categoryId}
                onChange={(e) => {
                  setNewItem(prev => ({ ...prev, categoryId: e.target.value }));
                  setErrors(prev => ({ ...prev, category: '' }));
                }}
                className={`w-full p-2.5 border rounded-lg bg-white text-sm ${errors.category ? 'border-red-500' : 'border-gray-200'
                  }`}
              >
                <option value="" className='text-gray-400' disabled>--Select category--</option>
                {availableCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Quantity ({pickupType === 'waste' ? 'Bags' : 'kg'})
              </label>
              <input
                type="number"
                max="20"
                step="1"
                value={newItem.qty}
                onChange={(e) => {
                  setNewItem(prev => ({ ...prev, qty: Number(e.target.value) }));
                  setErrors(prev => ({ ...prev, qty: '' }));
                }}
                className={`w-full p-2.5 border rounded-lg text-sm ${errors.qty ? 'border-red-500' : 'border-gray-200'
                  }`}
              />
              {errors.qty && (
                <p className="mt-1 text-sm text-red-500">{errors.qty}</p>
              )}
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddItemClick}
                className="w-full px-4 py-2.5 bg-green-800 hover:bg-green-900 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {errors.items && (
            <p className="text-sm text-red-500">{errors.items}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg"
              >
                <span className="text-sm">
                  {getCategoryName(item.categoryId)} - {item.qty} {pickupType === 'waste' ? 'bag(s)' : 'kg'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
              <input
                type="date"
                name="preferredDate"
                min={getTomorrowDate()}
                max={getMaxDate()}
                value={formData.preferredDate}
                onChange={(e) => {
                  handleChange(e);
                  setErrors(prev => ({ ...prev, preferredDate: '' }));
                }}
                className={`w-full p-2.5 border rounded-lg text-sm ${errors.preferredDate ? 'border-red-500' : 'border-gray-200'
                  }`}
              />
              {errors.preferredDate && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Instructions (optional)</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Add any special instructions..."
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  ), [pickupType, showPriceTable, newItem, errors, formData, availableCategories, handleAddItemClick, handleRemoveItem, handleChange]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {renderForm}
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

export default React.memo(DetailsForm); 