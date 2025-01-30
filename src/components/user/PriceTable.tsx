import { useState } from "react"
import { ChevronUp, ChevronDown,Info  } from "lucide-react"

interface PriceTableProps {
  type: "waste" | "scrap"
}

interface PriceItem {
  name: string
  price: string
}

const PriceTable: React.FC<PriceTableProps> = ({ type }) => {
  const [sortField, setSortField] = useState<"name" | "price">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedRow, setSelectedRow] = useState<number | null>(null)

  const prices: PriceItem[] =
    type === "waste"
      ? [
        { name: "Household Waste", price: "$10/bag" },
        { name: "Recyclable Waste", price: "$5/bag" },
        { name: "Green Waste", price: "$8/bag" },
        { name: "Bulky Items", price: "$20/item" },
      ]
      : [
        { name: "Metal Scrap", price: "$0.50/kg" },
        { name: "Paper", price: "$0.20/kg" },
        { name: "Plastic", price: "$0.30/kg" },
        { name: "Electronics", price: "$1.00/kg" },
      ]

  const handleSort = (field: "name" | "price") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedPrices = [...prices].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1
    if (sortField === "name") {
      return a.name.localeCompare(b.name) * modifier
    } else {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""))
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""))
      return (priceA - priceB) * modifier
    }
  })

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white ">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">No.</th>
            <th
              className="py-3 px-4 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-2">
                Name
                {sortField === "name" && (
                  sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("price")}
            >
              <div className="flex items-center gap-2">
                Price
                {sortField === "price" && (
                  sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPrices.map((item, index) => (
            <tr
              key={item.name}
              className={`border-t transition-colors hover:bg-gray-50 cursor-pointer
                ${selectedRow === index ? 'bg-green-50' : ''}`}
              onClick={() => setSelectedRow(index)}
            >
              <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
              <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.name}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{item.price}</td>
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


