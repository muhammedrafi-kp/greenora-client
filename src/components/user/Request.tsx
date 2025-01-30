// import React, { useState } from 'react';
// import { Calendar, ChevronDown, ChevronUp, Trash2, Recycle, CheckCircle, CreditCard, Truck, MapPin } from 'lucide-react';

// const PickupRequest = () => {
// const [pickupType, setPickupType] = useState('');
// const [currentStep, setCurrentStep] = useState(0);
// const [selectedAddress, setSelectedAddress] = useState('');
// const [showNewAddress, setShowNewAddress] = useState(false);
// const [formData, setFormData] = useState({
//     wasteCategory: '',
//     quantity: '',
//     preferredDate: '',
//     location: '',
//     contactNo: '',
//     description: '',
//     scrapType: '',
//     scrapQuantity: '',
//     scrapPreferredDate: '',
//     scrapLocation: '',
//     scrapContactNo: '',
//     scrapDescription: '',
//     newAddress: {
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//     }
// });

// // Sample existing addresses
// const existingAddresses = [
//     { id: 1, address: '123 Main St, Apt 4B, New York, NY 10001' },
//     { id: 2, address: '456 Park Ave, Suite 201, New York, NY 10002' },
// ];

// const steps = [
//     { number: 1, name: 'Address' },
//     { number: 2, name: 'Details' },
//     { number: 3, name: 'Review' },
//     { number: 4, name: 'Payment' }
// ];


//     const handleChange = (e:any) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };


//     const handlePickupTypeSelect = (type:any) => {
//         setPickupType(type);
//         setCurrentStep(1);
//     };

//     const handleAddressSelect = (address: string) => {
//         setSelectedAddress(address);
//         setShowNewAddress(false);
//     };

//     const renderAddressSelection = () => (
//         <div className="space-y-6">
//             <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Pickup Address</h3>
                
//                 <div className="space-y-4">
//                     {existingAddresses.map((addr) => (
//                         <div
//                             key={addr.id}
//                             onClick={() => handleAddressSelect(addr.address)}
//                             className={`p-4 border rounded-lg cursor-pointer transition-all ${
//                                 selectedAddress === addr.address
//                                     ? 'border-green-500 bg-green-50'
//                                     : 'border-gray-200 hover:border-green-200'
//                             }`}
//                         >
//                             <div className="flex items-start gap-3">
//                                 <MapPin className="w-5 h-5 text-gray-500 mt-1" />
//                                 <div>
//                                     <p className="text-sm text-gray-800">{addr.address}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                     <div className="mt-6">
//                         <button
//                             type="button"
//                             onClick={() => setShowNewAddress(!showNewAddress)}
//                             className="text-green-600 text-sm font-medium hover:text-green-700"
//                         >
//                             + Add New Address
//                         </button>

//                         {showNewAddress && (
//                             <div className="mt-4 space-y-4">
//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-1 block">Street Address</label>
//                                     <input
//                                         type="text"
//                                         name="newAddress.street"
//                                         value={formData.newAddress.street}
//                                         onChange={handleChange}
//                                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                                         placeholder="Enter street address"
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
//                                         <input
//                                             type="text"
//                                             name="newAddress.city"
//                                             value={formData.newAddress.city}
//                                             onChange={handleChange}
//                                             className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                                             placeholder="Enter city"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
//                                         <input
//                                             type="text"
//                                             name="newAddress.state"
//                                             value={formData.newAddress.state}
//                                             onChange={handleChange}
//                                             className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                                             placeholder="Enter state"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-1 block">ZIP Code</label>
//                                     <input
//                                         type="text"
//                                         name="newAddress.zipCode"
//                                         value={formData.newAddress.zipCode}
//                                         onChange={handleChange}
//                                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                                         placeholder="Enter ZIP code"
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className="flex gap-4">
//                 <button
//                     type="button"
//                     onClick={() => setCurrentStep(0)}
//                     className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
//                 >
//                     Back
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => setCurrentStep(2)}
//                     disabled={!selectedAddress && !formData.newAddress.street}
//                     className="w-1/2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg text-sm font-medium"
//                 >
//                     Continue
//                 </button>
//             </div>
//         </div>
//     );

//     const StepperWithLines = () => (
//         <div className="w-full py-4">
//             <div className="relative flex items-center justify-between">
//                 <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-gray-200" />
//                 <div
//                     className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-green-500 transition-all duration-300"
//                     style={{ right: `${100 - (((currentStep - 1) / (steps.length - 1)) * 80 + 10)}%` }}
//                 />
//                 <div className="relative z-10 w-full flex justify-between">
//                     {steps.map((step) => (
//                         <div key={step.number} className="flex flex-col items-center flex-1">
//                             <div
//                                 className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
//                                 border-2 transition-all duration-300 
//                                 ${step.number <= currentStep
//                                     ? 'border-green-500 bg-green-500 text-white'
//                                     : 'border-gray-300 bg-white text-gray-500'}`}
//                             >
//                                 {step.number}
//                             </div>
//                             <span className={`mt-2 text-xs font-medium
//                                 ${step.number <= currentStep ? 'text-green-600' : 'text-gray-500'}`}
//                             >
//                                 {step.name}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );

   

//     const renderPickupTypeSelection = () => (
//         <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-6">
//                 <div
//                     onClick={() => handlePickupTypeSelect('waste')}
//                     className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                 >
//                     <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
//                         <Trash2 className="w-6 h-6 text-green-600" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Waste Pickup</h3>
//                     <p className="text-sm text-gray-600">Schedule a pickup for your household or recyclable waste</p>
//                 </div>

//                 <div
//                     onClick={() => handlePickupTypeSelect('scrap')}
//                     className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                 >
//                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//                         <Recycle className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Scrap Pickup</h3>
//                     <p className="text-sm text-gray-600">Schedule a pickup for your recyclable scrap materials</p>
//                 </div>
//             </div>
//         </div>
//     );

//     const renderWasteForm = () => (
//         <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
//             <div className="mt-8 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Waste Category</label>
//                         <select
//                             name="wasteCategory"
//                             value={formData.wasteCategory}
//                             onChange={handleChange}
//                             className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
//                         >
//                             <option value="">Select category</option>
//                             <option value="household">Household Waste</option>
//                             <option value="recyclable">Recyclable Waste</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
//                         <select
//                             name="quantity"
//                             value={formData.quantity}
//                             onChange={handleChange}
//                             className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
//                         >
//                             <option value="">Select quantity</option>
//                             <option value="small">Small (1-2 bags)</option>
//                             <option value="medium">Medium (3-5 bags)</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">Food waste</span>
//                     <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">Household items</span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
//                         <div className="relative">
//                             <input
//                                 type="date"
//                                 name="preferredDate"
//                                 value={formData.preferredDate}
//                                 onChange={handleChange}
//                                 className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                             />
//                             <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
//                         </div>
//                     </div>
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Contact No</label>
//                         <input
//                             type="tel"
//                             name="contactNo"
//                             value={formData.contactNo}
//                             onChange={handleChange}
//                             className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                             placeholder="Enter your contact number"
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
//                     <input
//                         type="text"
//                         name="location"
//                         value={formData.location}
//                         onChange={handleChange}
//                         placeholder="Enter your location"
//                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
//                     <textarea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         placeholder="Add any additional details..."
//                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
//                     />
//                 </div>
//             </div>
//         </div>
//     );

//     const renderScrapForm = () => (
//         <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
//             <div className="mt-8 space-y-4">
//                 <div className="text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-700 transition-colors">
//                     Know current scrap prices →
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Scrap Type</label>
//                         <select
//                             name="scrapType"
//                             value={formData.scrapType}
//                             onChange={handleChange}
//                             className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
//                         >
//                             <option value="">Select type</option>
//                             <option value="metal">Metal Scrap</option>
//                             <option value="paper">Paper</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
//                         <input
//                             type="text"
//                             name="scrapQuantity"
//                             value={formData.scrapQuantity}
//                             onChange={handleChange}
//                             placeholder="Enter approximate weight"
//                             className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                         />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
//                         <div className="relative">
//                             <input
//                                 type="date"
//                                 name="scrapPreferredDate"
//                                 value={formData.scrapPreferredDate}
//                                 onChange={handleChange}
//                                 className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                             />
//                             <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
//                         </div>
//                     </div>
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Contact No</label>
//                         <input
//                             type="tel"
//                             name="scrapContactNo"
//                             value={formData.scrapContactNo}
//                             onChange={handleChange}
//                             placeholder="Enter your contact number"
//                             className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
//                     <input
//                         type="text"
//                         name="scrapLocation"
//                         value={formData.scrapLocation}
//                         onChange={handleChange}
//                         placeholder="Enter your location"
//                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
//                     <textarea
//                         name="scrapDescription"
//                         value={formData.scrapDescription}
//                         onChange={handleChange}
//                         placeholder="Add any additional details..."
//                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
//                     />
//                 </div>
//             </div>
//         </div>
//     );

//     const renderDetailsForm = () => (
//         <form className="space-y-6">
//             {pickupType === 'waste' ? renderWasteForm() : renderScrapForm()}
//             <button
//                 type="button"
//                 onClick={() => setCurrentStep(3)}
//                 className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg transition-colors text-base font-semibold shadow-sm hover:shadow-md"
//             >
//                 Continue
//             </button>
//         </form>
//     );

//     const renderConfirmationPage = () => (
//         <div className="space-y-6">
//             <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
//                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <CheckCircle className="w-6 h-6 text-green-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Review Your Request</h3>
//                 <p className="text-gray-600 text-sm">Please confirm the details before proceeding to payment</p>
//             </div>

//             <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
//                 {pickupType === 'waste' ? (
//                     <>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-sm font-medium text-gray-600">Waste Category</span>
//                             <span className="text-sm text-gray-800">{formData.wasteCategory || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-sm font-medium text-gray-600">Quantity</span>
//                             <span className="text-sm text-gray-800">{formData.quantity || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-sm font-medium text-gray-600">Pickup Date</span>
//                             <span className="text-sm text-gray-800">{formData.preferredDate || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm font-medium text-gray-600">Location</span>
//                             <span className="text-sm text-gray-800">{formData.location || 'Not specified'}</span>
//                         </div>
//                     </>
//                 ) : (
//             <>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-sm font-medium text-gray-600">Scrap Type</span>
//                             <span className="text-sm text-gray-800">{formData.scrapType || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-sm font-medium text-gray-600">Quantity</span>
//                             <span className="text-sm text-gray-800">{formData.scrapQuantity || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-sm font-medium text-gray-600">Pickup Date</span>
//                             <span className="text-sm text-gray-800">{formData.scrapPreferredDate || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm font-medium text-gray-600">Location</span>
//                             <span className="text-sm text-gray-800">{formData.scrapLocation || 'Not specified'}</span>
//                         </div>
//                     </>
//                 )}
//             </div>

//             <div className="flex gap-4">
//                 <button type="button" onClick={() => setCurrentStep(2)}
//                     className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium">
//                     Edit Details
//                 </button>
//                 <button type="button" onClick={() => setCurrentStep(4)}
//                     className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium">
//                     Proceed to Payment
//                 </button>
//             </div>
//         </div>
//     );

//     const renderPaymentPage = () => (
//         <div className="space-y-6">
//             <div className="bg-white border border-gray-200 rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                     <CreditCard className="w-5 h-5 text-gray-600" />
//                     <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
//                 </div>

//                 <div className="space-y-4">
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number</label>
//                         <input type="text" placeholder="1234 5678 9012 3456"
//                             className="w-full p-2.5 border rounded-lg text-sm" />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date</label>
//                             <input type="text" placeholder="MM/YY"
//                                 className="w-full p-2.5 border rounded-lg text-sm" />
//                         </div>
//                         <div>
//                             <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
//                             <input type="text" placeholder="123"
//                                 className="w-full p-2.5 border rounded-lg text-sm" />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <button type="button"
//                 onClick={() => {
//                     setCurrentStep(0);
//                     setFormData({
//                         wasteCategory: '',
//                         quantity: '',
//                         preferredDate: '',
//                         location: '',
//                         contactNo: '',
//                         description: '',
//                         scrapType: '',
//                         scrapQuantity: '',
//                         scrapPreferredDate: '',
//                         scrapLocation: '',
//                         scrapContactNo: '',
//                         scrapDescription: '',
//                         newAddress: {
//                             street: '',
//                             city: '',
//                             state: '',
//                             zipCode: ''
//                         }
//                     });
//                 }}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium">
//                 Complete Payment
//             </button>
//         </div>
//     );

//     const renderSuccessPage = () => (
//         <div className="text-center space-y-6">
//             <div className="bg-green-50 border border-green-100 rounded-xl p-8">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Truck className="w-8 h-8 text-green-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Pickup Scheduled Successfully!</h3>
//                 <p className="text-gray-600">Your {pickupType} pickup request has been confirmed.</p>

