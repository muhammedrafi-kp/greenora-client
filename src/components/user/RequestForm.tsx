// import { useState } from 'react';
// import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
// import { div } from 'framer-motion/client';

// const WastePickupForm = () => {
//     const [formData, setFormData] = useState({
//         wasteCollection: true,
//         wasteCategory: '',
//         quantity: '',
//         preferredDate: '',
//         location: '',
//         contactNo: '',
//         description: '',
//         scrapCollection: true,
//         scrapType: '',
//         scrapQuantity: '',
//         scrapPreferredDate: '',
//         scrapLocation: '',
//         scrapContactNo: '',
//         scrapDescription: ''
//     });

//     const [sectionsOpen, setSectionsOpen] = useState({
//         wasteCollection: true,
//         scrapCollection: false
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const toggleSection = (section: any) => {
//         setSectionsOpen(prevState => ({
//             ...prevState,
//             [section]: !prevState[section]
//         }));
//     };

//     return (
//         <div className="bg-white p-4 rounded-lg mt-24 max-w-2xl mx-auto px-4">
//             {/* Stepper - Made more compact */}
//             <div className="flex items-center justify-between mb-4 relative">
//                 <div className="absolute h-0.5 bg-green-200 w-full top-3 -z-10"></div>
//                 {[1, 2, 3].map((step) => (
//                     <div key={step} className="flex flex-col items-center">
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
//               ${step === 1 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-500'}`}>
//                             {step}
//                         </div>
//                         <span className="text-xs mt-1 text-gray-500">
//                             {step === 1 ? 'Details' : step === 2 ? 'Payment' : 'Verify'}
//                         </span>
//                     </div>
//                 ))}
//             </div>

//             <form className="space-y-4">
//                 {/* Waste Collection Section */}
//                 <div className="bg-gray-200 p-3 rounded-lg">
//                     <div
//                         className="flex justify-between items-center cursor-pointer"
//                         onClick={() => toggleSection('wasteCollection')}
//                     >
//                         <span className="font-medium">Waste Collection</span>
//                         <button type="button" className="p-1">
//                             {sectionsOpen.wasteCollection ?
//                                 <ChevronUp className="w-4 h-4" /> :
//                                 <ChevronDown className="w-4 h-4" />
//                             }
//                         </button>
//                     </div>

//                     {sectionsOpen.wasteCollection && (
//                         <div className="mt-3 space-y-3">
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="text-sm text-gray-600">Waste Category</label>
//                                     <select
//                                         name="wasteCategory"
//                                         value={formData.wasteCategory}
//                                         onChange={handleChange}
//                                         className="w-full p-1.5 border rounded-md bg-white text-sm"
//                                     >
//                                         <option value="">Select category</option>
//                                         <option value="household">Household Waste</option>
//                                         <option value="recyclable">Recyclable Waste</option>
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm text-gray-600">Quantity</label>
//                                     <select
//                                         name="quantity"
//                                         value={formData.quantity}
//                                         onChange={handleChange}
//                                         className="w-full p-1.5 border rounded-md bg-white text-sm"
//                                     >
//                                         <option value="">Select quantity</option>
//                                         <option value="small">Small (1-2 bags)</option>
//                                         <option value="medium">Medium (3-5 bags)</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className="flex gap-2">
//                                 <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">Food waste</span>
//                                 <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">Household items</span>
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="text-sm text-gray-600">Preferred Date</label>
//                                     <div className="relative">
//                                         <input
//                                             type="date"
//                                             name="preferredDate"
//                                             value={formData.preferredDate}
//                                             onChange={handleChange}
//                                             className="w-full p-1.5 border rounded-md text-sm"
//                                         />
//                                         <Calendar className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm text-gray-600">Contact No</label>
//                                     <input
//                                         type="tel"
//                                         name="contactNo"
//                                         value={formData.contactNo}
//                                         onChange={handleChange}
//                                         className="w-full p-1.5 border rounded-md text-sm"
//                                         placeholder="Contact No"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="text-sm text-gray-600">Location</label>
//                                 <input
//                                     type="text"
//                                     name="location"
//                                     value={formData.location}
//                                     onChange={handleChange}
//                                     placeholder="Choose your location"
//                                     className="w-full p-1.5 border rounded-md text-sm"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="text-sm text-gray-600">Description</label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     placeholder="Type Description..."
//                                     className="w-full p-1.5 border rounded-md text-sm h-16 resize-none"
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Scrap Collection Section */}
//                 <div className="bg-gray-200 p-3 rounded-lg">
//                     <div
//                         className="flex justify-between items-center cursor-pointer"
//                         onClick={() => toggleSection('scrapCollection')}
//                     >
//                         <span className="font-medium">Scrap Collection</span>
//                         <button type="button" className="p-1">
//                             {sectionsOpen.scrapCollection ?
//                                 <ChevronUp className="w-4 h-4" /> :
//                                 <ChevronDown className="w-4 h-4" />
//                             }
//                         </button>
//                     </div>

