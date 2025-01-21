import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Trash2, Recycle, CheckCircle, CreditCard, Truck } from 'lucide-react';

const PickupRequest: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        wasteCollection: true,
        wasteCategory: '',
        quantity: '',
        preferredDate: '',
        location: '',
        contactNo: '',
        description: '',
        scrapCollection: true,
        scrapType: '',
        scrapQuantity: '',
        scrapPreferredDate: '',
        scrapLocation: '',
        scrapContactNo: '',
        scrapDescription: ''
    });

    const steps = [
        { number: 1, name: 'Details' },
        { number: 2, name: 'Review' },
        { number: 3, name: 'Payment' },
        { number: 4, name: 'Complete' }
    ];

    const [sectionsOpen, setSectionsOpen] = useState({
        wasteCollection: true,
        scrapCollection: false
    });

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const toggleSection = (section:any) => {
        setSectionsOpen(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const StepperWithLines = () => (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-gray-200" />

                {/* Progress Line */}
                <div
                    className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-green-500 transition-all duration-300"
                    style={{ right: `${100 - (((currentStep - 1) / (steps.length - 1)) * 80 + 10)}%` }}
                />

                {/* Steps */}
                <div className="relative z-10 w-full flex justify-between">
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      border-2 transition-all duration-300 
                      ${step.number <= currentStep
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-gray-300 bg-white text-gray-500'}`}
                            >
                                {step.number}
                            </div>
                            <span
                                className={`mt-2 text-xs font-medium
                      ${step.number <= currentStep ? 'text-green-600' : 'text-gray-500'}`}
                            >
                                {step.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDetailsForm = () => (
        // <form className="space-y-6">
        //   {/* Waste Collection Section */}
        //   <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
        //     <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('wasteCollection')}>
        //       <div className="flex items-center gap-3">
        //         <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
        //           <Trash2 className="w-4 h-4 text-green-600" />
        //         </div>
        //         <span className="font-medium text-gray-800">Waste Collection</span>
        //       </div>
        //       <button type="button" className="p-1 bg-gray-100 rounded-full">
        //         {sectionsOpen.wasteCollection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        //       </button>
        //     </div>

        //     {sectionsOpen.wasteCollection && (
        //       <div className="mt-6 space-y-4">
        //         <div className="grid grid-cols-2 gap-4">
        //           <div>
        //             <label className="text-sm font-medium text-gray-700 mb-1 block">Waste Category</label>
        //             <select name="wasteCategory" value={formData.wasteCategory} onChange={handleChange} 
        //               className="w-full p-2.5 border rounded-lg text-sm">
        //               <option value="">Select category</option>
        //               <option value="household">Household Waste</option>
        //               <option value="recyclable">Recyclable Waste</option>
        //             </select>
        //           </div>
        //           <div>
        //             <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
        //             <select name="quantity" value={formData.quantity} onChange={handleChange}
        //               className="w-full p-2.5 border rounded-lg text-sm">
        //               <option value="">Select quantity</option>
        //               <option value="small">Small (1-2 bags)</option>
        //               <option value="medium">Medium (3-5 bags)</option>
        //             </select>
        //           </div>
        //         </div>
        //         {/* Other waste collection fields remain the same */}
        //       </div>
        //     )}
        //   </div>

        //   <button type="button" onClick={() => setCurrentStep(2)}
        //     className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium">
        //     Review Request
        //   </button>
        // </form>

        <form className="space-y-6">
            {/* Waste Collection Section */}
            <div className="bg-white border border-gray-200 px-6 py-4  rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('wasteCollection')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Trash2 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-800">Waste Collection</span>
                    </div>
                    <button type="button" className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full">
                        {sectionsOpen.wasteCollection ?
                            <ChevronUp className="w-5 h-5 text-gray-500" /> :
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        }
                    </button>
                </div>

                {sectionsOpen.wasteCollection && (
                    <div className="mt-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Waste Category</label>
                                <select
                                    name="wasteCategory"
                                    value={formData.wasteCategory}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm "
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
                                    className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm "
                                >
                                    <option value="">Select quantity</option>
                                    <option value="small">Small (1-2 bags)</option>
                                    <option value="medium">Medium (3-5 bags)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">Food waste</span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">Household items</span>
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
                                        className="w-full p-2.5 border border-gray-200 rounded-lg text-sm "
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
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm "
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
                                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm "
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
                )}
            </div>

            {/* Scrap Collection Section */}
            <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('scrapCollection')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Recycle className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">Scrap Collection</span>
                    </div>
                    <button type="button" className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full">
                        {sectionsOpen.scrapCollection ?
                            <ChevronUp className="w-5 h-5 text-gray-500" /> :
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        }
                    </button>
                </div>

                {sectionsOpen.scrapCollection && (
                    <div className="mt-8 space-y-4">
                        <div className="text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-700 transition-colors">
                            Know current scrap prices →
                        </div>

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
                                        className="w-full p-2.5 border border-gray-200 rounded-lg text-sm "
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
                                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm "
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                            <textarea
                                name="scrapDescription"
                                value={formData.scrapDescription}
                                onChange={handleChange}
                                placeholder="Add any additional details..."
                                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-non"
                            />
                        </div>
                    </div>
                )}
            </div>

            <button
                type="button" onClick={() => setCurrentStep(2)}
                className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg transition-colors text-base font-semibold shadow-sm hover:shadow-md"
            >
                Continue
            </button>
        </form>

    );

    const renderConfirmationPage = () => (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Review Your Request</h3>
                <p className="text-gray-600 text-sm">Please confirm the details below before proceeding to payment</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm font-medium text-gray-600">Waste Category</span>
                    <span className="text-sm text-gray-800">{formData.wasteCategory || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm font-medium text-gray-600">Quantity</span>
                    <span className="text-sm text-gray-800">{formData.quantity || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm font-medium text-gray-600">Pickup Date</span>
                    <span className="text-sm text-gray-800">{formData.preferredDate || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Location</span>
                    <span className="text-sm text-gray-800">{formData.location || 'Not specified'}</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button type="button" onClick={() => setCurrentStep(1)}
                    className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium">
                    Edit Details
                </button>
                <button type="button" onClick={() => setCurrentStep(3)}
                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium">
                    Proceed to Payment
                </button>
            </div>
        </div>
    );

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
                        <input type="text" placeholder="1234 5678 9012 3456"
                            className="w-full p-2.5 border rounded-lg text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date</label>
                            <input type="text" placeholder="MM/YY"
                                className="w-full p-2.5 border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
                            <input type="text" placeholder="123"
                                className="w-full p-2.5 border rounded-lg text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" onClick={() => setCurrentStep(4)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium">
                Complete Payment
            </button>
        </div>
    );

    const renderSuccessPage = () => (
        <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-xl p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pickup Scheduled Successfully!</h3>
                <p className="text-gray-600">Your waste collection request has been confirmed.</p>

                <div className="mt-6 p-4 bg-white rounded-lg border border-green-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Pickup Date</span>
                        <span className="text-sm text-gray-800">{formData.preferredDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Reference No.</span>
                        <span className="text-sm text-gray-800">#WP{Math.random().toString().slice(2, 8)}</span>
                    </div>
                </div>
            </div>

            <button type="button" onClick={() => setCurrentStep(1)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium">
                Book Another Pickup
            </button>
        </div>
    );

    // return (
    //     <div className="bg-gray-50 min-h-screen py-12">
    //         <div className="max-w-3xl mx-auto px-4">
    //             <div className="bg-white p-6 rounded-xl shadow-md">
    //                 <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Book a Pickup</h1>

    //                 <div className="flex items-center justify-evenly mb-9 relative">
    //                     <div className="absolute h-1 bg-green-100 w-full top-3 -z-10"></div>
    //                     {['Details', 'Review', 'Payment', 'Complete'].map((step, index) => (
    //                         <div key={step} className="flex flex-col items-center">
    //                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
    //               ${index + 1 <= currentStep ? 'bg-green-500 text-white ring-4 ring-green-100' : 'bg-gray-100 text-gray-400'}`}>
    //                                 {index + 1}
    //                             </div>
    //                             <span className="text-xs mt-2 font-medium text-gray-600">{step}</span>
    //                         </div>
    //                     ))}
    //                 </div>

    //                 {currentStep === 1 && renderDetailsForm()}
    //                 {currentStep === 2 && renderConfirmationPage()}
    //                 {currentStep === 3 && renderPaymentPage()}
    //                 {currentStep === 4 && renderSuccessPage()}
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto mt-16 px-4">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Book a Pickup</h1>

                    <StepperWithLines />

                    {currentStep === 1 && renderDetailsForm()}
                    {currentStep === 2 && renderConfirmationPage()}
                    {currentStep === 3 && renderPaymentPage()}
                    {currentStep === 4 && renderSuccessPage()}
                </div>
            </div>
        </div>
    );
};






export default PickupRequest;