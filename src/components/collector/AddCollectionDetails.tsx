import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { getCategories } from '../../services/adminService';

interface ICollection {
    _id: string;
    user: {
        userId: string;
        name: string;
        email: string;
        phone: string;
    };
    collectionId: string;
    type: 'waste' | 'scrap';
    serviceAreaId: string;
    districtId: string;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    paymentStatus: 'paid' | 'unpaid';
    createdAt: string;
    items: {
        categoryId: string;
        name: string;
        rate: number;
        qty: number;
    }[];
    instructions?: string;
    preferredDate: string;
    preferredTime: string;
    address: {
        name: string;
        mobile: string;
        pinCode: string;
        locality: string;
        addressLine: string;
    };
    proofs: string[];
    notes?: string;
}

interface ICategory {
    _id: string;
    name: string;
    type: "waste" | "scrap";
    description: string;
    rate: number;
}

interface IFormData {
    items: {
        categoryId: string;
        name: string;
        rate: number;
        qty: number;
    }[];
    proofs: File[];
    notes?: string;
}

const AddCollectionDetails: React.FC = () => {
    const { collection } = useLocation().state as { collection: ICollection };
    console.log("collection", collection);

    const navigate = useNavigate();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [formData, setFormData] = useState<IFormData>({
        items: collection.items.map(item => ({
            categoryId: item.categoryId,
            name: item.name,
            rate: item.rate,
            qty: item.qty
        })),
        proofs: [],
        notes: ''
    });
    const [newItem, setNewItem] = useState({
        categoryId: '',
        name: '',
        rate: 0,
        qty: 0,
    });
    const [errors, setErrors] = useState({
        category: '',
        qty: '',
        proofs: '',
        items: ''
    });
    const [loading, setLoading] = useState(false);

    // Calculate total amount dynamically
    const totalAmount = useMemo(() => {
        return formData.items.reduce((total, item) => {
            return total + (item.rate * item.qty);
        }, 0);
    }, [formData.items]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories(collection.type);
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [collection.type]);

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
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const handleAddItemClick = useCallback(() => {
        // Call validateNewItem directly instead of using it in dependencies
        const isValid = validateNewItem();
        if (!isValid) return;

        console.log("Adding new item:", newItem);

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                categoryId: newItem.categoryId,
                name: newItem.name,
                rate: newItem.rate,
                qty: newItem.qty
            }]
        }));
        setNewItem({ categoryId: '', name: '', rate: 0, qty: 0 });
    }, [newItem]); // Remove validateNewItem from dependencies

    const handleRemoveItem = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    }, []);

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLoading(true);
            const files = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                proofs: [...prev.proofs, ...files]
            }));
            setErrors(prev => ({ ...prev, proofs: '' }));
            setLoading(false);
        }
    };

    const handleRemoveProof = (index: number) => {
        setFormData(prev => ({
            ...prev,
            proofs: prev.proofs.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("submit formData", formData);

        if (!validateForm()) {
            return;
        }

        try {
            // Instead of navigating back to collections, navigate to review page
            navigate('/collector/review', {
                state: {
                    formData: formData,
                    collection: collection
                }
            });
        } catch (error) {
            toast.error('Failed to process collection details');
        }
    };

    const validateForm = () => {
        let newErrors = { items: '', proofs: '' };
        let isValid = true;

        if (formData.items.length === 0) {
            newErrors.items = 'Please add at least one item';
            isValid = false;
        }

        if (formData.proofs.length === 0) {
            newErrors.proofs = 'Please upload at least one proof';
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    return (
        <main className="bg-gray-50 overflow-x-hidden overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-6">
                    {/* <h2 className="text-xl font-semibold text-green-900 mb-4">Collection Details</h2> */}

                    {/* Add Category Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Add Categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                                <select
                                    value={newItem.categoryId}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const selectedCategoryId = e.target.value;
                                        console.log("Selected category ID:", selectedCategoryId);

                                        const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
                                        if (selectedCategory) {
                                            console.log("Found category:", selectedCategory);
                                            setNewItem(prev => ({
                                                ...prev,
                                                categoryId: selectedCategory._id,
                                                name: selectedCategory.name,
                                                rate: selectedCategory.rate
                                            }));
                                            console.log("New item:", newItem);
                                        }
                                        setErrors(prev => ({ ...prev, category: '' }));
                                    }}
                                    className={`w-full p-2.5 border rounded-lg bg-white text-sm ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
                                >
                                    <option value="" className='text-gray-400' disabled>--Select category--</option>
                                    {categories.filter(cat => !formData.items.some(item => item.categoryId === cat._id)).map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name} (Rate: ₹{category.rate})
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
                                <input
                                    type="number"
                                    value={newItem.qty}
                                    onChange={(e) => {
                                        setNewItem(prev => ({ ...prev, qty: Number(e.target.value) }));
                                        setErrors(prev => ({ ...prev, qty: '' }));
                                    }}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${errors.qty ? 'border-red-500' : 'border-gray-200'}`}
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
                    </div>

                    {/* Added Categories Section */}
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Added Categories</h3>
                        {formData.items.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg">
                                        <span className="text-sm">{item.name} - {item.qty} (Rate: ₹{item.rate})</span>
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
                        ) : (
                            <div className={`p-4 rounded-lg ${errors.items ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                                <p className={`text-center ${errors.items ? 'text-red-600' : 'text-gray-500'}`}>
                                    {errors.items || 'No categories added yet. Please add at least one category.'}
                                </p>
                            </div>
                        )}

                        {/* Total Amount Display */}
                        {formData.items.length > 0 && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Total Amount:</span>
                                    <span className="text-lg font-semibold text-green-800">₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span>{item.name} ({item.qty} × ₹{item.rate})</span>
                                            <span>₹{(item.qty * item.rate).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Proofs Section */}
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Upload Proofs</h3>
                        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                            <input
                                type="file"
                                multiple
                                onChange={handleProofUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:underline block py-2">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    Choose files
                                </div>
                            </label>
                            <p className="mt-2 text-gray-500">or drag and drop files here</p>
                        </div>
                        {errors.proofs && (
                            <p className="mt-1 text-sm text-red-500">{errors.proofs}</p>
                        )}
                        {loading && (
                            <p className="mt-2 text-sm text-gray-500">Uploading files, please wait...</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.proofs.map((proof, index) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-lg">
                                <img src={URL.createObjectURL(proof)} alt={proof.name} className="w-10 h-10 object-cover rounded" />
                                <span className="text-sm">{proof.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProof(index)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Notes Section */}
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Add any special notes..."
                            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
                        />
                    </div>

                    <div className="flex justify-end items-center mt-6 border-t pt-6">
                        {/* <div className="text-lg font-bold text-green-900">
                            Total: ₹{totalAmount.toFixed(2)}
                        </div> */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-lg"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default AddCollectionDetails; 