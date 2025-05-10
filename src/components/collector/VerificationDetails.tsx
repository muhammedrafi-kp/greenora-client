import React from 'react';
import { MapPin, Shield, Camera, X } from 'lucide-react';
import { ICollector } from '../../types/user';

interface VerificationDetailsProps {
  isEditing: boolean;
  collectorData: ICollector | null;
  districts: Array<{ _id: string; name: string }>;
  serviceAreas: Array<{ _id: string; name: string }>;
  errors: { district?: string; serviceArea?: string };
  handleDistrictChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleServiceAreaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleIdProofChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleIdImageChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => void;
  clearIdImage: (type: 'front' | 'back') => void;
  idFrontImage: string | null;
  idBackImage: string | null;
}

const idProofTypes = ['Aadhar', 'Voter-ID', 'Driving-License'];

const VerificationDetails: React.FC<VerificationDetailsProps> = ({
  isEditing,
  collectorData,
  districts,
  serviceAreas,
  errors,
  handleDistrictChange,
  handleServiceAreaChange,
  handleIdProofChange,
  handleIdImageChange,
  clearIdImage,
  idFrontImage,
  idBackImage,
}) => {
  return (
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
              value={collectorData?.district || ''}
              onChange={handleDistrictChange}
              className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={collectorData?.district || 'N/A'}
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
              disabled={!collectorData?.district}
              className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
            >
              <option value="">Select Service Area</option>
              {serviceAreas.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={collectorData?.serviceArea || 'N/A'}
              disabled
              className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50"
            />
          )}
          {errors.serviceArea && (
            <p className="mt-1 text-xs text-red-700">{errors.serviceArea}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="space-y-4">
          <div>
            <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> ID Proof Type
              </span>
            </label>
            <select
              value={collectorData?.idProofType || ''}
              onChange={handleIdProofChange}
              className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg"
            >
              <option value="" className='text-gray-400' disabled selected>--Select ID Proof--</option>
              {idProofTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* ID Proof Image Upload Section */}
          {collectorData?.idProofType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Side */}
              <div>
                <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                  Front Side
                </label>
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Upload front side</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIdImageChange(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Back Side */}
              <div>
                <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                  Back Side
                </label>
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Upload back side</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIdImageChange(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationDetails; 