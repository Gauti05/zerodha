import React, { useState } from 'react';
import StockDetail from './StockDetail';

const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.64, change: 1.23 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 134.21, change: -0.34 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 299.01, change: 0.56 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 732.99, change: -2.37 },
];






const StockList = () => {
  const [stocks] = useState(mockStocks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  const filteredStocks = stocks.filter(
    stock =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Stock Listings</h2>
        <input
          type="text"
          placeholder="Search by symbol or name..."
          className="w-full mb-4 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Symbol</th>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-right">Price ($)</th>
              <th className="border border-gray-300 p-2 text-right">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr
                key={stock.symbol}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedStock?.symbol === stock.symbol ? 'bg-gray-200' : ''
                }`}
                onClick={() => setSelectedStock(stock)}
              >
                <td className="border border-gray-300 p-2 font-mono">{stock.symbol}</td>
                <td className="border border-gray-300 p-2">{stock.name}</td>
                <td className="border border-gray-300 p-2 text-right">{stock.price.toFixed(2)}</td>
                <td
                  className={`border border-gray-300 p-2 text-right ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StockDetail stock={selectedStock} />
    </>
  );
};

export default StockList;
