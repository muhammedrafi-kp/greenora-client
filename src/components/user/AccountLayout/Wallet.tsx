import React, { useState, useEffect } from 'react';
import { FaWallet, FaCoins, FaMoneyBillWave, FaHistory } from 'react-icons/fa';
import { TbCoinRupeeFilled } from 'react-icons/tb';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';
import Modal from '../../common/Modal';
import WalletSkeleton from '../skeltons/WalletSkelton';
import { getWalletData, initiateAddMoney, verifyAddMoney, withdrawMoney } from '../../../services/userService';
import { toast } from 'react-hot-toast';

export interface ITransaction {
  _id: string;
  type: "debit" | "credit" | "refund";
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

  // Filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const isAnyFilterActive = () => {
    return startDate !== '' || endDate !== '' || selectedType !== 'all';
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedType('all');
  };

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const response = await getWalletData();
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

  const filterTransactions = () => {
    if (!walletData?.transactions) return [];

    // Sort by timestamp descending (latest first)
    const sorted = [...walletData.transactions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return sorted.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0];
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      const matchesStartDate = !startDate || transactionDate >= startDate;
      const matchesEndDate = !endDate || transactionDate <= endDate;

      return matchesType && matchesStartDate && matchesEndDate;
    });
  };

  const filteredTransactions = filterTransactions();

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
    if (amount && amount >= 50 && walletData && amount <= walletData.balance) {
      setIsWithdrawModalOpen(false);
      setIsConfirmWithdrawModalOpen(true);
    }
  };

  const handleFinalWithdraw = async () => {
    if (amount && amount >= 50 && walletData && amount <= walletData.balance) {
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
          ₹{walletData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
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

    if (filteredTransactions.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          No transactions found
        </div>
      );
    }

    return (
      <div className="space-y-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-4"
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
              {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            {/* Desktop Filters */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Type Filter Dropdown */}
              <div className="flex flex-col gap-1 relative">
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Filter */}
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 relative">
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        const today = new Date().toISOString().split('T')[0];
                        
                        if (endDate && newStartDate > endDate) {
                          toast.error('Start date cannot be greater than end date');
                          return;
                        }
                        if (newStartDate > today) {
                          toast.error('Start date cannot be in the future');
                          return;
                        }
                        setStartDate(newStartDate);
                      }}
                      max={endDate || new Date().toISOString().split('T')[0]}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                      From
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 relative">
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        const newEndDate = e.target.value;
                        const today = new Date().toISOString().split('T')[0];
                        
                        if (startDate && newEndDate < startDate) {
                          toast.error('End date cannot be less than start date');
                          return;
                        }
                        if (newEndDate > today) {
                          toast.error('End date cannot be in the future');
                          return;
                        }
                        setEndDate(newEndDate);
                      }}
                      min={startDate || undefined}
                      max={new Date().toISOString().split('T')[0]}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                      To
                    </span>
                  </div>
                </div>
              </div>

              {/* Clear Filter Button */}
              {isAnyFilterActive() && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-1"
                >
                  Clear Filters
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile Filter Icon */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="sm:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
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
        isDisabled={!amount || amount < 50 || !walletData || amount > walletData.balance || error !== null}
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
                disabled={!walletData || 50 > walletData.balance}
              >
                ₹50
              </button>
              <button
                onClick={() => { setAmount(100); setError(null); }}
                className="bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-center font-medium"
                disabled={!walletData || 100 > walletData.balance}
              >
                ₹100
              </button>
              <button
                onClick={() => { setAmount(200); setError(null); }}
                className="bg-purple-50 border border-purple-200 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium"
                disabled={!walletData || 200 > walletData.balance}
              >
                ₹200
              </button>
              <button
                onClick={() => { setAmount(500); setError(null); }}
                className="bg-orange-50 border border-orange-200 text-orange-700 py-2 px-3 rounded-lg hover:bg-orange-100 transition-colors text-center font-medium"
                disabled={!walletData || 500 > walletData.balance}
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

      {/* Filter Modal for Small Screens */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:hidden">
          <div className="bg-white rounded-xl w-full max-w-md mx-4">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Type Filter Dropdown */}
              <div className="flex flex-col gap-1 relative">
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full appearance-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                  <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                    Type
                  </span>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Filter Section */}
              <div className="space-y-4">
                <p className="text-xs font-medium text-gray-600">Date Range</p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 relative">
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          const newStartDate = e.target.value;
                          const today = new Date().toISOString().split('T')[0];
                          
                          if (endDate && newStartDate > endDate) {
                            toast.error('Start date cannot be greater than end date');
                            return;
                          }
                          if (newStartDate > today) {
                            toast.error('Start date cannot be in the future');
                            return;
                          }
                          setStartDate(newStartDate);
                        }}
                        max={endDate || new Date().toISOString().split('T')[0]}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                      />
                      <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                        From
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 relative">
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          const newEndDate = e.target.value;
                          const today = new Date().toISOString().split('T')[0];
                          
                          if (startDate && newEndDate < startDate) {
                            toast.error('End date cannot be less than start date');
                            return;
                          }
                          if (newEndDate > today) {
                            toast.error('End date cannot be in the future');
                            return;
                          }
                          setEndDate(newEndDate);
                        }}
                        min={startDate || undefined}
                        max={new Date().toISOString().split('T')[0]}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                      />
                      <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                        To
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {isAnyFilterActive() && (
                  <button
                    onClick={() => {
                      handleClearFilters();
                      setShowFilterModal(false);
                    }}
                    className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    Clear Filters
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="w-full bg-green-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;