//                 <div className="mt-6 p-4 bg-white rounded-lg border border-green-100">
//                     <div className="flex justify-between items-center mb-2">
//                         <span className="text-sm font-medium text-gray-600">Pickup Date</span>
//                         <span className="text-sm text-gray-800">
//                             {pickupType === 'waste' ? formData.preferredDate : formData.scrapPreferredDate}
//                         </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                         <span className="text-sm font-medium text-gray-600">Reference No.</span>
//                         <span className="text-sm text-gray-800">#{pickupType.toUpperCase()}{Math.random().toString().slice(2, 8)}</span>
//                     </div>
//                 </div>
//             </div>

//             <button type="button"
//                 onClick={() => {
//                     setPickupType('');
//                     setCurrentStep(0);
//                     setFormData({
//                         wasteCategory: '',
//                         quantity: '',
//                         preferredDate: '',
//                         location: '',
//                         contactNo: '',
//                         description: '',
//                         scrapType: '',
//                         scrapQuantity: '',
//                         scrapPreferredDate: '',
//                         scrapLocation: '',
//                         scrapContactNo: '',
//                         scrapDescription: '',
//                         newAddress: {
//                             street: '',
//                             city: '',
//                             state: '',
//                             zipCode: ''
//                         }
//                     });
//                 }}
//                 className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium">
//                 Book Another Pickup
//             </button>
//         </div>
//     );

//     // const renderSuccessPage = () => (
//     //     <div className="text-center space-y-6">
//     //         <div className="bg-green-50 border border-green-100 rounded-xl p-8">
//     //             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//     //                 <Truck className="w-8 h-8 text-green-600" />
//     //             </div>
//     //             <h3 className="text-xl font-semibold text-gray-800 mb-2">Pickup Scheduled Successfully!</h3>
//     //             <p className="text-gray-600">Your waste collection request has been confirmed.</p>

//     //             <div className="mt-6 p-4 bg-white rounded-lg border border-green-100">
//     //                 <div className="flex justify-between items-center mb-2">
//     //                     <span className="text-sm font-medium text-gray-600">Pickup Date</span>
//     //                     <span className="text-sm text-gray-800">{formData.preferredDate}</span>
//     //                 </div>
//     //                 <div className="flex justify-between items-center">
//     //                     <span className="text-sm font-medium text-gray-600">Reference No.</span>
//     //                     <span className="text-sm text-gray-800">#WP{Math.random().toString().slice(2, 8)}</span>
//     //                 </div>
//     //             </div>
//     //         </div>

//     //         <button type="button" onClick={() => setCurrentStep(1)}
//     //             className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium">
//     //             Book Another Pickup
//     //         </button>
//     //     </div>
//     // );

//     return (
//         <div className="bg-gray-100 mx-auto min-h-screen py-16">
//             <div className="max-w-3xl mx-auto mt-10 px-4">
//                 <div className="bg-white p-6 rounded-xl shadow-md">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Book a Pickup</h1>
//                     {currentStep > 0 && <StepperWithLines />}
                    
//                     {currentStep === 0 && renderPickupTypeSelection()}
//                     {currentStep === 1 && renderAddressSelection()}
//                     {currentStep === 2 && renderDetailsForm()}
//                     {currentStep === 3 && renderConfirmationPage()}
//                     {currentStep === 4 && renderPaymentPage()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PickupRequest;

import { useState } from "react"
import { Calendar, ChevronDown, ChevronUp, Trash2, Recycle, CheckCircle, CreditCard, Truck, MapPin } from "lucide-react"
import PriceTable from "./PriceTable";

