import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { saveAs } from 'file-saver';

const OrderHistory = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    orderType: '',
    status: '',
    stockSymbol: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page,
        limit: filters.limit,
      });
      const res = await axios.get(`http://localhost:5000/api/order?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(1); 
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('_');
    setFilters({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.info('No orders to export');
      return;
    }
    const csvHeader = 'Stock Symbol,Quantity,Price,Status,Order Type,Date Created\n';
    const csvRows = orders.map(order =>
      [
        order.stockSymbol,
        order.quantity,
        order.price.toFixed(2),
        order.status,
        order.orderType,
        new Date(order.createdAt).toLocaleString(),
      ].join(',')
    );

    const csvContent = csvHeader + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'orders_export.csv');
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`mx-1 px-3 py-1 rounded ${i === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          aria-current={i === page ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="my-3 flex justify-center items-center space-x-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {pages}
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Order History</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <select name="orderType" value={filters.orderType} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">All Order Types</option>
          <option value="buy">Market Buy</option>
          <option value="sell">Market Sell</option>
          <option value="limit">Limit</option>
          <option value="stop_loss">Stop Loss</option>
          <option value="trailing_stop">Trailing Stop</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
        </select>

        <input
          type="text"
          name="stockSymbol"
          value={filters.stockSymbol}
          onChange={handleFilterChange}
          placeholder="Stock Symbol"
          className="border p-2 rounded uppercase"
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          aria-label="Start Date"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          aria-label="End Date"
        />

        <select name="sort" onChange={handleSortChange} defaultValue="createdAt_desc" className="border p-2 rounded">
          <option value="createdAt_desc">Date Descending</option>
          <option value="createdAt_asc">Date Ascending</option>
          <option value="price_desc">Price Descending</option>
          <option value="price_asc">Price Ascending</option>
        </select>

        <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Export CSV
        </button>
      </div>


      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Order Type</th>
              <th className="border border-gray-300 px-4 py-2">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">No orders found.</td>
              </tr>
            ) : (
              orders.map(({ _id, stockSymbol, quantity, price, status, orderType, createdAt }) => (
                <tr key={_id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{stockSymbol}</td>
                  <td className="border border-gray-300 px-4 py-2">{quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">${price.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{status}</td>
                  <td className="border border-gray-300 px-4 py-2">{orderType.replace('_', ' ')}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

  
      {renderPagination()}
    </div>
  );
};

export default OrderHistory;

