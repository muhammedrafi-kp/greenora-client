import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { getPricingPlans, addPricingPlan, updatePricingPlan, deletePricingPlan } from '../../services/subscriptionService';
import { toast } from 'react-hot-toast';


export interface ISubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features: string[];
}

interface ISubscriptionPlanForm {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

interface FormErrors {
  name?: string;
  price?: string;
  duration?: string;
  features?: string;
    description?: string;
}

const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedItem, setSelectedItem] = useState<ISubscriptionPlan | null>(null);
  const [formInput, setFormInput] = useState<ISubscriptionPlanForm>({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    features: [''],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters long';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        return undefined;

      case 'price':
        if (value === '' || value === null) return 'Price is required';
        if (isNaN(value) || value < 1) return 'Price must be a positive number';
        if (value > 100000) return 'Price must be less than ₹100,000';
        return undefined;

      case 'duration':
        if (value === '' || value === null) return 'Duration is required';
        if (isNaN(value) || value < 1) return 'Duration must be at least 1 month';
        if (value > 60) return 'Duration must be less than 60 months';
        return undefined;

      case 'features':
                if (!value || value.length === 0 || !value.some((f: string) => f.trim())) {
                    return 'At least one feature is required';
                }
                return undefined;

            case 'description':
                if (!value.trim()) return 'Description is required';
                if (value.trim().length < 10) return 'Description must be at least 10 characters long';
                if (value.trim().length > 200) return 'Description must be less than 200 characters';
        return undefined;

      default:
        return undefined;
    }
  };

    const fetchPricingPlans = async () => {
        setLoading(true);
        try {
            const response = await getPricingPlans();
            console.log("response :", response);
            if (response.success) {
                setPlans(response.data);
            }
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPricingPlans();
    }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formInput.features];
    newFeatures[index] = value;
    setFormInput(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormInput(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormInput(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        // Validate all fields
        const nameError = validateField('name', formInput.name);
        const priceError = validateField('price', formInput.price);
        const durationError = validateField('duration', formInput.duration);
        const featuresError = validateField('features', formInput.features);
        const descriptionError = validateField('description', formInput.description);

        if (nameError) errors.name = nameError;
        if (priceError) errors.price = priceError;
        if (durationError) errors.duration = durationError;
        if (featuresError) errors.features = featuresError;
        if (descriptionError) errors.description = descriptionError;

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (modalType !== 'delete' && !validateForm()) {
            console.log("formErrors :", formErrors);
            return;
        }

        try {
            if (modalType === 'add') {
                console.log("formInput :", formInput);
                const response = await addPricingPlan({
                    ...formInput,
                    features: formInput.features.filter(f => f.trim()) // Remove empty features
                });

                if (response.success) {
                    toast.success('New plan added');
                    await fetchPricingPlans();
                    setShowModal(false);
                    // Reset form
                    setFormInput({
                        name: '',
                        description: '',
                        price: 0,
                        duration: 1,
                        features: [''],
                    });
                } else {
                    toast.error(response.message || 'Failed to add plan');
                }
            } else if (modalType === 'edit' && selectedItem) {
                const response = await updatePricingPlan(selectedItem._id, {
                    ...formInput,
                    features: formInput.features.filter(f => f.trim())
                });

                if (response.success) {
                    toast.success('Plan updated');
                    await fetchPricingPlans();
                    setShowModal(false);
                } else {
                    toast.error(response.message || 'Failed to update plan');
                }
            } else if (modalType === 'delete' && selectedItem) {
                const response = await deletePricingPlan(selectedItem._id);

                if (response.success) {
                    toast.success('Plan deleted');
                    await fetchPricingPlans();
                    setShowModal(false);
                    setSelectedItem(null);
                } else {
                    toast.error(response.message || 'Failed to delete plan');
                }
            }
        } catch (error) {
            console.error('Error handling plan:', error);
            toast.error('An error occurred while processing your request');
        }
    };

    const resetForm = () => {
        setFormInput({
            name: '',
            description: '',
            price: 0,
            duration: 1,
            features: [''],
        });
        setFormErrors({});
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-6">
          <div className="flex justify-end items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none w-full bg-white shadow-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
                            onClick={() => {
                                setShowModal(true);
                                setModalType('add');
                            }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Plan</span>
            </button>
          </div>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950" />
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No pricing plans found</p>
                            <p className="text-gray-400 text-sm mt-1">Click 'Add New Plan' to create one</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Duration</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Price</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Features</th>
                                        <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map((plan) => (
                                        <tr key={plan._id} className="border-t border-gray-200">
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                                                    {plan.description && (
                                                        <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {plan.duration} {plan.duration === 1 ? 'month' : 'months'}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                ₹{plan.price}
                                            </td>
                                            <td className="py-4 px-4">
                                                <ul className="list-disc list-inside">
                                                    {plan.features.map((feature, index) => (
                                                        <li key={index} className="text-xs text-gray-600">{feature}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(plan);
                                                            setModalType('edit');
                                                            setFormInput({
                                                                name: plan.name,
                                                                description: plan.description || '',
                                                                price: plan.price,
                                                                duration: plan.duration,
                                                                features: plan.features,
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(plan);
                                                            setModalType('delete');
                                                            setShowModal(true);
                                                        }}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
                    resetForm();
                    setSelectedItem(null);
        }}
        title={modalType === 'delete' ? 'Delete Plan' : modalType === 'edit' ? 'Edit Plan' : 'Add New Plan'}
                description={modalType === 'delete' ? 'Are you sure you want to delete this plan?' : 'Enter plan details below'}
        confirmLabel={modalType === 'delete' ? 'Delete' : 'Save'}
                onConfirm={handleSubmit}
                confirmButtonClass={`px-4 py-2 rounded-lg text-white ${modalType === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-950 hover:bg-blue-900'
        } transition-colors`}
      >
        {modalType !== 'delete' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formInput.name}
                onChange={handleInputChange}
                className={`w-full p-2.5 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
              />
              {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formInput.price}
                onChange={handleInputChange}
                className={`w-full p-2.5 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
              />
              {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (months)</label>
              <input
                type="number"
                name="duration"
                value={formInput.duration}
                onChange={handleInputChange}
                className={`w-full p-2.5 border ${formErrors.duration ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
              />
              {formErrors.duration && <p className="mt-1 text-xs text-red-500">{formErrors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formInput.description}
                onChange={handleInputChange}
                                className={`w-full p-2.5 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
                rows={3}
              />
                            {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              {formInput.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        className={`flex-1 p-2.5 border ${formErrors.features ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
                    placeholder="Enter feature"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
                            {formErrors.features && (
                                <p className="mt-1 text-xs text-red-500">{formErrors.features}</p>
                            )}
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Feature
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default Pricing;