import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';

const ScrapCategories: React.FC = () => {
  const [scraps, setScraps] = useState([
    { id: 1, type: 'Metal Scrap', price: 45.00 },
    { id: 2, type: 'Electronic Waste', price: 35.00 },
    { id: 3, type: 'Glass Scrap', price: 15.00 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formInput, setFormInput] = useState({ type: '', price: '' });

  const filteredScraps = scraps.filter(scrap =>
    scrap.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setModalType('add');
    setFormInput({ type: '', price: '' });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormInput({ type: item.type, price: item.price.toString() });
    setShowModal(true);
  };

  const handleDelete = (item: any) => {
    setModalType('delete');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSubmit = () => {
    const newItem = {
      id: selectedItem?.id || Math.random(),
      type: formInput.type,
      price: parseFloat(formInput.price)
    };

    if (modalType === 'add') {
      setScraps([...scraps, newItem]);
    } else if (modalType === 'edit') {
      setScraps(scraps.map(s => s.id === selectedItem.id ? newItem : s));
    } else if (modalType === 'delete') {
      setScraps(scraps.filter(s => s.id !== selectedItem.id));
    }

    setShowModal(false);
    setSelectedItem(null);
    setFormInput({ type: '', price: '' });
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Scrap Categories</h2>
          </div> */}

         <div className="flex justify-end items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search scraps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none w-full bg-white shadow-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add New</span>
            </button>
          </div>


          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price (₹/kg)</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScraps.map((scrap) => (
                    <tr key={scrap.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{scrap.type}</td>
                      <td className="px-6 py-4 text-gray-600">₹{scrap.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(scrap)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(scrap)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalType === 'delete' ? 'Delete' : modalType === 'edit' ? 'Edit' : 'Add'} Scrap Category`}
        description={
          modalType === 'delete'
            ? `Are you sure you want to delete ${selectedItem?.type}?`
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <input
                type="text"
                value={formInput.type}
                onChange={(e) => setFormInput({ ...formInput, type: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹/kg)</label>
              <input
                type="number"
                value={formInput.price}
                onChange={(e) => setFormInput({ ...formInput, price: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default ScrapCategories;