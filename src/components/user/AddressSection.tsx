import React, { useState } from 'react';
import { Plus, MapPin, Pencil, Trash, X } from 'lucide-react';

const AddressSection = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Sample addresses - replace with actual data from your API
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: '123 Main Street',
      landmark: 'Near City Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    {
      id: 2,
      type: 'Office',
      address: '456 Business Avenue',
      landmark: 'Opposite Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002'
    }
  ]);

  const [formData, setFormData] = useState({
    type: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr => 
        addr.id === editingId ? { ...formData, id: editingId } : addr
      ));
    } else {
      setAddresses([...addresses, { ...formData, id: addresses.length + 1 }]);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      type: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    });
  };

  const handleEdit = (address: any) => {
    setFormData(address);
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="lg:text-lg xs:text-base text-sm font-semibold">Saved Addresses</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        )}
      </div>

      {showAddForm ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium xs:text-base text-sm">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 xs:text-sm text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 xs:text-sm text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 xs:text-sm text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 xs:text-sm text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 xs:text-sm text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-2 xs:text-sm text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 xs:text-sm text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-green-800 flex-shrink-0 mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium xs:text-base text-sm">{address.type}</h3>
                      </div>
                      <p className="xs:text-sm text-xs text-gray-600 mt-1">
                        {address.address}
                      </p>
                      {address.landmark && (
                        <p className="xs:text-sm text-xs text-gray-600">
                          Landmark: {address.landmark}
                        </p>
                      )}
                      <p className="xs:text-sm text-xs text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-1.5 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSection;