import React, { useState, useEffect } from 'react';
import { FaWallet, FaCoins, FaMoneyBillWave, FaHistory } from 'react-icons/fa';
import { TbCoinRupeeFilled } from 'react-icons/tb';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';
import Modal from '../common/Modal';
import WalletSkeleton from './skeltons/WalletSkelton';
import { getWalletData, initiateAddMoney, verifyAddMoney, withdrawMoney } from '../../services/userService';

export interface ITransaction {
  _id: string;
  type: "payment" | "refund" | "top-up";
  amount: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  serviceType: string;
}

interface IWallet {
  userId: string;
  balance: number;
  transactions: ITransaction[];
  status: "active" | "suspended" | "closed";
}

const Wallet: React.FC = () => {
  const [walletData, setWalletData] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isConfirmWithdrawModalOpen, setIsConfirmWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { Razorpay } = useRazorpay();

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const response = await getWalletData();
      console.log("wallet response:", response);
      if (response.success) {
        setWalletData(response.data);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleAddMoney = () => {
    setAmount(null);
    setError(null);
    setIsAddMoneyModalOpen(true);
  };

  const handleWithdraw = () => {
    setAmount(null);
    setError(null);
    setIsWithdrawModalOpen(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, isWithdrawal = false) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      setError("Please enter numbers only");
      return;
    }

    const numValue = value === '' ? null : Number(value);

    if (isWithdrawal && numValue !== null && numValue < 50) {
      setError("Minimum withdrawal amount is ₹50");
    } else if (isWithdrawal && numValue !== null && walletData?.balance !== undefined && numValue > walletData.balance) {
      setError(`Insufficient balance. Available: ₹${walletData.balance.toLocaleString()}`);
    } else {
      setError(null);
    }

    setAmount(numValue);
  };

  const handleConfirmAddMoney = async () => {
    if (amount && amount > 0) {
      setIsAddMoneyModalOpen(false);
      setAmount(null);
      setError(null);

      // Add money to the wallet
      const response = await initiateAddMoney(amount);
      console.log("initiatePayment response:", response);
      if (response.success) {
        const options: RazorpayOrderOptions = {
          key: "rzp_test_b0szQvJZ7F009R", // Razorpay Key ID from .env
          amount: response.amount,
          currency: "INR",
          name: "Greenora",
          order_id: response.orderId,
          handler: async (response: any) => {
            try {
              console.log("resposne2 :", response)
              const verifyResponse = await verifyAddMoney(response);

              if (verifyResponse.success) {
                console.log("verifyResponse:", verifyResponse);
                setIsAddMoneyModalOpen(false);
                setAmount(null);
                setError(null);
                fetchWalletData();
              }
            } catch (error) {
              console.log("error:", error);
            }
          }
        }

        const razorpay = new Razorpay(options);
        razorpay.open();
      }

    }
  };

  const handleConfirmWithdraw = async () => {
    if (amount && amount >= 50 && amount <= walletData?.balance) {
      setIsWithdrawModalOpen(false);
      setIsConfirmWithdrawModalOpen(true);
    }
  };

  const handleFinalWithdraw = async () => {
    if (amount && amount >= 50 && amount <= walletData?.balance) {
      setIsConfirmWithdrawModalOpen(false);
      setAmount(null);
      setError(null);

      const response = await withdrawMoney(amount);
      if (response.success) {
        fetchWalletData();
      }

      console.log("withdrawMoney response:", response);
    }
  };

  if (loading) {
    return <WalletSkeleton />;
  }

  const renderBalanceCard = () => (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-green-800">
          <TbCoinRupeeFilled className="text-xl" />
          <h3 className="font-semibold text-lg">Balance</h3>
        </div>
        <div className="text-2xl font-bold text-green-900 mt-2">
          ₹{walletData?.balance?.toLocaleString() || '0'}
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleWithdraw}
          className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors"
        >
          Withdraw
        </button>
        <button
          onClick={handleAddMoney}
          className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
        >
          Add Money
        </button>
      </div>
    </div>
  );

  const renderTransactionHistory = () => {
    if (loading) {
      return <div className="text-center text-gray-500 py-8">Loading transactions...</div>;
    }

    if (walletData?.transactions.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          No transactions yet
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {walletData?.transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between bg-white border border-gray-100  rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              <div className={`
                p-2 rounded-full 
                ${transaction.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
              `}>
                {transaction.type === 'credit' ? <FaCoins /> : <FaMoneyBillWave />}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{transaction.serviceType}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className={`
              font-semibold text-sm
              ${transaction.type === 'credit' ? 'text-green-700' : 'text-red-700'}
            `}>
              {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="lg:text-lg xs:text-base text-sm font-semibold flex items-center gap-2">
          {/* <FaWallet /> */}
          My Wallet
        </h2>
      </div>

      <div className="space-y-6">
        {renderBalanceCard()}

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FaHistory /> Transaction History
            </h3>
            <button className="text-xs text-green-700 hover:underline">
              View All
            </button>
          </div>

          {renderTransactionHistory()}
        </div>
      </div>

      {/* Add Money Modal */}
      <Modal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        title="Add Money"
        description="Enter an amount or select a quick option below."
        confirmLabel="Add Money"
        onConfirm={handleConfirmAddMoney}
        isDisabled={!amount || amount <= 0 || error !== null}
        confirmButtonClass="px-4 py-2 rounded-lg text-white bg-green-800 hover:bg-green-900 transition-colors cursor-pointer"
      >
        <div className="flex flex-col space-y-4">
          {/* Input field first */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="text"
              value={amount === null ? '' : amount}
              onChange={(e) => handleAmountChange(e, false)}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 transition-all"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Quick amount options in a single row */}
          <div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => { setAmount(50); setError(null); }}
                className="bg-blue-50 border border-blue-200 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
              >
                ₹50
              </button>
              <button
                onClick={() => { setAmount(100); setError(null); }}
                className="bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-center font-medium"
              >
                ₹100
              </button>
              <button
                onClick={() => { setAmount(200); setError(null); }}
                className="bg-purple-50 border border-purple-200 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium"
              >
                ₹200
              </button>
              <button
                onClick={() => { setAmount(500); setError(null); }}
                className="bg-orange-50 border border-orange-200 text-orange-700 py-2 px-3 rounded-lg hover:bg-orange-100 transition-colors text-center font-medium"
              >
                ₹500
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Money"
        description="Enter an amount or select a quick option below."
        confirmLabel="Withdraw"
        onConfirm={handleConfirmWithdraw}
        isDisabled={!amount || amount < 50 || amount > walletData?.balance || error !== null}
        confirmButtonClass="px-4 py-2 rounded-lg text-white bg-red-800 hover:bg-red-900 transition-colors cursor-pointer"
      >
        <div className="flex flex-col space-y-4">
          {/* Input field first */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="text"
              value={amount === null ? '' : amount}
              onChange={(e) => handleAmountChange(e, true)}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 transition-all"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Quick amount options in a single row */}
          <div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => { setAmount(50); setError(null); }}
                className="bg-blue-50 border border-blue-200 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
                disabled={50 > walletData?.balance}
              >
                ₹50
              </button>
              <button
                onClick={() => { setAmount(100); setError(null); }}
                className="bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-center font-medium"
                disabled={100 > walletData?.balance}
              >
                ₹100
              </button>
              <button
                onClick={() => { setAmount(200); setError(null); }}
                className="bg-purple-50 border border-purple-200 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium"
                disabled={200 > walletData?.balance}
              >
                ₹200
              </button>
              <button
                onClick={() => { setAmount(500); setError(null); }}
                className="bg-orange-50 border border-orange-200 text-orange-700 py-2 px-3 rounded-lg hover:bg-orange-100 transition-colors text-center font-medium"
                disabled={500 > walletData?.balance}
              >
                ₹500
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={isConfirmWithdrawModalOpen}
        onClose={() => setIsConfirmWithdrawModalOpen(false)}
        title="Confirm Withdrawal"
        description={`Are you sure you want to withdraw ₹${amount?.toLocaleString() || 0}?`}
        confirmLabel="Confirm Withdrawal"
        onConfirm={handleFinalWithdraw}
        isDisabled={false}
        confirmButtonClass="px-4 py-2 rounded-lg text-white bg-red-800 hover:bg-red-900 transition-colors cursor-pointer"
      >
        <div className="text-center py-2">
          {/* <p className="text-gray-600 mb-4">
            The amount will be transferred to your registered bank account. This process may take 1-3 business days.
          </p> */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm">
            <p>            The amount will be transferred to your registered bank account. This process may take 1-3 business days.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;