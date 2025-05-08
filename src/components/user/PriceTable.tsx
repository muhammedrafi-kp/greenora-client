import { useState } from "react"
import { ChevronUp, ChevronDown,Info  } from "lucide-react";
import { ICategory } from "../../types/collection";




interface PriceTableProps {
  type: "waste" | "scrap"
  categories: ICategory[]
}



const PriceTable: React.FC<PriceTableProps> = ({ categories, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [sortField, setSortField] = useState<"name" | "price">("name")
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  // const [selectedRow, setSelectedRow] = useState<number | null>(null)

  const filteredCategories = categories.filter(category => category.type === type);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white ">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">No.</th>
            <th
              className="py-3 px-4 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                Name
              </div>
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                Price (₹)
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((item, index) => (
            <tr
              key={item.name}
              className={`border-t transition-colors hover:bg-gray-50 cursor-pointer`}
              // onClick={() => setSelectedRow(index)}
            >
              <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
              <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.name}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{item.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
        <Info className="w-3 h-3 text-blue-600 mt-0.5" />
        <p className="text-xs text-blue-800">
          Prices may vary based on location and market conditions. Contact our team for bulk pricing.
        </p>
      </div>
    </div>
  )
}

export default PriceTable;


