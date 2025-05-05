import React, { useEffect, useState } from 'react';
import {
  User, Phone, Mail, MapPin, Award, Shield, Edit, Lock, CheckCircle, AlertCircle, Camera, X
} from 'lucide-react';
import { FaTransgender } from "react-icons/fa";
import { ChangePassword } from '../common/ChangePassword';
import ProfileSkeleton from '../collector/skeltons/ProfileSkelton';
import { ICollectorData } from '../../interfaces/interfaces';
import { getCollectorData, updateCollectorData, getDistricts, getServiceAreas } from "../../services/collectorService";

import { getDistrictAndServiceArea } from "../../services/locationService";

import toast from 'react-hot-toast';

interface ProfileProps {
  isVerified?: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  serviceArea?: string;
  district?: string;
  gender?: string;
}

interface IDistrict {
  _id: string;
  name: string;
}

interface IServiceArea {
  _id: string;
  name: string;
  districtId: string;
}

const ProfileCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border shadow-sm">
    <div className="md:p-6 xs:p-4 p-3 border-b xs:text-start text-center">
      <h3 className="md:text-lg xs:text-base text-sm font-semibold">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Profile: React.FC<ProfileProps> = () => {
  const [collectorData, setCollectorData] = useState<ICollectorData | null>(null);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [serviceAreas, setServiceAreas] = useState<IServiceArea[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [idFrontImage, setIdFrontImage] = useState<string | null>(null);
  const [idBackImage, setIdBackImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [district, setDistrict] = useState<string>('');
  const [serviceArea, setServiceArea] = useState<string>('');

  const idProofTypes = ['Aadhar', 'Voter-ID', 'Driving-License'];

  const performanceStats = [
    { label: "Pickups Completed", value: "1,234" },
    { label: "On-time Rate", value: "95%" },
    { label: "Customer Rating", value: "4.8/5" },
    { label: "Areas Covered", value: "3" }
  ];

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return "Full name is required";
        // if (/[^a-zA-Z\s]/.test(value)) return "Full name cannot contain special characters";
        break;
      case 'phone':
        if (!value.trim()) return "Phone number is required";
        if (!/^[0-9]{10}$/.test(value)) return "Phone number must be 10 digits";
        break;
      case 'serviceArea':
        if (!value.trim()) return "Service area is required";
        break;
      case 'district':
        if (!value.trim()) return "District is required";
        break;
      case 'gender':
        if (!value.trim()) return "Please select a gender";
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (collectorData) {
      const fields: Array<keyof Pick<ICollectorData, 'name' | 'phone' | 'serviceArea' | 'district' | 'gender'>> =
        ['name', 'phone', 'serviceArea', 'district', 'gender'];
      fields.forEach((field) => {
        const error = validateField(field, collectorData[field] || '');
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    fetchCollectorData();
  }, []);

  useEffect(() => {
    if (isEditing) {
      fetchDistricts();
    }
  }, [isEditing]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchServiceAreas(selectedDistrict);
    }
  }, [selectedDistrict]);

  
  const fetchCollectorData = async () => {
    setLoading(true);
    try {
      const response = await getCollectorData();
      console.log("response :", response);
      if(response.success){
        setCollectorData(response.data);
      }
      else{
        console.error(response.message);
      }
    } catch (error) {
      console.error("Failed to fetch collector data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await getDistricts();
      console.log("response :", response);
      if (response.success) {
        setDistricts(response.data);
        if (collectorData?.district) {
          setSelectedDistrict(collectorData.district);
        }
      } else {
        toast.error('Failed to fetch districts');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to load districts');
    }
  };

  const fetchServiceAreas = async (districtId: string) => {
    try {
      const response = await getServiceAreas(districtId);
      console.log("response :", response);
      if (response.success) {
        setServiceAreas(response.data);
      } else {
        toast.error('Failed to fetch service areas');
      }
    } catch (error) {
      console.error('Error fetching service areas:', error);
      toast.error('Failed to load service areas');
    }
  };

  useEffect(()=>{
    const fetchDistrictAndServiceArea = async () => {
      try{
        const response = await getDistrictAndServiceArea(collectorData?.district || '', collectorData?.serviceArea || '');
        console.log("district and service area response :", response);
        if(response.success){
          setDistrict(response.district.name);
          setServiceArea(response.serviceArea.name);
        }
      }catch(error){
        console.error("Error fetching district and service area:", error);
      }
    }
    fetchDistrictAndServiceArea();
  },[collectorData?.district, collectorData?.serviceArea])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollectorData((prev) => prev ? { ...prev, [name]: value } : null);

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setCollectorData(prev => prev ? { ...prev, idProofType: value } : null);
  };

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      if (type === 'front') {
        setIdFrontImage(imageUrl);
      } else {
        setIdBackImage(imageUrl);
      }
    }
  };

  const clearIdImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      setIdFrontImage(null);
    } else {
      setIdBackImage(null);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedDistrict(value);
    setCollectorData(prev => prev ? { ...prev, district: value, serviceArea: '' } : null);
    setServiceAreas([]);
  };

  const handleServiceAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setCollectorData(prev => prev ? { ...prev, serviceArea: value } : null);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCollectorData((prev) => prev ? { ...prev, [name]: value } : null);

    // Clear the error for gender if a valid option is selected
    if (name === 'gender' && value) {
      setErrors((prev) => ({
        ...prev,
        gender: undefined, // Clear the error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation for ID proof images
    if ((idFrontImage || collectorData?.idProofFrontUrl) && 
        !(idBackImage || collectorData?.idProofBackUrl)) {
      toast.error("Please upload both sides of your ID proof");
      return;
    }
    if (!(idFrontImage || collectorData?.idProofFrontUrl) && 
        (idBackImage || collectorData?.idProofBackUrl)) {
      toast.error("Please upload both sides of your ID proof");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    const formData = new FormData();

    if (collectorData?.name) formData.append('name', collectorData.name);
    if (collectorData?.phone) formData.append('phone', collectorData.phone);
    if (collectorData?.serviceArea) formData.append('serviceArea', collectorData.serviceArea);
    if (collectorData?.district) formData.append('district', collectorData.district);
    if (collectorData?.gender) formData.append('gender', collectorData.gender);
    if (collectorData?.idProofType) formData.append('idProofType', collectorData.idProofType);

    // Handle image uploads
    if (uploadedImage) {
      try {
        const imageFile = await fetch(uploadedImage)
          .then(res => res.blob())
          .then(blob => new File([blob], 'profile.jpg', { type: 'image/jpeg' }));
        formData.append('profileImage', imageFile);
      } catch (error) {
        console.error("Error processing profile image:", error);
      }
    }

    if (idFrontImage) {
      try {
        const frontFile = await fetch(idFrontImage)
          .then(res => res.blob())
          .then(blob => new File([blob], 'idfront.jpg', { type: 'image/jpeg' }));
        formData.append('idProofFront', frontFile);
      } catch (error) {
        console.error("Error processing ID front image:", error);
      }
    }

    if (idBackImage) {
      try {
        const backFile = await fetch(idBackImage)
          .then(res => res.blob())
          .then(blob => new File([blob], 'idback.jpg', { type: 'image/jpeg' }));
        formData.append('idProofBack', backFile);
      } catch (error) {
        console.error("Error processing ID back image:", error);
      }
    }

    try {
      console.log("formData :", formData);
      const response = await updateCollectorData(formData);
      console.log("response :", response);
      if (response.success) {
        toast.success("Profile updated");
        setIsEditing(false);
        await fetchCollectorData();
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUploadedImage(null);
    setIdFrontImage(null);
    setIdBackImage(null);
    setErrors({});
    fetchCollectorData();
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        <ProfileCard title="Profile Details">
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>

              <div className="flex xs:justify-end justify-center items-center">
                {collectorData?.verificationStatus === "approved" ? (
                  <div className="flex items-center text-green-600 gap-1">
                    <CheckCircle className="xs:w-4 w-2 xs:h-4 h-2" />
                    <span className="xs:text-sm text-xs">Verified</span>
                  </div>
                ) : collectorData?.verificationStatus === "rejected" ? (
                  <div className="flex items-center text-red-600 gap-1">
                    <AlertCircle className="xs:w-4 w-2 xs:h-4 h-2" />
                    <span className="xs:text-sm text-xs">Verification Rejected</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600 gap-1">
                    <AlertCircle className="xs:w-4 w-2 xs:h-4 h-2" />
                    <span className="xs:text-sm text-xs">Verification Pending</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="relative group">
                  {uploadedImage || collectorData?.profileUrl ? (
                    <img
                      src={uploadedImage || collectorData?.profileUrl}
                      alt="Profile"
                      className="sm:w-20 sm:h-20 w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="sm:w-20 sm:h-20 w-14 h-14 rounded-full border-2 border-white shadow-lg overflow-hidden">
                      <User className="w-full h-full p-4 bg-gray-200" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <label htmlFor="profileImage" className="cursor-pointer">
                        <Camera className="sm:w-6 sm:h-6 w-4 h-4 text-white" />
                      </label>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                <h2 className="lg:text-xl md:text-base xs:text-sm text-xs font-semibold xs:mt-4 mt-2">
                  {collectorData?.name}
                </h2>
                <span className="xs:text-sm text-xs text-gray-500">ID: {collectorData?.collectorId}</span>

                {collectorData?.verificationStatus === "pending" && (
                  <div className="mt-4 text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="xs:text-sm text-xs text-yellow-600">
                        To verify your profile, complete your profile and submit for review.
                      </p>
                    </div>
                  </div>
                )}
                {collectorData?.verificationStatus === "requested" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="xs:text-sm text-xs text-yellow-600">
                      Your profile verification has been requested. Please wait for approval.
                    </p>
                  </div>
                )}
                {collectorData?.verificationStatus === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="xs:text-sm text-xs text-red-600">
                      Your profile verification has been rejected. Please contact support.
                    </p>
                  </div>
                )}

              </div>

              <div className="space-y-6">
                {/* Personal Details Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Details</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={collectorData?.name || ''}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-700">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    value={collectorData?.email}
                    disabled={true}
                    className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-1">
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={collectorData?.phone || ''}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-700">{errors.phone}</p>
                  )}
                </div>

                      <div className="col-span-1">
                        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                          <span className="flex items-center gap-2">
                            <FaTransgender className="w-4 h-4" /> Gender
                          </span>
                        </label>
                        {isEditing ? (
                          <select
                            name="gender"
                            value={collectorData?.gender || ''}
                            onChange={handleSelectChange}
                            className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
                          >
                            <option value="" disabled>--Select Gender--</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={collectorData?.gender || 'N/A'}
                            disabled
                            className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50"
                          />
                        )}
                        {errors.gender && (
                          <p className="mt-1 text-xs text-red-700">{errors.gender}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> District
                    </span>
                  </label>
                  {isEditing ? (
                    <select
                      name="district"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
                    >
                            <option value="" disabled>--Select District--</option>
                      {districts.map((district) => (
                        <option key={district._id} value={district._id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={district || 'N/A'}
                      disabled
                      className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50"
                    />
                  )}
                  {errors.district && (
                    <p className="mt-1 text-xs text-red-700">{errors.district}</p>
                  )}
              </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Service Area
                    </span>
                  </label>
                  {isEditing ? (
                    <select
                      name="serviceArea"
                      value={collectorData?.serviceArea || ''}
                      onChange={handleServiceAreaChange}
                      disabled={!selectedDistrict}
                      className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
                    >
                            <option value="" disabled>--Select Service Area--</option>
                      {serviceAreas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={serviceArea || 'N/A'}
                      disabled
                      className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50"
                    />
                  )}
                  {errors.serviceArea && (
                    <p className="mt-1 text-xs text-red-700">{errors.serviceArea}</p>
                  )}
                </div>
              </div>

                    {/* ID Proof Section */}
                  <div>
                    <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4" /> ID Proof
                      </span>
                    </label>
                      
                      {isEditing ? (
                        <div className="space-y-4">
                    <select
                            name="idProofType"
                      value={collectorData?.idProofType || ''}
                      onChange={handleIdProofChange}
                            className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
                    >
                            <option value="" disabled>Select ID Proof Type</option>
                      {idProofTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                      ))}
                    </select>

                  {collectorData?.idProofType && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="relative">
                          {idFrontImage || collectorData?.idProofFrontUrl ? (
                            <div className="relative">
                              <img
                                src={idFrontImage || collectorData?.idProofFrontUrl}
                                alt="ID Front"
                                className="w-full h-52 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => clearIdImage('front')}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                              <Camera className="w-8 h-8 text-gray-400" />
                                      <span className="mt-2 text-sm text-gray-500">Upload Front Side</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleIdImageChange(e, 'front')}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                                <p className="mt-1 text-xs text-gray-500 text-center">Front Side</p>
                      </div>

                      <div>
                        <div className="relative">
                          {idBackImage || collectorData?.idProofBackUrl ? (
                            <div className="relative">
                              <img
                                src={idBackImage || collectorData?.idProofBackUrl}
                                alt="ID Back"
                                className="w-full h-52 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => clearIdImage('back')}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                              <Camera className="w-8 h-8 text-gray-400" />
                                      <span className="mt-2 text-sm text-gray-500">Upload Back Side</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleIdImageChange(e, 'back')}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                                <p className="mt-1 text-xs text-gray-500 text-center">Back Side</p>
                      </div>
                    </div>
                  )}
                </div>
                      ) : (
                        collectorData?.idProofFrontUrl && collectorData?.idProofBackUrl ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <img
                                src={collectorData.idProofFrontUrl}
                                alt="ID Front"
                                className="w-full h-52 object-cover rounded-lg"
                              />
                              <p className="mt-1 text-xs text-gray-500 text-center">Front Side</p>
                            </div>
                            <div>
                              <img
                                src={collectorData.idProofBackUrl}
                                alt="ID Back"
                                className="w-full h-52 object-cover rounded-lg"
                              />
                              <p className="mt-1 text-xs text-gray-500 text-center">Back Side</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500 xs:text-sm text-xs">N/A</div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center gap-2 px-4 xs:py-2 py-1 xs:text-base text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Lock className="xs:w-4 xs:h-4 w-3 h-3" />
                  Change Password
                </button>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors flex justify-center gap-2"
                  >
                    <Edit className='w-4 h-4'/>
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          )}

        </ProfileCard>
        <ProfileCard title="Performance Overview">
          <div className="grid xs:grid-cols-2 grid-cols-1 gap-4">
            {performanceStats.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="md:text-2xl xs:text-xl text-lg font-bold">{stat.value}</div>
                <div className="md:text-sm xs:text-xs text-xxs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="md:text-base xs:text-sm text-xs font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Award className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-yellow-500" />
                <span className="md:text-sm xs:text-xs text-xxs">Perfect Attendance - December 2024</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-yellow-500" />
                <span className="md:text-sm xs:text-xs text-xxs">Top Performer - Q4 2024</span>
              </div>
            </div>
          </div>
        </ProfileCard>
      </div >

      {showChangePassword && (
        <ChangePassword 
            isOpen={showChangePassword}
            onClose={() => setShowChangePassword(false)} 
            role="collector" 
        />
      )}
    </main >
  );
};

export default Profile;
