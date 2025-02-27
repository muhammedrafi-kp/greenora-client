import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Wallet, CreditCard } from 'lucide-react';
import { initiatePayment, verifyPayment } from '../../../services/userService';
import { useDispatch } from 'react-redux';
import { setStep, resetPickup } from '../../../redux/pickupSlice';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collectionData = location.state?.collectionData;
  const advanceAmount = 50;
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'online' | null>(null);
  const walletBalance = 1000;

  const dispatch = useDispatch();
  const { Razorpay } = useRazorpay();


  const handleBack = () => {
    dispatch(setStep({ step: 4 }));
    navigate('/pickup/review');
  }

  const initializePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }


    if (selectedMethod === 'online') {

      console.log("collectionData:", collectionData);
      setLoading(true);
      try {
        const response = await initiatePayment(collectionData);

        console.log("response:", response);
        if (response.success) {

          const options: RazorpayOrderOptions = {
            key: "rzp_test_b0szQvJZ7F009R", // Razorpay Key ID from .env
            amount: response.amount,
            currency: "INR",
            name: "Your Company Name",
            description: "Test Transaction",
            order_id: response.orderId, // Order ID from Backend
            handler: async (response: any) => {
              try {
                const verifyResponse = await verifyPayment(response);
                
                if (verifyResponse.success) {
                  dispatch(setStep({ step: 1 }));
                  dispatch(resetPickup());
                  navigate('/pickup/success');
                } else {
                  navigate('/pickup/failure', { 
                    state: { 
                      error: verifyResponse.message,
                      collectionData: collectionData
                    } 
                  });
                }
              } catch (error: any) {
                navigate('/pickup/failure', { 
                  state: { 
                    error: error.message || 'Payment verification failed',
                    collectionData: collectionData
                  } 
                });
              }
            },
            prefill: {
              name: "John Doe",
              email: "johndoe@example.com",
              contact: "9999999999",
            },
            notes: "Razorpay Corporate Office",
            theme: {
              color: "#3399cc",
            },
            modal: {
              ondismiss: function() {
                navigate('/pickup/failure', {
                  state: { 
                    error: 'Payment was cancelled',
                    collectionData: collectionData
                  }
                });
              }
            }
          };

          const razorpay = new Razorpay(options);
          razorpay.open();

        } else {
          navigate('/pickup/failure', { 
            state: { error: response.message || 'Failed to initiate payment' } 
          });
        }
      } catch (error: any) {
        navigate('/pickup/failure', { 
          state: { error: error.message || 'Something went wrong' } 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Details
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <Lock className="w-4 h-4 mr-1" />
            Secure Payment
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">Advance Payment Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{advanceAmount}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-gray-700">Select Payment Method</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedMethod('wallet')}
              className={`flex items-center justify-between p-4 border rounded-lg transition-all
                ${selectedMethod === 'wallet'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-200'}`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">Pay with Wallet</p>
                  <p className="text-xs text-gray-500">Balance: ₹{walletBalance}</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'wallet' ? 'border-green-500' : 'border-gray-300'
                }`}>
                {selectedMethod === 'wallet' && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('online')}
              className={`flex items-center justify-between p-4 border rounded-lg transition-all
                ${selectedMethod === 'online'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-200'}`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">Online Payment</p>
                  <p className="text-xs text-gray-500">UPI, Card, Net Banking</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'online' ? 'border-green-500' : 'border-gray-300'
                }`}>
                {selectedMethod === 'online' && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </div>
            </button>
          </div>

          {selectedMethod === 'wallet' && walletBalance < collectionData.estimatedCost && (
            <p className="text-sm text-red-500">
              Insufficient wallet balance. Please add money or choose online payment.
            </p>
          )}
        </div>

        <div className="flex gap-4">
          {!loading && (
            <button
              type="button"
              onClick={handleBack}
              className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={initializePayment}
            disabled={loading || !selectedMethod || (selectedMethod === 'wallet' && walletBalance < collectionData.estimatedCost)}
            className={`${loading ? 'w-full' : 'w-1/2'} bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-sm font-medium
              ${loading || !selectedMethod || (selectedMethod === 'wallet' && walletBalance < collectionData.estimatedCost)
                ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : `Pay with ${selectedMethod === 'wallet' ? 'Wallet' : 'Online'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;    