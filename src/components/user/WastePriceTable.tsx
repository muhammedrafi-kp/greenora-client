const WastePriceTable = () => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            No.
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Waste Type
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price (per kg)
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Organic Waste</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">$0.50</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Plastic Waste</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">$0.75</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Paper Waste</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">$0.60</td>
        </tr>
      </tbody>
    </table>
  )
}

export default WastePriceTable