const PickupRequest = () => {
  const [pickupType, setPickupType] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [formData, setFormData] = useState({
    wasteCategory: "",
    quantity: "",
    preferredDate: "",
    location: "",
    contactNo: "",
    description: "",
    scrapType: "",
    scrapQuantity: "",
    scrapPreferredDate: "",
    scrapLocation: "",
    scrapContactNo: "",
    scrapDescription: "",
    newAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })
  const [showPriceTable, setShowPriceTable] = useState(false)

  // Sample existing addresses
  const existingAddresses = [
    { id: 1, address: "123 Main St, Apt 4B, New York, NY 10001" },
    { id: 2, address: "456 Park Ave, Suite 201, New York, NY 10002" },
  ]

  const steps = [
    { number: 1, name: "Address" },
    { number: 2, name: "Details" },
    { number: 3, name: "Review" },
    { number: 4, name: "Payment" },
  ]

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handlePickupTypeSelect = (type: any) => {
    setPickupType(type)
    setCurrentStep(1)
  }

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address)
    setShowNewAddress(false)
  }

  const renderAddressSelection = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Pickup Address</h3>

        <div className="space-y-4">
          {existingAddresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => handleAddressSelect(addr.address)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedAddress === addr.address
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">{addr.address}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowNewAddress(!showNewAddress)}
              className="text-green-600 text-sm font-medium hover:text-green-700"
            >
              + Add New Address
            </button>

            {showNewAddress && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Street Address</label>
                  <input
                    type="text"
                    name="newAddress.street"
                    value={formData.newAddress.street}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                    <input
                      type="text"
                      name="newAddress.city"
                      value={formData.newAddress.city}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
                    <input
                      type="text"
                      name="newAddress.state"
                      value={formData.newAddress.state}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">ZIP Code</label>
                  <input
                    type="text"
                    name="newAddress.zipCode"
                    value={formData.newAddress.zipCode}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCurrentStep(0)}
          className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          disabled={!selectedAddress && !formData.newAddress.street}
          className="w-1/2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg text-sm font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  )

  const StepperWithLines = () => (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-gray-200" />
        <div
          className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-green-500 transition-all duration-300"
          style={{ right: `${100 - (((currentStep - 1) / (steps.length - 1)) * 80 + 10)}%` }}
        />
        <div className="relative z-10 w-full flex justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                                border-2 transition-all duration-300 
                                ${
                                  step.number <= currentStep
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-gray-300 bg-white text-gray-500"
                                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-xs font-medium
                                ${step.number <= currentStep ? "text-green-600" : "text-gray-500"}`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPickupTypeSelection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div
          onClick={() => handlePickupTypeSelect("waste")}
          className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Waste Pickup</h3>
          <p className="text-sm text-gray-600">Schedule a pickup for your household or recyclable waste</p>
        </div>

        <div
          onClick={() => handlePickupTypeSelect("scrap")}
          className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Recycle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Scrap Pickup</h3>
          <p className="text-sm text-gray-600">Schedule a pickup for your recyclable scrap materials</p>
        </div>
      </div>
    </div>
  )

  const renderWasteForm = () => (
    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mt-8 space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowPriceTable(!showPriceTable)}
        >
          <span className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            {showPriceTable ? "Hide" : "Show"} current waste prices
          </span>
          {showPriceTable ? (
            <ChevronUp className="h-4 w-4 text-blue-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-600" />
          )}
        </div>
        {showPriceTable && <PriceTable type="waste" />}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Waste Category</label>
            <select
              name="wasteCategory"
              value={formData.wasteCategory}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">Select category</option>
              <option value="household">Household Waste</option>
              <option value="recyclable">Recyclable Waste</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">Select quantity</option>
              <option value="small">Small (1-2 bags)</option>
              <option value="medium">Medium (3-5 bags)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
            Food waste
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
            Household items
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
            <div className="relative">
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contact No</label>
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
              placeholder="Enter your contact number"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional details..."
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
          />
        </div>
      </div>
    </div>
  )

  const renderScrapForm = () => (
    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowPriceTable(!showPriceTable)}
        >
          <span className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            {showPriceTable ? "Hide" : "Show"} current scrap prices
          </span>
          {showPriceTable ? (
            <ChevronUp className="h-4 w-4 text-blue-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-600" />
          )}
        </div>
        {showPriceTable && <PriceTable type="scrap" />}

        {/* <div className="text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-700 transition-colors">
          Know current scrap prices →
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Scrap Type</label>
            <select
              name="scrapType"
              value={formData.scrapType}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">Select type</option>
              <option value="metal">Metal Scrap</option>
              <option value="paper">Paper</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
            <input
              type="text"
              name="scrapQuantity"
              value={formData.scrapQuantity}
              onChange={handleChange}
              placeholder="Enter approximate weight"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
            <div className="relative">
              <input
                type="date"
                name="scrapPreferredDate"
                value={formData.scrapPreferredDate}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contact No</label>
            <input
              type="tel"
              name="scrapContactNo"
              value={formData.scrapContactNo}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
          <input
            type="text"
            name="scrapLocation"
            value={formData.scrapLocation}
            onChange={handleChange}
            placeholder="Enter your location"
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea
            name="scrapDescription"
            value={formData.scrapDescription}
            onChange={handleChange}
            placeholder="Add any additional details..."
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
          />
        </div>
      </div>
    </div>
  )

  const renderDetailsForm = () => (
    <form className="space-y-6">
      {pickupType === "waste" ? renderWasteForm() : renderScrapForm()}
      <button
        type="button"
        onClick={() => setCurrentStep(3)}
        className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg transition-colors text-base font-semibold shadow-sm hover:shadow-md"
      >
        Continue
      </button>
    </form>
  )

  const renderConfirmationPage = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Review Your Request</h3>
        <p className="text-gray-600 text-sm">Please confirm the details before proceeding to payment</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {pickupType === "waste" ? (
          <>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm font-medium text-gray-600">Waste Category</span>
              <span className="text-sm text-gray-800">{formData.wasteCategory || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm font-medium text-gray-600">Quantity</span>
              <span className="text-sm text-gray-800">{formData.quantity || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm font-medium text-gray-600">Pickup Date</span>
              <span className="text-sm text-gray-800">{formData.preferredDate || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Location</span>
              <span className="text-sm text-gray-800">{formData.location || "Not specified"}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm font-medium text-gray-600">Scrap Type</span>
              <span className="text-sm text-gray-800">{formData.scrapType || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm font-medium text-gray-600">Quantity</span>
              <span className="text-sm text-gray-800">{formData.scrapQuantity || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm font-medium text-gray-600">Pickup Date</span>
              <span className="text-sm text-gray-800">{formData.scrapPreferredDate || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Location</span>
              <span className="text-sm text-gray-800">{formData.scrapLocation || "Not specified"}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
        >
          Edit Details
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  )

  const renderPaymentPage = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456" className="w-full p-2.5 border rounded-lg text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date</label>
              <input type="text" placeholder="MM/YY" className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
              <input type="text" placeholder="123" className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setCurrentStep(0)
          setFormData({
            wasteCategory: "",
            quantity: "",
            preferredDate: "",
            location: "",
            contactNo: "",
            description: "",
            scrapType: "",
            scrapQuantity: "",
            scrapPreferredDate: "",
            scrapLocation: "",
            scrapContactNo: "",
            scrapDescription: "",
            newAddress: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
            },
          })
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium"
      >
        Complete Payment
      </button>
    </div>
  )

  const renderSuccessPage = () => (
    <div className="text-center space-y-6">
      <div className="bg-green-50 border border-green-100 rounded-xl p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pickup Scheduled Successfully!</h3>
        <p className="text-gray-600">Your {pickupType} pickup request has been confirmed.</p>

        <div className="mt-6 p-4 bg-white rounded-lg border border-green-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Pickup Date</span>
            <span className="text-sm text-gray-800">
              {pickupType === "waste" ? formData.preferredDate : formData.scrapPreferredDate}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Reference No.</span>
            <span className="text-sm text-gray-800">
              #{pickupType.toUpperCase()}
              {Math.random().toString().slice(2, 8)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setPickupType("")
          setCurrentStep(0)
          setFormData({
            wasteCategory: "",
            quantity: "",
            preferredDate: "",
            location: "",
            contactNo: "",
            description: "",
            scrapType: "",
            scrapQuantity: "",
            scrapPreferredDate: "",
            scrapLocation: "",
            scrapContactNo: "",
            scrapDescription: "",
            newAddress: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
            },
          })
        }}
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
      >
        Book Another Pickup
      </button>
    </div>
  )

  return (
    <div className="bg-gray-100 mx-auto min-h-screen py-16">
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Book a Pickup</h1>
          {currentStep > 0 && <StepperWithLines />}

          {currentStep === 0 && renderPickupTypeSelection()}
          {currentStep === 1 && renderAddressSelection()}
          {currentStep === 2 && renderDetailsForm()}
          {currentStep === 3 && renderConfirmationPage()}
          {currentStep === 4 && renderPaymentPage()}
          {currentStep === 5 && renderSuccessPage()}
        </div>
      </div>
    </div>
  )
}

export default PickupRequest;



