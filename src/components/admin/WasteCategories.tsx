import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/collectionService';
import { toast } from 'react-hot-toast';
import { ApiResponse } from '../../types/common';
import { ICategory } from '../../types/collection';


export interface IWasteCategoryForm {
  name: string;
  type: string;
  rate: number;
  description: string;
}

interface FormErrors {
  name?: string;
  rate?: string;
  description?: string;
}

const WasteCategories: React.FC = () => {
  const [wastes, setWastes] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedItem, setSelectedItem] = useState<ICategory | null>(null);
  const [formInput, setFormInput] = useState<IWasteCategoryForm>({
    name: '',
    type: 'waste',
    rate: 0,
    description: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});


  useEffect(() => {
    fetchWasteCategories();
  }, []);

  const fetchWasteCategories = async () => {
    try {
      setLoading(true);
      const res: ApiResponse<ICategory[]> = await getCategories('waste');
      if (res.success) {
        setWastes(res.data);
        console.log("response", res.data);
        setError(null);
      }
    } catch (error) {
      setError('Failed to fetch waste categories. Please try again later.');
      console.error('Error fetching waste categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        if (value.trim().length < 3) {
          return 'Name must be at least 3 characters long';
        }
        if (value.trim().length > 50) {
          return 'Name must be less than 50 characters';
        }
        return undefined;

      case 'rate':
        if (value === '' || value === null) {
          return 'Rate is required';
        }
        if (isNaN(value) || value < 1) {
          return 'Rate must be a positive number';
        }
        if (value > 10000) {
          return 'Rate must be less than ₹10,000';
        }
        return undefined;

      case 'description':
        if (!value.trim()) {
          return 'Description is required';
        }
        if (value.trim().length < 10) {
          return 'Description must be at least 10 characters long';
        }
        if (value.trim().length > 500) {
          return 'Description must be less than 500 characters';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formInput).forEach((key) => {
      if (key !== 'type') { // Skip validation for type as it's fixed
        const error = validateField(key, formInput[key as keyof IWasteCategoryForm]);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
          isValid = false;
        }
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // const newValue = name === 'rate' ? Number(value) : value;
    setFormInput((prev) => ({ ...prev, [name]: value }));

    // Validate field on change
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const truncateText = (text: string, maxLength: number = 15) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredWastes = wastes.filter(waste =>
    waste.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    waste.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setModalType('add');
    setFormInput({ name: '', type: 'waste', rate: 0, description: '' });
    setShowModal(true);
  };

  const handleEdit = (item: ICategory) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormInput({
      name: item.name,
      type: 'waste',
      rate: item.rate,
      description: item.description,
    });
    setShowModal(true);
  };

  const handleDelete = (item: ICategory) => {
    setModalType('delete');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      // Skip validation for delete operations
      if (modalType === 'delete') {
        if (selectedItem) {
          const res: ApiResponse<ICategory> = await deleteCategory(selectedItem._id);
          if (res.success) {
            await fetchWasteCategories();
          }
        }
      } else {
        // Only validate for add/edit operations
        if (!validateForm()) {
          return;
        }

        if (modalType === 'add') {
          const res: ApiResponse<ICategory> = await addCategory(formInput);
          if (res.success) {
            await fetchWasteCategories();
          }
        } else if (modalType === 'edit' && selectedItem) {
          const res: ApiResponse<ICategory> = await updateCategory(selectedItem._id, formInput);
          if (res.success) {
            await fetchWasteCategories();
          }
        }
      }

      // Reset form and close modal
      setShowModal(false);
      setSelectedItem(null);
      setFormInput({ name: '', type: 'waste', rate: 0, description: '' });
      setFormErrors({});
    } catch (error: any) {
      console.error('Error handling waste category:', error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }

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
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {filteredWastes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No waste categories found.
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price (₹/bag)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWastes.map(waste => (
                      <tr
                        key={waste._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-gray-900">{truncateText(waste.name)}</td>
                        <td className="px-5 py-3 text-gray-600">₹{waste.rate}</td>
                        <td className="px-5 py-3 text-gray-600">{truncateText(waste.description)}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(waste)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(waste)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormErrors({});
        }}
        title={
          modalType === 'delete'
            ? 'Delete Waste Category'
            : modalType === 'edit'
              ? 'Edit Waste Category'
              : 'Add Waste Category'
        }
        description={
          modalType === 'delete'
            ? `Are you sure you want to delete ${selectedItem?.name}?`
            : ''
        }
        confirmLabel={modalType === 'delete' ? 'Delete' : 'Save'}
        onConfirm={handleSubmit}
        confirmButtonClass={`px-4 py-2 rounded-lg text-white ${modalType === 'delete'
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-blue-950 hover:bg-blue-900'
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
                className={`w-full p-2.5 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹/bag)</label>
              <input
                type="text"
                name="rate"
                value={formInput.rate}
                onChange={handleInputChange}
                className={`w-full p-2.5 border ${formErrors.rate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
              />
              {formErrors.rate && (
                <p className="mt-1 text-xs text-red-500">{formErrors.rate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formInput.description}
                onChange={handleInputChange}
                className={`w-full p-2.5 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
                rows={3}
              />
              {formErrors.description && ( // Added error display for description
                <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default WasteCategories;