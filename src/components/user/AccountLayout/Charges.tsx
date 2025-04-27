import React, { useEffect, useState } from 'react';
import { Info } from "lucide-react";
import { getCategories } from '../../../services/userService';
import { TbCoinRupeeFilled } from "react-icons/tb";

export interface IWasteCategory {
  _id: string;
  name: string;
  type: "waste" | "scrap";
  description: string;
  rate: number;
}

const Charges: React.FC = () => {
  const [showWaste, setShowWaste] = useState(true);
  const [categories, setCategories] = useState<IWasteCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      console.log("response", response);
      if (response.success) {
        console.log(response.data);
        setCategories(response.data);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories based on type
  const filteredCategories = categories.filter(category =>
    showWaste ? category.type === "waste" : category.type === "scrap"
  );

  console.log(filteredCategories);

  return (
    <div>
      <div className="mb-6">
        <h2 className="lg:text-lg xs:text-base text-sm sm:text-left flex items-center gap-2 text-center font-semibold">
          {/* <TbCoinRupeeFilled /> */}
          Collection Charges
        </h2>
      </div>

      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowWaste(true)}
            className={`px-4 py-2 xs:text-sm text-xs transition-colors ${showWaste
              ? 'bg-green-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Waste
          </button>
          <button
            onClick={() => setShowWaste(false)}
            className={`md:px-3 px-2 md:py-2 py-1 xs:text-sm text-xs transition-colors ${!showWaste
              ? 'bg-green-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Scrap
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredCategories.length > 0 ? (
          <div className={`${filteredCategories.length > 5 ? 'max-h-[325px] overflow-y-auto [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2' : ''}`}>
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 xs:text-sm text-xs font-medium text-gray-700 text-left border-b" style={{ width: '20%' }}>
                    Type
                  </th>
                  <th className="px-4 py-3 xs:text-sm text-xs font-medium text-gray-700 text-center border-b" style={{ width: '15%' }}>
                    Rate (per kg)
                  </th>
                  <th className="px-4 py-3 xs:text-sm text-xs font-medium text-gray-700 text-left border-b">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredCategories.map((item, index) => (
                  <tr key={item._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 xs:text-sm text-xs text-gray-900 border-b font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 xs:text-sm text-xs text-center text-green-800 font-semibold border-b">
                      ₹{item.rate}
                    </td>
                    <td className="px-4 py-3 xs:text-sm text-xs text-gray-600 border-b">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {showWaste ? 'scrap' : 'waste'} categories found
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
        <Info className="w-4 h-4 text-gray-600 mt-0.5" />
        <p className="xs:text-sm text-xs text-gray-800">
          Prices may vary based on quantity and market conditions. Contact our team for bulk pricing.
        </p>
      </div>
    </div>
  );
};

export default Charges;