//                     {sectionsOpen.scrapCollection && (
//                         <div className="mt-3 space-y-3">
//                             <div className="text-blue-600 text-sm cursor-pointer">
//                                 Know current scrap prices
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="text-sm text-gray-600">Scrap Type</label>
//                                     <select
//                                         name="scrapType"
//                                         value={formData.scrapType}
//                                         onChange={handleChange}
//                                         className="w-full p-1.5 border rounded-md bg-white text-sm"
//                                     >
//                                         <option value="">Select type</option>
//                                         <option value="metal">Metal Scrap</option>
//                                         <option value="paper">Paper</option>
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm text-gray-600">Quantity</label>
//                                     <input
//                                         type="text"
//                                         name="scrapQuantity"
//                                         value={formData.scrapQuantity}
//                                         onChange={handleChange}
//                                         placeholder="Approx weight"
//                                         className="w-full p-1.5 border rounded-md text-sm"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="text-sm text-gray-600">Preferred Date</label>
//                                     <div className="relative">
//                                         <input
//                                             type="date"
//                                             name="scrapPreferredDate"
//                                             value={formData.scrapPreferredDate}
//                                             onChange={handleChange}
//                                             className="w-full p-1.5 border rounded-md text-sm"
//                                         />
//                                         <Calendar className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm text-gray-600">Contact No</label>
//                                     <input
//                                         type="tel"
//                                         name="scrapContactNo"
//                                         value={formData.scrapContactNo}
//                                         onChange={handleChange}
//                                         placeholder="Contact No"
//                                         className="w-full p-1.5 border rounded-md text-sm"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="text-sm text-gray-600">Location</label>
//                                 <input
//                                     type="text"
//                                     name="scrapLocation"
//                                     value={formData.scrapLocation}
//                                     onChange={handleChange}
//                                     placeholder="Choose your location"
//                                     className="w-full p-1.5 border rounded-md text-sm"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="text-sm text-gray-600">Description</label>
//                                 <textarea
//                                     name="scrapDescription"
//                                     value={formData.scrapDescription}
//                                     onChange={handleChange}
//                                     placeholder="Type Description..."
//                                     className="w-full p-1.5 border rounded-md text-sm h-16 resize-none"
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full bg-green-900 hover:bg-green-800 text-white py-2 rounded-md  transition-colors text-sm"
//                 >
//                     Confirm Request
//                 </button>
//             </form>
//         </div>

//     );
// };

// export default WastePickupForm;



import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Trash2, Recycle } from 'lucide-react';

