import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft, FaCheckCircle, FaTimesCircle, FaClock, FaCreditCard, FaMoneyBill, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaMapMarkedAlt, FaRegCircle, FaClipboard, FaFileInvoice } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { ICollection } from '../../types/collection';
import { ICollector } from "../../types/user";
import { getCollectorData } from '../../services/userService';
import { cancelCollection } from '../../services/collectionService';
import { ApiResponse } from "../../types/common";

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
    </div>
);

const CollectionDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { collectionDetails } = location.state as { collectionDetails: ICollection } || {};

    console.log("collectionDetails:", collectionDetails);
    // Add check for missing collection data
    useEffect(() => {
        if (!collectionDetails) {
            // toast.error('Collection details not found.');
            navigate('/account/collections');
        }
    }, [collectionDetails, navigate]);

    if (!collectionDetails) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');
    const [isCustomReason, setIsCustomReason] = useState(false);
    const [collector, setCollector] = useState<ICollector | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [serviceRating, setServiceRating] = useState<number>(0);
    // const [collectorRating, setCollectorRating] = useState<number>(0);
    // const [serviceFeedback, setServiceFeedback] = useState<string>('');
    // const [collectorFeedback, setCollectorFeedback] = useState<string>('');
    // const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    // const [activeTab, setActiveTab] = useState<'service' | 'collector'>('service');
    // const [hoverRating, setHoverRating] = useState<number>(0);
    const [isCollectorImageError, setIsCollectorImageError] = useState<boolean>(false);

    const predefinedReasons: { id: string, reason: string }[] = [
        { id: '1', reason: 'Changed my mind' },
        { id: '2', reason: 'Found better rates elsewhere' },
        { id: '3', reason: 'Scheduling conflict' },
        { id: '4', reason: 'Items no longer available' },
        { id: '5', reason: 'Other' }
    ];

    useEffect(() => {
        const fetchCollectorData = async () => {
            if (!collectionDetails.collectorId) return;

            setIsLoading(true);
            try {
                const res: ApiResponse<ICollector> = await getCollectorData("users", collectionDetails.collectorId);
                console.log("getCollectorData response:", res);
                if (res.success) {
                    setCollector(res.data);
                }
            } catch (error) {
                console.error("Error fetching collector data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollectorData();
    }, [collectionDetails.collectorId]);


    const getStatusIconAndColor = (status: 'confirmed' | 'completed' | 'scheduled' | 'cancelled' | 'in_progress' | 'pending'): { icon: JSX.Element; color: string } => {
        switch (status) {
            case 'completed':
                return { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-600' };
            case 'scheduled':
                return { icon: <FaCheckCircle />, color: 'bg-blue-100 text-blue-600' };
            case 'cancelled':
                return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' };
            case 'confirmed':
                return { icon: <FaClock />, color: 'bg-yellow-100 text-yellow-600' };
            default:
                return { icon: <FaClock />, color: 'bg-yellow-100 text-yellow-600' };
        }
    };

    const getPaymentStatusIconAndColor = (status: "pending" | "success" | "failed" | "requested") => {
        switch (status) {
            case 'success':
                return { icon: <FaCreditCard />, color: 'bg-green-100 text-green-600' };
            case 'pending':
                return { icon: <FaMoneyBill />, color: 'bg-yellow-100 text-yellow-600' };
            case 'failed':
                return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' };
            case 'requested':
                return { icon: <FaMoneyBill />, color: 'bg-blue-100 text-blue-600' };
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        const finalReason = isCustomReason ? customReason : selectedReason;

        setIsLoading(true);
        try {
            const res: ApiResponse<null> = await cancelCollection(collectionDetails.collectionId, finalReason);

            console.log("cancellation resposne:", res);

            if (res.success) {
                toast.success("collection cancelled");
                navigate("/account/collections")
            }
        } catch (error) {
            console.error("error while cancelling the collection", error);
            toast.error("Failed to cancel collection.");
        } finally {
            setIsLoading(false);
            setShowCancelModal(false);
        }
    };

    const handleDownloadInvoice = () => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(18);
            doc.setTextColor(34, 85, 34);
            doc.text('Greenora Invoice', 14, 16);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Invoice No: ${collectionDetails.payment?.paymentId || collectionDetails.payment?.orderId || collectionDetails.collectionId}`, 14, 24);
            doc.text(`Invoice Date: ${collectionDetails.payment?.paidAt ? new Date(collectionDetails.payment.paidAt).toLocaleDateString() : new Date().toLocaleDateString()}`, 14, 30);
            doc.text(`Collection ID: ${collectionDetails.collectionId.toUpperCase()}`, 14, 36);

            // Bill To
            const addressY = 46;
            doc.setFontSize(12);
            doc.text('Bill To:', 14, addressY);
            doc.setFontSize(10);
            const addressLines = [
                collectionDetails.address.name,
                `${collectionDetails.address.addressLine}, ${collectionDetails.address.locality}`,
                `PIN: ${collectionDetails.address.pinCode}`,
                `Phone: ${collectionDetails.address.mobile}`
            ];
            addressLines.forEach((line, idx) => doc.text(line, 14, addressY + 6 + idx * 5));

            // Payment details (right column)
            const rightX = 120;
            doc.setFontSize(12);
            doc.text('Payment Details:', rightX, addressY);
            doc.setFontSize(10);
            const paymentDetails = [
                `Status: ${(collectionDetails.payment?.status || 'pending').toUpperCase()}`,
                `Method: ${collectionDetails.payment?.method || 'N/A'}`,
                `Order ID: ${collectionDetails.payment?.orderId || 'N/A'}`,
                `Payment ID: ${collectionDetails.payment?.paymentId || 'N/A'}`,
                `Paid At: ${collectionDetails.payment?.paidAt ? new Date(collectionDetails.payment.paidAt).toLocaleString() : 'N/A'}`
            ];
            paymentDetails.forEach((line, idx) => doc.text(line, rightX, addressY + 6 + idx * 5));

            // Items table
            const items = collectionDetails.items.map((it, idx) => ({
                sn: idx + 1,
                name: it.name || `${it.categoryId}`,
                qty: it.qty,
                rate: `₹${(it.rate ?? 0).toFixed(2)}`,
                subtotal: `₹${(((it.rate ?? 0) * it.qty)).toFixed(2)}`
            }));

            const itemsStartY = 80;
            autoTable(doc, {
                startY: itemsStartY,
                head: [["#", "Item", "Qty (Bags)", "Rate", "Subtotal"]],
                body: items.map(r => [r.sn, r.name, r.qty, r.rate, r.subtotal]),
                theme: 'grid',
                headStyles: { fillColor: [34, 85, 34] },
                styles: { fontSize: 9 }
            });

            // Totals
            const itemsTotal = collectionDetails.items.reduce((total, it) => total + (it.rate * it.qty), 0);
            const paidAmount = collectionDetails.payment?.amount ?? itemsTotal;
            const afterTableY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 6 : itemsStartY + 10;

            doc.setFontSize(11);
            doc.text('Summary', 14, afterTableY);
            doc.setFontSize(10);
            autoTable(doc, {
                startY: afterTableY + 2,
                theme: 'plain',
                body: [
                    ['Estimated Total', `₹${itemsTotal.toFixed(2)}`],
                    ['Paid Amount', `₹${paidAmount.toFixed(2)}`],
                    ['Payment Method', `${collectionDetails.payment?.method || 'N/A'}`]
                ],
                styles: { cellPadding: 1.5, fontSize: 10 },
                didParseCell: (data) => {
                    if (data.column.index === 0) {
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            });

            // Footer
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text('Thank you for choosing Greenora!', 14, pageHeight - 20);
            doc.text('This is a system-generated invoice.', 14, pageHeight - 15);

            const fileName = `Invoice_${collectionDetails.collectionId.toUpperCase()}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Error generating invoice:', error);
            toast.error('Failed to generate invoice.');
        }
    };

    const { icon, color } = getStatusIconAndColor(collectionDetails.status);
    const { icon: paymentIcon, color: paymentColor } = getPaymentStatusIconAndColor(collectionDetails.payment?.status || 'pending');

    const getCurrentStepNumber = (
        status: 'confirmed' | 'completed' | 'scheduled' | 'cancelled' | 'in_progress' | 'pending'
    ): number => {
        switch (status) {
            case 'confirmed':
                return 1;
            case 'scheduled':
                return 2;
            case 'in_progress':
                return 3;
            case 'completed':
            case 'cancelled':
                return 4;
            default:
                return 0;
        }
    };

    const currentStep = getCurrentStepNumber(collectionDetails.status);

    const steps = [
        { number: 1, name: "Confirmed", status: currentStep >= 1 ? "completed" : "pending" },
        { number: 2, name: "Scheduled", status: currentStep >= 2 ? "completed" : "pending" },
        { number: 3, name: "In progress", status: currentStep >= 3 ? "completed" : "pending" },
        { number: 4, name: collectionDetails.status === 'cancelled' ? "Cancelled" : "Completed", status: collectionDetails.status === 'cancelled' ? 'cancelled' : (currentStep >= 4 ? "completed" : "pending") },
    ];

    // Progress track/bar sizing with inner padding to avoid overshoot at ends
    const innerPaddingPercent = 2; // shrink from both ends inside the 80% track
    const completedStepsCount = steps.filter(step => step.status === 'completed').length;
    const segmentsCompleted = Math.max(0, Math.min(completedStepsCount - 1, steps.length - 1));
    const progressRatio = (steps.length - 1) > 0 ? (segmentsCompleted / (steps.length - 1)) : 0;
    const leftPercent = 10 + innerPaddingPercent;
    const effectiveTrackPercent = 80 - (innerPaddingPercent * 2);
    const progressWidthPercent = progressRatio * effectiveTrackPercent;

    const getStepStyle = (status: string) => {
        switch (status) {
            case 'completed':
                return "border-green-500 bg-green-500 text-white";
            case 'cancelled':
                return "border-red-500 bg-red-500 text-white";
            case 'pending':
                return "border-gray-300 bg-white text-gray-500";
            default:
                return "border-gray-300 bg-white text-gray-500";
        }
    };

    // const handleSubmitFeedback = async () => {
    //     setIsSubmittingFeedback(true);
    //     try {
    //         // TODO: Implement API call to submit feedback
    //         // const response = await submitFeedback({
    //         //     collectionId: collectionDetails.collectionId,
    //         //     serviceRating,
    //         //     serviceFeedback,
    //         //     collectorRating,
    //         //     collectorFeedback
    //         // });

    //         toast.success('Thank you for your feedback!');
    //         setServiceRating(0);
    //         setCollectorRating(0);
    //         setServiceFeedback('');
    //         setCollectorFeedback('');
    //     } catch (error) {
    //         console.error('Error submitting feedback:', error);
    //         toast.error('Failed to submit feedback. Please try again.');
    //     } finally {
    //         setIsSubmittingFeedback(false);
    //     }
    // };

    return (
        <div className="container mx-auto px-4 lg:px-12 py-20 mt-9">
            <button
                onClick={handleGoBack}
                className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-lg text-sm text-gray-600 hover:text-gray-700 mb-6"
            >
                <FaArrowCircleLeft /> Back
            </button>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {/* Timeline Steps at the top */}
                    <div className="mb-8">
                        <div className="w-full py-4">
                            <div className="relative flex items-center justify-between">
                                <div
                                    className="absolute top-5 h-0.5 bg-gray-200"
                                    style={{ left: `${leftPercent}%`, right: `${leftPercent}%` }}
                                />
                                <div
                                    className="absolute top-5 h-0.5 bg-green-500 transition-all duration-300"
                                    style={{ left: `${leftPercent}%`, width: `${progressWidthPercent}%` }}
                                />
                                <div className="relative z-10 w-full flex justify-between">
                                    {steps.map((step) => (
                                        <div key={step.number} className="flex flex-col items-center flex-1">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                                                border-2 transition-all duration-300 ${getStepStyle(step.status)}`}
                                            >
                                                {step.number}
                                            </div>
                                            <span className={`mt-2 text-sm font-medium
                                                ${step.status === 'cancelled' ? 'text-red-600' : step.status === 'completed' ? 'text-green-600' : 'text-gray-500'}`}
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collection ID and Action Buttons in same row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h2 className="text-lg font-semibold bg-green-900 text-white px-3 py-1 rounded-md">
                            Collection ID : #{collectionDetails.collectionId.toLocaleUpperCase()}
                        </h2>

                        <div className="flex gap-4">
                            {collectionDetails.status !== 'cancelled' && collectionDetails.status !== 'completed' && (
                                <button
                                    className="px-4 py-2 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2"
                                    onClick={handleCancelClick}
                                >
                                    Cancel Collection
                                </button>
                            )}
                            {collectionDetails.payment?.status === 'success' && (
                                <button
                                    className="px-4 py-2 bg-green-800 text-white font-semibold rounded-lg hover:bg-green-900 transition-colors flex items-center gap-2"
                                    onClick={handleDownloadInvoice}
                                >
                                    <FaFileInvoice /> Download Invoice
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6 md:col-span-2">
                        <div className="space-y-6">
                            {/* Collection Details Card */}
                            <div className="bg-white rounded-lg shadow-md p-6 border">
                                <h3 className="text-md font-semibold mb-3 border-b pb-2 flex items-center gap-2">
                                    <FaClipboard className="text-green-800" /> Collection Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Type</span>
                                        <span className="text-gray-800">{collectionDetails.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Preferred Date</span>
                                        <span className="text-gray-800 ">{formatDate(collectionDetails.preferredDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Status</span>
                                        <div className={`flex items-center gap-2 px-1 py-0.5 rounded-full ${color}`}>
                                            <div className={`flex items-center gap-2 px-1 py-0.5`}>
                                                {icon}
                                                <span className="text-sm font-medium">{collectionDetails.status.charAt(0).toUpperCase() + collectionDetails.status.slice(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Payment Status</span>
                                        <div className={`flex items-center gap-2 px-1 py-0.5 rounded-full ${paymentColor}`}>
                                            <div className={`flex items-center gap-2 px-1 py-0.5`}>
                                                {paymentIcon}
                                                <span className="text-sm font-medium">
                                                    {(collectionDetails.payment?.status || 'pending').charAt(0).toUpperCase() + (collectionDetails.payment?.status || 'pending').slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Created</span>
                                        <span className="text-gray-800">{formatDate(collectionDetails.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Estimated Cost</span>
                                        <span className="text-gray-800 font-semibold">₹{collectionDetails.estimatedCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Address Details Card */}
                            <div className="bg-white rounded-lg shadow-md p-6 border">
                                <div className="mb-3 border-b pb-2 flex items-center gap-2">
                                    <div className="p-2 bg-yellow-50 rounded-full">
                                        <FaMapMarkerAlt className="text-yellow-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-md font-semibold text-gray-800">Pickup Address</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-800 font-medium">{collectionDetails.address.name}</p>
                                    <p className="text-gray-800">
                                        {collectionDetails.address.addressLine}, {collectionDetails.address.locality}, {collectionDetails.address.pinCode}
                                    </p>
                                    <p className="text-gray-600">{collectionDetails.address.mobile}</p>
                                </div>
                            </div>

                            {/* Collector Card */}
                            {collector && (
                                <div className="bg-white rounded-lg shadow-md p-6 border">
                                    <div className="flex items-center mb-3 border-b pb-2 gap-2">
                                        <div className="p-2 bg-blue-50 rounded-full">
                                            <FaUser className="text-blue-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-md font-semibold text-gray-800">Collector Information</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-3 mb-4 text-center">
                                        <div className="h-14 w-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                                            {collector.profileUrl && !isCollectorImageError ? (
                                                <img
                                                    src={collector.profileUrl}
                                                    alt="Collector avatar"
                                                    className="h-14 w-14 rounded-full object-cover"
                                                    onError={() => setIsCollectorImageError(true)}
                                                />
                                            ) : (
                                                <FaUser className="text-2xl" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{collector.name}</p>
                                        </div>
                                    </div>

                                    {(collectionDetails.status === 'scheduled' || collectionDetails.status === 'in_progress') && (
                                        <div className="mt-4 space-y-4">
                                            <button onClick={() => window.open(`tel:${collector.phone}`, '_blank')} className="w-full py-2 bg-green-800 text-white font-medium rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center gap-2">
                                                <FaPhoneAlt /> Call Collector
                                            </button>
                                            <button onClick={() => navigate('/collection/track-collector')} className="w-full py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                                                <FaMapMarkedAlt /> Track Collector
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Items */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 border col-span-2">
                                <h3 className="text-md font-semibold mb-4 border-b pb-2">Collection Items</h3>

                                {collectionDetails.items.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No items in this collection</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty(Bags) </th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {collectionDetails.items.map((item, index) => (
                                                    console.log("item:", item),
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm text-gray-800">{item.name || `${item.categoryId}`}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.qty}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                                            ₹{item.rate?.toFixed(2) || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                                                            ₹{((item.rate || 0) * item.qty).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50">
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-800 text-right">Total Estimated Cost</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">
                                                        ₹{collectionDetails.items.reduce((total, item) => total + (item.rate * item.qty), 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Pickup Instructions - without card */}
                            <div className="mt-8">
                                <h3 className="text-sm sm:text-md md:text-lg font-semibold text-gray-900 mb-4">Pickup Instructions:</h3>
                                <ul className="text-sm sm:text-md md:text-md font-medium space-y-3 text-gray-800 list-disc pl-5">
                                    <li>
                                        Ensure that all {collectionDetails.type}s are ready for collection on the scheduled pickup day.
                                    </li>
                                    <li>
                                        If you need a GST invoice for billing, please add your GST number in the profile section. The pickup agent will generate the bill accordingly.
                                    </li>
                                    <li>
                                        Check the {collectionDetails.type} rates on the pickup day to verify the final payment amount.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Section - Show only when collection is completed */}
                    {/* {collectionDetails.status === 'completed' && (
                        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border">
                            <h3 className="text-lg font-semibold mb-6 border-b pb-2">Rate Your Experience</h3> */}

                            {/* Toggle between Service and Collector Rating */}
                            {/* <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('service')}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'service'
                                        ? 'bg-white text-green-800 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Rate Service
                                </button>
                                {collector && (
                                    <button
                                        onClick={() => setActiveTab('collector')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'collector'
                                            ? 'bg-white text-green-800 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        Rate Collector
                                    </button>
                                )}
                            </div> */}

                            {/* Rating Display */}
                            {/* <div className="mb-6">
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => activeTab === 'service' ? setServiceRating(star) : setCollectorRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className={`text-3xl transition-transform hover:scale-110 ${star <= (activeTab === 'service' ? serviceRating : collectorRating) ||
                                                star <= hoverRating
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div> */}

                            {/* Feedback Textarea */}
                            {/* <div className="mb-6">
                                <textarea
                                    value={activeTab === 'service' ? serviceFeedback : collectorFeedback}
                                    onChange={(e) => activeTab === 'service'
                                        ? setServiceFeedback(e.target.value)
                                        : setCollectorFeedback(e.target.value)
                                    }
                                    placeholder={activeTab === 'service'
                                        ? "Share your feedback about our service..."
                                        : "Share your feedback about our collector..."
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800"
                                    rows={3}
                                />
                            </div> */}

                            {/* Submit Button */}
                            {/* <button
                                onClick={handleSubmitFeedback}
                                disabled={isSubmittingFeedback || (!serviceRating && !collectorRating)}
                                className={`w-full py-2 px-4 rounded-lg text-white font-medium ${isSubmittingFeedback || (!serviceRating && !collectorRating)
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-800 hover:bg-green-900'
                                    }`}
                            >
                                {isSubmittingFeedback ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    )} */}
                </>
            )}

            {/* Cancel Collection Modal */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Cancel Collection"
                description="Please select a reason for cancellation:"
                confirmLabel="Confirm Cancellation"
                confirmButtonClass="px-4 py-2 bg-red-800 text-white font-medium rounded-lg hover:bg-red-900 transition-colors"
                onConfirm={handleConfirmCancel}
                isDisabled={!selectedReason && !customReason}
            >
                <div className="space-y-2">
                    {predefinedReasons.map((reason) => (
                        <div
                            key={reason.id}
                            onClick={() => {
                                setSelectedReason(reason.reason);
                                setIsCustomReason(reason.reason === 'Other');
                                if (reason.reason !== 'Other') {
                                    setCustomReason('');
                                }
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="text-xl text-red-800">
                                {selectedReason === reason.reason && !isCustomReason ?
                                    <FaCheckCircle className="animate-scale-check" /> :
                                    <FaRegCircle />
                                }
                            </div>
                            <span className={`text-sm font-medium ${selectedReason === reason.reason && !isCustomReason ?
                                'text-red-800' :
                                'text-gray-700'
                                }`}>
                                {reason.reason}
                            </span>
                        </div>
                    ))}

                    {isCustomReason && (
                        <div className="mt-3 pl-8">
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Please specify your reason..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800"
                                rows={3}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default CollectionDetails;

<style>
    {`
    @keyframes scaleCheck {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    .animate-scale-check {
        animation: scaleCheck 0.2s ease-in-out;
    }
    `}
</style>












