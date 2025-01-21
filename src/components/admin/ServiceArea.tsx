// import React, { useState } from 'react';
// import { Search, Plus, Pencil, Trash2, MapPin } from 'lucide-react';
// import Modal from '../common/Modal';

// const ServiceArea = () => {
//   const [areas, setAreas] = useState([
//     { id: 1, district: 'North District', area: 'Sector 1', serviceDays: ['Mon', 'Wed', 'Fri'], capacity: 100 },
//     { id: 2, district: 'South District', area: 'Sector 2', serviceDays: ['Tue', 'Thu', 'Sat'], capacity: 150 },
//     { id: 3, district: 'East District', area: 'Sector 3', serviceDays: ['Mon', 'Thu', 'Sat'], capacity: 120 }
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [formInput, setFormInput] = useState({
//     district: '',
//     area: '',
//     serviceDays: [] as string[],
//     capacity: ''
//   });

//   const filteredAreas = areas.filter(area =>
//     area.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     area.area.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAdd = () => {
//     setModalType('add');
//     setFormInput({ district: '', area: '', serviceDays: [], capacity: '' });
//     setShowModal(true);
//   };

//   const handleEdit = (item: any) => {
//     setModalType('edit');
//     setSelectedItem(item);
//     setFormInput({
//       district: item.district,
//       area: item.area,
//       serviceDays: item.serviceDays,
//       capacity: item.capacity.toString()
//     });
//     setShowModal(true);
//   };

//   const handleDelete = (item: any) => {
//     setModalType('delete');
//     setSelectedItem(item);
//     setShowModal(true);
//   };

//   const handleSubmit = () => {
//     const newItem = {
//       id: selectedItem?.id || Math.random(),
//       district: formInput.district,
//       area: formInput.area,
//       serviceDays: formInput.serviceDays,
//       capacity: parseInt(formInput.capacity)
//     };

//     if (modalType === 'add') {
//       setAreas([...areas, newItem]);
//     } else if (modalType === 'edit') {
//       setAreas(areas.map(a => a.id === selectedItem.id ? newItem : a));
//     } else if (modalType === 'delete') {
//       setAreas(areas.filter(a => a.id !== selectedItem.id));
//     }

//     setShowModal(false);
//     setSelectedItem(null);
//     setFormInput({ district: '', area: '', serviceDays: [], capacity: '' });
//   };

//   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   return (
//     <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
//       <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
//         <div className="p-6 space-y-6">
//           <div className="flex justify-end items-center gap-4">
//             <div className="relative w-64">
//               <input
//                 type="text"
//                 placeholder="Search areas..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none w-full bg-white shadow-sm"
//               />
//               <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//             </div>
//             <button
//               onClick={handleAdd}
//               className="flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Add New</span>
//             </button>
//           </div>

//           <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-100 border-b border-gray-100">
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">District</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Service Area</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Service Days</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Daily Capacity</th>
//                     <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredAreas.map((area) => (
//                     <tr key={area.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 font-medium text-gray-900">{area.district}</td>
//                       <td className="px-6 py-4 text-gray-600">{area.area}</td>
//                       <td className="px-6 py-4 text-gray-600">{area.serviceDays.join(', ')}</td>
//                       <td className="px-6 py-4 text-gray-600">{area.capacity}</td>
//                       <td className="px-6 py-4 text-right">
//                         <div className="flex gap-2 justify-end">
//                           <button
//                             onClick={() => handleEdit(area)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           >
//                             <Pencil className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(area)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Modal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         title={`${modalType === 'delete' ? 'Delete' : modalType === 'edit' ? 'Edit' : 'Add'} Service Area`}
//         description={
//           modalType === 'delete'
//             ? `Are you sure you want to delete ${selectedItem?.area} in ${selectedItem?.district}?`
//             : ''
//         }
//         confirmLabel={modalType === 'delete' ? 'Delete' : 'Save'}
//         onConfirm={handleSubmit}
//         confirmButtonClass={`px-4 py-2 rounded-lg text-white ${
//           modalType === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-950 hover:bg-blue-900'
//         } transition-colors`}
//       >
//         {modalType !== 'delete' && (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
//               <input
//                 type="text"
//                 value={formInput.district}
//                 onChange={(e) => setFormInput({ ...formInput, district: e.target.value })}
//                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
//               <input
//                 type="text"
//                 value={formInput.area}
//                 onChange={(e) => setFormInput({ ...formInput, area: e.target.value })}
//                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Service Days</label>
//               <div className="flex flex-wrap gap-2">
//                 {daysOfWeek.map(day => (
//                   <label key={day} className="flex items-center gap-2 p-2 border rounded-lg">
//                     <input
//                       type="checkbox"
//                       checked={formInput.serviceDays.includes(day)}
//                       onChange={(e) => {
//                         const updatedDays = e.target.checked
//                           ? [...formInput.serviceDays, day]
//                           : formInput.serviceDays.filter(d => d !== day);
//                         setFormInput({ ...formInput, serviceDays: updatedDays });
//                       }}
//                       className="rounded border-gray-300 text-blue-950 focus:ring-blue-950"
//                     />
//                     <span className="text-sm text-gray-700">{day}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Daily Capacity</label>
//               <input
//                 type="number"
//                 value={formInput.capacity}
//                 onChange={(e) => setFormInput({ ...formInput, capacity: e.target.value })}
//                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//               />
//             </div>
//           </div>
//         )}
//       </Modal>
//     </main>
//   );
// };

// export default ServiceArea;

import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '../common/Modal';

const ServiceArea = () => {
  const [districts, setDistricts] = useState([
    {
      id: 1,
      name: 'North District',
      serviceAreas: [
        { id: 1, name: 'Sector 1', serviceDays: ['Mon', 'Wed', 'Fri'], capacity: 100 },
        { id: 2, name: 'Sector 2', serviceDays: ['Tue', 'Thu', 'Sat'], capacity: 150 },
      ]
    },
    {
      id: 2,
      name: 'South District',
      serviceAreas: [
        { id: 3, name: 'Sector 3', serviceDays: ['Mon', 'Thu', 'Sat'], capacity: 120 },
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add-district' | 'edit-district' | 'delete-district' | 'add-area' | 'edit-area' | 'delete-area'>('add-district');
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [expandedDistricts, setExpandedDistricts] = useState<number[]>([]);
  const [formInput, setFormInput] = useState({
    districtName: '',
    areaName: '',
    serviceDays: [] as string[],
    capacity: ''
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.serviceAreas.some(area => 
      area.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleDistrict = (districtId: number) => {
    setExpandedDistricts(prev => 
      prev.includes(districtId) 
        ? prev.filter(id => id !== districtId)
        : [...prev, districtId]
    );
  };

  const handleAddDistrict = () => {
    setModalType('add-district');
    setFormInput({ districtName: '', areaName: '', serviceDays: [], capacity: '' });
    setShowModal(true);
  };

  const handleAddArea = (district: any) => {
    setModalType('add-area');
    setSelectedDistrict(district);
    setFormInput({ districtName: '', areaName: '', serviceDays: [], capacity: '' });
    setShowModal(true);
  };

  const handleEditDistrict = (district: any) => {
    setModalType('edit-district');
    setSelectedDistrict(district);
    setFormInput({ ...formInput, districtName: district.name });
    setShowModal(true);
  };

  const handleEditArea = (district: any, area: any) => {
    setModalType('edit-area');
    setSelectedDistrict(district);
    setSelectedArea(area);
    setFormInput({
      ...formInput,
      areaName: area.name,
      serviceDays: area.serviceDays,
      capacity: area.capacity.toString()
    });
    setShowModal(true);
  };

  const handleDeleteDistrict = (district: any) => {
    setModalType('delete-district');
    setSelectedDistrict(district);
    setShowModal(true);
  };

  const handleDeleteArea = (district: any, area: any) => {
    setModalType('delete-area');
    setSelectedDistrict(district);
    setSelectedArea(area);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (modalType === 'add-district') {
      const newDistrict = {
        id: Math.random(),
        name: formInput.districtName,
        serviceAreas: []
      };
      setDistricts([...districts, newDistrict]);
    } 
    else if (modalType === 'edit-district') {
      setDistricts(districts.map(d => 
        d.id === selectedDistrict.id 
          ? { ...d, name: formInput.districtName }
          : d
      ));
    }
    else if (modalType === 'delete-district') {
      setDistricts(districts.filter(d => d.id !== selectedDistrict.id));
    }
    else if (modalType === 'add-area') {
      const newArea = {
        id: Math.random(),
        name: formInput.areaName,
        serviceDays: formInput.serviceDays,
        capacity: parseInt(formInput.capacity)
      };
      setDistricts(districts.map(d =>
        d.id === selectedDistrict.id
          ? { ...d, serviceAreas: [...d.serviceAreas, newArea] }
          : d
      ));
    }
    else if (modalType === 'edit-area') {
      setDistricts(districts.map(d =>
        d.id === selectedDistrict.id
          ? {
              ...d,
              serviceAreas: d.serviceAreas.map(a =>
                a.id === selectedArea.id
                  ? {
                      ...a,
                      name: formInput.areaName,
                      serviceDays: formInput.serviceDays,
                      capacity: parseInt(formInput.capacity)
                    }
                  : a
              )
            }
          : d
      ));
    }
    else if (modalType === 'delete-area') {
      setDistricts(districts.map(d =>
        d.id === selectedDistrict.id
          ? { ...d, serviceAreas: d.serviceAreas.filter(a => a.id !== selectedArea.id) }
          : d
      ));
    }

    setShowModal(false);
    setSelectedDistrict(null);
    setSelectedArea(null);
    setFormInput({ districtName: '', areaName: '', serviceDays: [], capacity: '' });
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
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none w-full bg-white shadow-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={handleAddDistrict}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add District</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredDistricts.map(district => (
              <div key={district.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleDistrict(district.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedDistricts.includes(district.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <h3 className="font-medium text-gray-900">{district.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddArea(district)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Area</span>
                    </button>
                    <button
                      onClick={() => handleEditDistrict(district)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDistrict(district)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {expandedDistricts.includes(district.id) && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Area Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Service Days</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Daily Capacity</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {district.serviceAreas.map(area => (
                          <tr key={area.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{area.name}</td>
                            <td className="px-6 py-4 text-gray-600">{area.serviceDays.join(', ')}</td>
                            <td className="px-6 py-4 text-gray-600">{area.capacity}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleEditArea(district, area)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteArea(district, area)}
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'add-district' ? 'Add District' :
          modalType === 'edit-district' ? 'Edit District' :
          modalType === 'delete-district' ? 'Delete District' :
          modalType === 'add-area' ? 'Add Service Area' :
          modalType === 'edit-area' ? 'Edit Service Area' :
          'Delete Service Area'
        }
        description={
          modalType === 'delete-district'
            ? `Are you sure you want to delete ${selectedDistrict?.name} and all its service areas?`
            : modalType === 'delete-area'
            ? `Are you sure you want to delete ${selectedArea?.name}?`
            : ''
        }
        confirmLabel={modalType.includes('delete') ? 'Delete' : 'Save'}
        onConfirm={handleSubmit}
        confirmButtonClass={`px-4 py-2 rounded-lg text-white ${
          modalType.includes('delete') ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-950 hover:bg-blue-900'
        } transition-colors`}
      >
        {!modalType.includes('delete') && (
          <div className="space-y-4">
            {(modalType === 'add-district' || modalType === 'edit-district') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District Name</label>
                <input
                  type="text"
                  value={formInput.districtName}
                  onChange={(e) => setFormInput({ ...formInput, districtName: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            )}
            
            {(modalType === 'add-area' || modalType === 'edit-area') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area Name</label>
                  <input
                    type="text"
                    value={formInput.areaName}
                    onChange={(e) => setFormInput({ ...formInput, areaName: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Days</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                     <label key={day} className="flex items-center gap-2 p-2 border rounded-lg">
                     <input
                       type="checkbox"
                       checked={formInput.serviceDays.includes(day)}
                       onChange={(e) => {
                         const updatedDays = e.target.checked
                           ? [...formInput.serviceDays, day]
                           : formInput.serviceDays.filter(d => d !== day);
                         setFormInput({ ...formInput, serviceDays: updatedDays });
                       }}
                       className="form-checkbox h-4 w-4 text-blue-950"
                     />
                     {day}
                   </label>
                 ))}
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Daily Capacity</label>
               <input
                 type="number"
                 value={formInput.capacity}
                 onChange={(e) => setFormInput({ ...formInput, capacity: e.target.value })}
                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
               />
             </div>
           </>
         )}
       </div>
     )}
   </Modal>
 </main>
);
};

export default ServiceArea;