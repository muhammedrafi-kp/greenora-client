import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Wallet, CreditCard } from 'lucide-react';
import { initiateRazorpayAdvance, payAdvanceWithWallet, verifyRazorpayAdvance } from "../../../services/collectionService"
import { getWalletData } from '../../../services/paymentService';
import { useDispatch } from 'react-redux';
import { setStep, resetPickup } from '../../../redux/pickupSlice';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';
import Modal from '../../../components/common/Modal';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collectionData = location.state?.collectionData;
  const advanceAmount = 50;
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'online' | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { Razorpay } = useRazorpay();

  console.log("collectionData From state:", collectionData);

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      try {

        const response = await getWalletData()
        console.log("wallet data:", response);

        if (response.success) {
          setWalletBalance(response.data.balance);
        }

      } catch (error) {
        console.error("Error fetching wallet data:", error);

      } finally {
        setLoading(false);
      }
    }

    fetchWalletData();
  }, []);


  const handleBack = () => {
    dispatch(setStep({ step: 4 }));
    navigate('/pickup/review');
  }

  const initializePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    console.log("collectionData:", collectionData);

    if (selectedMethod === 'wallet') {
      setLoading(true);
      try {
        const response = await payAdvanceWithWallet(collectionData);
        console.log("wallet payment response:", response);

        if (response.success) {
          dispatch(setStep({ step: 1 }));
          dispatch(resetPickup());
          navigate('/pickup/success');
        } else {
          navigate('/pickup/failure', {
            state: {
              error: response.message || 'Payment failed',
              collectionData: collectionData
            }
          });
          toast.error(response.message || 'Payment failed');
        }
      } catch (error: any) {
        navigate('/pickup/failure', {
          state: {
            error: error.message || 'Something went wrong',
            collectionData: collectionData
          }
        });
        toast.error(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (selectedMethod === 'online') {

      setLoading(true);
      console.log("collectionData final:", collectionData);
      try {
        const response: { success: boolean, message: string, data: { amount: number, orderId: string } } = await initiateRazorpayAdvance(collectionData);

        console.log("initiate payment response:", response);
        if (response.success) {

          const options: RazorpayOrderOptions = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            currency: "INR",
            name: "Greenora",
            description: "Collection Advance Payment",
            order_id: response.data.orderId,
            theme: {
              color: "#10B981"
            },
            handler: async (response: any) => {
              try {
                console.log("razorpay response :", response)
                const verifyResponse = await verifyRazorpayAdvance(response);

                console.log("verify payment response:", verifyResponse);
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
            modal: {
              ondismiss: function () {
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

  const handlePaymentClick = () => {
    if (selectedMethod === 'wallet') {
      setIsConfirmModalOpen(true);
    } else {
      initializePayment();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Details
          </h3>
          <div className="flex items-center text-sm font-medium text-gray-600">
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
                  <p className="text-xs font-medium text-gray-500">Balance: ₹{walletBalance}</p>
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
                  <p className="text-xs font-medium text-gray-500">UPI, Card, Net Banking</p>
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

          {selectedMethod === 'wallet' && walletBalance < 50 && (
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
              className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handlePaymentClick}
            disabled={loading || !selectedMethod || (selectedMethod === 'wallet' && walletBalance < 50)}
            className={`${loading ? 'w-full' : 'w-1/2'} bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-md font-medium
              ${loading || !selectedMethod || (selectedMethod === 'wallet' && walletBalance < 50)
                ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : `Pay with ${selectedMethod === 'wallet' ? 'Wallet' : 'Online'}`}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Payment"
        description={`Are you sure you want to pay ₹${advanceAmount} from your wallet?`}
        confirmLabel="Confirm Payment"
        onConfirm={initializePayment}
        isDisabled={loading}
        confirmButtonClass="px-4 py-2 rounded-lg text-white bg-green-800 hover:bg-green-900 transition-colors cursor-pointer"
      >
        <div className="text-center py-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm">
            <p>Amount will be deducted from your wallet balance.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payment; 