const WastePickupForm = () => {
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

    const [sectionsOpen, setSectionsOpen] = useState({
        wasteCollection: true,
        scrapCollection: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const toggleSection = (section:an) => {
        setSectionsOpen(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    return (
        <div className="bg-gray-50 py-12">
            {/* <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12"> */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-16 max-w-3xl mx-auto border">
                <h1 className="text-2xl font-semibold text-gray-800 mb-12 text-center">Book a Pickup</h1>

                {/* Stepper */}
                <div className="flex items-center justify-evenly mb-8 relative">
                    <div className="absolute h-1 bg-green-100 w-full top-3 -z-10"></div>
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm transition-all duration-200
                                ${step === 1 ? 'bg-green-500 text-white ring-4 ring-green-100' : 'bg-white text-gray-500 border border-gray-200'}`}>
                                {step}
                            </div>
                            <span className="text-xs mt-2 font-medium text-gray-600">
                                {step === 1 ? 'Details' : step === 2 ? 'Payment' : 'Verify'}
                            </span>
                        </div>
                    ))}
                </div>

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
                        type="submit"
                        className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg transition-colors text-base font-semibold shadow-sm hover:shadow-md"
                    >
                        Confirm Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WastePickupForm;



// import { useState } from 'react';
// import { Calendar, ChevronDown, ChevronUp, Trash2, Recycle } from 'lucide-react';

// const WastePickupForm = () => {
//     // ... keeping the same state management code ...
//     const [formData, setFormData] = useState({
//         wasteCollection: true,
//         wasteCategory: '',
//         quantity: '',
//         preferredDate: '',
//         location: '',
//         contactNo: '',
//         description: '',
//         scrapCollection: true,
//         scrapType: '',
//         scrapQuantity: '',
//         scrapPreferredDate: '',
//         scrapLocation: '',
//         scrapContactNo: '',
//         scrapDescription: ''
//     });

//     const [sectionsOpen, setSectionsOpen] = useState({
//         wasteCollection: true,
//         scrapCollection: false
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const toggleSection = (section) => {
//         setSectionsOpen(prevState => ({
//             ...prevState,
//             [section]: !prevState[section]
//         }));
//     };

//     return (
//         <div className=" bg-gray-100 py-12">
//             <div className="bg-white p-6 rounded-xl shadow-lg mt-20 max-w-2xl mx-auto">
//                 <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Waste Management Portal</h1>

//                 {/* Stepper */}
//                 <div className="flex items-center justify-between mb-8 relative">
//                     <div className="absolute h-1 bg-green-100 w-full top-3 -z-10"></div>
//                     {[1, 2, 3].map((step) => (
//                         <div key={step} className="flex flex-col items-center">
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm transition-all duration-200
//                                 ${step === 1 ? 'bg-green-500 text-white ring-4 ring-green-100' : 'bg-white text-gray-500 border border-gray-200'}`}>
//                                 {step}
//                             </div>
//                             <span className="text-xs mt-2 font-medium text-gray-600">
//                                 {step === 1 ? 'Details' : step === 2 ? 'Payment' : 'Verify'}
//                             </span>
//                         </div>
//                     ))}
//                 </div>

//                 <form className="space-y-6">
//                     {/* Waste Collection Section */}
//                     <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
//                         <div
//                             className="flex justify-between items-center cursor-pointer"
//                             onClick={() => toggleSection('wasteCollection')}
//                         >
//                             <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                                     <Trash2 className="w-4 h-4 text-green-600" />
//                                 </div>
//                                 <span className="font-medium text-gray-800">Waste Collection</span>
//                             </div>
//                             <button type="button" className="p-1 hover:bg-gray-50 rounded-full">
//                                 {sectionsOpen.wasteCollection ?
//                                     <ChevronUp className="w-5 h-5 text-gray-500" /> :
//                                     <ChevronDown className="w-5 h-5 text-gray-500" />
//                                 }
//                             </button>
//                         </div>

//                         {/* ... keeping the same waste collection form fields ... */}
//                         {sectionsOpen.wasteCollection && (
//                             <div className="mt-4 space-y-4 pl-11">
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-1 block">Waste Category</label>
//                                         <select
//                                             name="wasteCategory"
//                                             value={formData.wasteCategory}
//                                             onChange={handleChange}
//                                             className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
//                                         >
//                                             <option value="">Select category</option>
//                                             <option value="household">Household Waste</option>
//                                             <option value="recyclable">Recyclable Waste</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
//                                         <select
//                                             name="quantity"
//                                             value={formData.quantity}
//                                             onChange={handleChange}
//                                             className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
//                                         >
//                                             <option value="">Select quantity</option>
//                                             <option value="small">Small (1-2 bags)</option>
//                                             <option value="medium">Medium (3-5 bags)</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">Food waste</span>
//                                     <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">Household items</span>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Date</label>
//                                         <div className="relative">
//                                             <input
//                                                 type="date"
//                                                 name="preferredDate"
//                                                 value={formData.preferredDate}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
//                                             />
//                                             <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-1 block">Contact No</label>
//                                         <input
//                                             type="tel"
//                                             name="contactNo"
//                                             value={formData.contactNo}
//                                             onChange={handleChange}
//                                             className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
//                                             placeholder="Enter your contact number"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
//                                     <input
//                                         type="text"
//                                         name="location"
//                                         value={formData.location}
//                                         onChange={handleChange}
//                                         placeholder="Enter your location"
//                                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
//                                     <textarea
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleChange}
//                                         placeholder="Add any additional details..."
//                                         className="w-full p-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
//                                     />
//                                 </div>

//                             </div>
//                         )}
//                     </div>

//                     {/* Scrap Collection Section */}
//                     <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
//                         <div
//                             className="flex justify-between items-center cursor-pointer"
//                             onClick={() => toggleSection('scrapCollection')}
//                         >
//                             <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                                     <Recycle className="w-4 h-4 text-blue-600" />
//                                 </div>
//                                 <span className="font-medium text-gray-800">Scrap Collection</span>
//                             </div>
//                             <button type="button" className="p-1 hover:bg-gray-50 rounded-full">
//                                 {sectionsOpen.scrapCollection ?
//                                     <ChevronUp className="w-5 h-5 text-gray-500" /> :
//                                     <ChevronDown className="w-5 h-5 text-gray-500" />
//                                 }
//                             </button>
//                         </div>

//                         {/* ... keeping the same scrap collection form fields ... */}
//                         {sectionsOpen.scrapCollection && (
//                             <div className="mt-4 space-y-4 pl-11">
//                                 {/* Existing scrap collection form fields remain the same */}
//                                 {/* ... */}
//                             </div>
//                         )}
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md"
//                     >
//                         Confirm Request
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default WastePickupForm;



