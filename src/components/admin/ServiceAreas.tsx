import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, ChevronUp, MapPin, X, LocateFixed } from 'lucide-react';
import Modal from '../common/Modal';
import { keralaDistricts } from "../../data/districts";
import { addDistrict, getDistrictsWithServiceAreas, updateDistrict, deleteDistrict, addServiceArea } from '../../services/adminService';
import toast from 'react-hot-toast';
import axios from 'axios';


interface IServiceArea {
  _id: string;
  name: string;
  center: { type: string; coordinates: [number, number] };
  location: string;
  postalCodes: string[];
  capacity: number;
  serviceDays: string[];
  collectors: string[];
}

interface IDistrict {
  _id: string;
  name: string;
  serviceAreas: IServiceArea[];
}

interface ILocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface IFormInput {
  name: string;
  districtId: string;
  center: {
    type: string;
    coordinates: [number, number];
  };
  location: string;
  postalCodes: string[];
  capacity: string;
  serviceDays: string[];
}


const ServiceAreas: React.FC = () => {
  const [locationSuggestions, setLocationSuggestions] = useState<ILocationSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [district, setDistrict] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add-district' | 'edit-district' | 'delete-district' | 'add-area' | 'edit-area' | 'delete-area'>('add-district');
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [expandedDistricts, setExpandedDistricts] = useState<string[]>([]);
  const [formInput, setFormInput] = useState<IFormInput>({
    name: '',
    districtId: '',
    capacity: '',
    location: '',
    postalCodes: [],
    center: {
      type: 'Point',
      coordinates: [0, 0]
    },
    serviceDays: []
  });

  const [newPostalCode, setNewPostalCode] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Add error state to track field-specific errors
  const [errors, setErrors] = useState<{
    name?: string;
    serviceDays?: string;
    capacity?: string;
    location?: string;
    postalCodes?: string;
  }>({});

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      const response = await getDistrictsWithServiceAreas();
      console.log("response :", response);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      setError('Failed to fetch districts. Please try again later.');
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.serviceAreas.some(area =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleDistrict = (districtId: string) => {
    setExpandedDistricts(prev =>
      prev.includes(districtId)
        ? prev.filter(id => id !== districtId)
        : [...prev, districtId]
    );
  };

  const handleAddDistrict = () => {
    setModalType('add-district');
    setDistrict('');
    setShowModal(true);
  };

  const handleEditDistrict = (district: any) => {
    setModalType('edit-district');
    setSelectedDistrict(district);
    setDistrict(district.name);
    setShowModal(true);
  };

  const handleDeleteDistrict = (district: any) => {
    setModalType('delete-district');
    setSelectedDistrict(district);
    setShowModal(true);
  };

  const handleAddArea = (district: any) => {
    setModalType('add-area');
    setSelectedDistrict(district);
    setFormInput({ districtId: district._id, name: '', serviceDays: [], capacity: '', location: '', postalCodes: [], center: { type: 'Point', coordinates: [0, 0] } });
    setShowModal(true);
  };

  const handleEditArea = (district: any, area: any) => {
    setModalType('edit-area');
    setSelectedDistrict(district);
    setSelectedArea(area);
    setFormInput({
      ...formInput,
      name: area.name,
      serviceDays: area.serviceDays,
      capacity: area.capacity.toString(),
      location: area.location,
    });
    setShowModal(true);
  };

  const handleDeleteArea = (district: any, area: any) => {
    setModalType('delete-area');
    setSelectedDistrict(district);
    setSelectedArea(area);
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors: any = {};

    // For district operations
    if ((modalType === 'add-district' || modalType === 'edit-district') && !district) {
      newErrors.district = 'Please select a district';
    }

    // For service area operations
    if (modalType === 'add-area' || modalType === 'edit-area') {
      if (!formInput.name.trim()) {
        newErrors.name = 'Area name is required';
      }

      if (!formInput.serviceDays.length) {
        newErrors.serviceDays = 'Please select at least one service day';
      }

      if (!formInput.capacity || parseInt(formInput.capacity) <= 0) {
        newErrors.capacity = 'Please enter a valid capacity (greater than 0)';
      }

      if (!formInput.location.trim()) {
        newErrors.location = 'Location is required';
      }

      if (!formInput.postalCodes.length) {
        newErrors.postalCodes = 'Please add at least one postal code';
      }

      if (formInput.center.coordinates[0] === 0 && formInput.center.coordinates[1] === 0) {
        newErrors.location = 'Please select a valid location from the suggestions or use current location';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (modalType === 'add-district') {
      console.log("district :", district);
      const response = await addDistrict(district);
      if (response.success) {
        setDistricts([...districts, response.data]);
        console.log("districts :", districts);
        toast.success('New District added.');
      }
    }
    else if (modalType === 'edit-district') {
      console.log("selectedDistrict :", selectedDistrict);
      const response = await updateDistrict(selectedDistrict._id, district);
      console.log("response :", response);
      if (response.success) {
        await fetchDistricts();
        toast.success('District updated.');
      } else {
        toast.error(response.message);
      }
      setDistrict('');
    }
    else if (modalType === 'delete-district') {
      console.log("selectedDistrict :", selectedDistrict);
      const response = await deleteDistrict(selectedDistrict._id);
      if (response.success) {
        await fetchDistricts();
        toast.success('District deleted.');
      }
    }
    else if (modalType === 'add-area') {
      console.log("formInput :", formInput);
      const response = await addServiceArea(formInput);
      if (response.success) {
        console.log("response :", response);
        await fetchDistricts();
        toast.success('New Service Area added.');
      }
    }
    else if (modalType === 'edit-area') {
      // setDistricts(districts.map(d =>
      //   d._id === selectedDistrict._id
      //     ? {
      //       ...d,
      //       serviceAreas: d.serviceAreas.map(a =>
      //         a._id === selectedArea._id
      //           ? {
      //             ...a,
      //             name: formInput.name,
      //             serviceDays: formInput.serviceDays,
      //             capacity: parseInt(formInput.capacity),
      //             location: formInput.location,
      //             radius: parseInt(formInput.radius),
      //             center: formInput.center,
      //           }
      //           : a
      //       )
      //     }
      //     : d
      // ));
    }
    else if (modalType === 'delete-area') {
      // setDistricts(districts.map(d =>
      //   d._id === selectedDistrict._id
      //     ? { ...d, serviceAreas: d.serviceAreas.filter(a => a._id !== selectedArea._id) }
      //     : d
      // ));
    }

    setShowModal(false);
    setSelectedDistrict(null);
    setSelectedArea(null);
    setFormInput({ districtId: '', name: '', serviceDays: [], capacity: '', location: '', postalCodes: [], center: { type: 'Point', coordinates: [0, 0] } });
  };

  const fetchLocationSuggestions = async (query: string) => {
    if (!query) {
      setLocationSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await axios.get(
        `https://api.locationiq.com/v1/autocomplete`, {
          params: {
            key: 'pk.99d62c10fe5ff3c54c5d6e83671878ec',
            q: query,
            limit: 5,
            dedupe: 1
          }
        }
      );
      setLocationSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
    }
    setIsLoadingSuggestions(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formInput.location) {
        fetchLocationSuggestions(formInput.location);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [formInput.location]);

  const handleLocationSelect = (suggestion: ILocationSuggestion) => {
    console.log("suggestion :", suggestion);
    setFormInput({
      ...formInput,
      center: {
        type: 'Point',
        coordinates: [Number(suggestion.lat), Number(suggestion.lon)]
      },
      location: suggestion.display_name
    });
    console.log("formInput :", formInput);
    setShowSuggestions(false);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Perform reverse geocoding using LocationIQ API
            const response = await axios.get(
              `https://api.locationiq.com/v1/reverse`, {
              params: {
                key: 'pk.99d62c10fe5ff3c54c5d6e83671878ec',
                lat: latitude,
                lon: longitude,
                format: 'json',
                'accept-language': 'en'
              }
            });

            const locationData = response.data;
            
            setFormInput({
              ...formInput,
              center: {
                type: 'Point',
                coordinates: [latitude, longitude]
              },
              location: locationData.display_name
            });
            
            setShowSuggestions(false);
          } catch (error) {
            console.error('Error getting location details:', error);
            setFormInput({
              ...formInput,
              center: {
                type: 'Point',
                coordinates: [latitude, longitude]
              },
              location: `${latitude}, ${longitude}`
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  // Add validation for postal code input
  const handleAddPostalCode = () => {
    const postalCodeRegex = /^\d{6}$/;  // Indian postal code format
    
    if (!newPostalCode.trim()) {
      toast.error('Please enter a postal code');
      return;
    }

    if (!postalCodeRegex.test(newPostalCode)) {
      toast.error('Please enter a valid 6-digit postal code');
      return;
    }

    if (formInput.postalCodes.includes(newPostalCode)) {
      toast.error('This postal code has already been added');
      return;
    }

    setFormInput({
      ...formInput,
      postalCodes: [...formInput.postalCodes, newPostalCode]
    });
    setNewPostalCode('');
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
            {districts.length > 0 && (
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
            )}
            <button
              onClick={handleAddDistrict}
              className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add District</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredDistricts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No districts found.
              </div>
            ) : (
              filteredDistricts.map(district => (
                <div key={district._id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleDistrict(district._id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedDistricts.includes(district._id) ? (
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

                  {expandedDistricts.includes(district._id) && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Area Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Service Days</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Daily Capacity</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Location</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Postal Codes</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {district.serviceAreas.map(area => (
                            <tr key={area._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-3 font-medium text-gray-900">{area.name}</td>
                              <td className="px-6 py-3 text-gray-600">
                                {area.serviceDays.map(day => day.slice(0, 3)).join(', ')}
                              </td>
                              <td className="px-6 py-3 text-gray-600">{area.capacity}</td>
                              <td className="px-6 py-3 text-gray-600">{area.location}</td>
                              <td className="px-6 py-3 text-gray-600">
                                {area.postalCodes.join(', ')}
                              </td>
                              <td className="px-6 py-3 text-right">
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
              ))
            )}
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
        confirmButtonClass={`px-4 py-2 rounded-lg text-white ${modalType.includes('delete') ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-950 hover:bg-blue-900'
          } transition-colors`}
      >
        {!modalType.includes('delete') && (
          <div className="space-y-4">
            {(modalType === 'add-district' || modalType === 'edit-district') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District Name</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none z-10"
                >
                  <option value="" className='text-gray-400' disabled selected>--Select a district--</option>
                  {keralaDistricts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(modalType === 'add-area' || modalType === 'edit-area') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formInput.name}
                    onChange={(e) => {
                      setFormInput({ ...formInput, name: e.target.value });
                      if (errors.name) {
                        setErrors({ ...errors, name: undefined });
                      }
                    }}
                    className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Days</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <label key={day} className="flex items-center gap-2 p-2 border rounded-lg">
                        <input
                          type="checkbox"
                          name="serviceDays"
                          checked={formInput.serviceDays.includes(day)}
                          onChange={(e) => {
                            const updatedDays = e.target.checked
                              ? [...formInput.serviceDays, day]
                              : formInput.serviceDays.filter(d => d !== day);
                            setFormInput({ ...formInput, serviceDays: updatedDays });
                            if (errors.serviceDays) {
                              setErrors({ ...errors, serviceDays: undefined });
                            }
                          }}
                          className="form-checkbox h-4 w-4 text-blue-950"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  {errors.serviceDays && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceDays}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formInput.capacity}
                    onChange={(e) => {
                      setFormInput({ ...formInput, capacity: e.target.value });
                      if (errors.capacity) {
                        setErrors({ ...errors, capacity: undefined });
                      }
                    }}
                    className={`w-full p-2 border ${errors.capacity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Postal Codes
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPostalCode}
                        onChange={(e) => {
                          setNewPostalCode(e.target.value);
                          if (errors.postalCodes) {
                            setErrors({ ...errors, postalCodes: undefined });
                          }
                        }}
                        placeholder="Enter postal code"
                        className={`flex-1 p-2 text-sm border ${errors.postalCodes ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
                      />
                      <button
                        type="button"
                        onClick={handleAddPostalCode}
                        className="px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {errors.postalCodes && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCodes}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formInput.postalCodes.map((code, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg"
                        >
                          <span className="text-sm">{code}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormInput({
                                ...formInput,
                                postalCodes: formInput.postalCodes.filter((_, i) => i !== index)
                              });
                            }}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-[8]">
                      <input
                        type="text"
                        name="location"
                        value={formInput.location}
                        onChange={(e) => {
                          setFormInput({ ...formInput, location: e.target.value });
                          setShowSuggestions(true);
                          if (errors.location) {
                            setErrors({ ...errors, location: undefined });
                          }
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for a location"
                        className={`w-full p-2 pl-10 pr-10 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none`}
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                      )}
                      <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      {formInput.location && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormInput({ 
                              ...formInput, 
                              location: '', 
                              center: { type: 'Point', coordinates: [0, 0] } 
                            });
                            setLocationSuggestions([]);
                            setShowSuggestions(false);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      {showSuggestions && formInput.location && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {isLoadingSuggestions ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                          ) : locationSuggestions.length > 0 ? (
                            <ul className="max-h-60 overflow-auto">
                              {locationSuggestions.map((suggestion, index) => (
                                <li
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-start gap-2"
                                  onClick={() => handleLocationSelect(suggestion)}
                                >
                                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{suggestion.display_name}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="p-4 text-center text-gray-500">No results found</div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      className="flex-1 flex items-center justify-center p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                      title="Use current location"
                    >
                      <LocateFixed className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
};

export default ServiceAreas;