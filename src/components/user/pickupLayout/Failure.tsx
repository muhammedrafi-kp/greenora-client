import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { resetPickup } from '../../../redux/pickupSlice';

const Failure: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const error = location.state?.error || 'Payment failed';
    const collectionData = location.state?.collectionData || {};

    console.log("collectionData:", collectionData);

    return (
        <div className="bg-gray-100 min-h-screen py-16">
            <div className="max-w-3xl mx-auto mt-10 px-4">
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center">
                        <div className="flex justify-center mb-4">
                            <XCircle className="w-16 h-16 text-red-500" />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Payment Failed
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {error}
                        </p>

                        <div className="p-4 bg-red-50 rounded-lg mb-6">
                            <p className="text-sm text-red-700">
                                Don't worry! No amount has been deducted from your account.
                                You can try the payment again or choose a different payment method.
                            </p>
                        </div>

                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/pickup/payment', {
                                    state: {
                                        collectionData: collectionData
                                    }
                                })}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => {
                                    dispatch(resetPickup());
                                    navigate('/');
                                }}
                                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
                            >
                                Cancel Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Failure;
