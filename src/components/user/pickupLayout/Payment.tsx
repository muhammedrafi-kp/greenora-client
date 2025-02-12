import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentDetails {
  amount: number;
  currency: string;
  requestId: string;
}

const Payment = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails >( {
    amount: 500,
    currency: 'inr',
    requestId: '12345678'
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  useEffect(() => {
    const fetchPaymentDetails = async () => {
    //   try {
    //     const response = await axios.get(`/api/pickup/${requestId}/payment`);
    //     setPaymentDetails(response.data);
    //   } catch (error) {
    //     toast.error('Failed to load payment details');
    //     navigate(`/pickup/review/${requestId}`);
    //   } finally {
    //     setIsLoading(false);
    //   }
    };
    fetchPaymentDetails();
  }, [requestId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // try {
    //   await axios.post(`/api/pickup/${requestId}/process-payment`, paymentForm);
    //   navigate(`/pickup/success/${requestId}`);
    // } catch (error) {
    //   toast.error('Payment failed. Please try again.');
    // } finally {
    //   setIsProcessing(false);
    // }
  };

//   if (isLoading || !paymentDetails) {
//     return (
//       <div className="flex justify-center items-center min-h-[200px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
//       </div>
//     );
//   }

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

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">Total Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              ${paymentDetails.amount.toFixed(2)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="cardNumber"
                value={paymentForm.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full pl-10 p-2.5 border border-gray-200 rounded-lg text-sm"
                required
                maxLength={19}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={paymentForm.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                required
                maxLength={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={paymentForm.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                required
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              value={paymentForm.cardholderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(`/pickup/review/${requestId}`)}
              className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment; 