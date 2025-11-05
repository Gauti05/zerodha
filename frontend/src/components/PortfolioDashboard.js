import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PortfolioDashboard = () => {
  const { token } = useContext(AuthContext);
  const [holdings, setHoldings] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('https://zerodha-back-koeo.onrender.com/api/portfolio/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHoldings(res.data.holdings);
        setTotalValue(res.data.totalValue);
      } catch (err) {
        console.error('Failed to fetch portfolio analytics');
      }
    };
    fetchAnalytics();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Portfolio Dashboard</h2>
      <p className="mb-4 text-lg">Total Portfolio Value: ${totalValue.toFixed(2)}</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={holdings}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="stockSymbol" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="currentValue" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioDashboard;
