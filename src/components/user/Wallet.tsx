import React, { useState, useEffect } from 'react';
import { FaWallet, FaCoins, FaMoneyBillWave, FaHistory } from 'react-icons/fa';
import { TbCoinRupeeFilled } from 'react-icons/tb';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
}

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated wallet data fetch - replace with actual API call
    const fetchWalletData = async () => {
      // Mock wallet data
      setBalance(5240);
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'credit',
          amount: 500,
          description: 'Waste Collection Reward',
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          type: 'debit',
          amount: 200,
          description: 'Bank Transfer',
          timestamp: '1 day ago'
        },
        {
          id: '3',
          type: 'credit',
          amount: 750,
          description: 'Electronic Waste Pickup',
          timestamp: '3 days ago'
        }
      ];

      setTransactions(mockTransactions);
      setLoading(false);
    };

    fetchWalletData();
  }, []);

  const renderBalanceCard = () => (
    <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-green-800">
          <TbCoinRupeeFilled className="text-2xl" />
          <h3 className="font-semibold text-lg">Wallet Balance</h3>
        </div>
        <div className="text-3xl font-bold text-green-900 mt-2">
          ₹{balance.toLocaleString()}
        </div>
      </div>
      <button className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors">
        Add Money
      </button>
    </div>
  );

  const renderTransactionHistory = () => {
    if (loading) {
      return <div className="text-center text-gray-500 py-8">Loading transactions...</div>;
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          No transactions yet
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
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
                <h4 className="font-semibold text-sm">{transaction.description}</h4>
                <p className="text-xs text-gray-500">{transaction.timestamp}</p>
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
    </div>
  );
};

export default Wallet;