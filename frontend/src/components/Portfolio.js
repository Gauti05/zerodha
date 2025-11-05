import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const SOCKET_URL = 'https://zerodha-back-koeo.onrender.com';

const Portfolio = () => {
  const { token } = useContext(AuthContext);
  const [holdings, setHoldings] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5, 
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setSocketConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setSocketConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

 
    socket.on('priceUpdate', ({ stockSymbol, currentPrice }) => {
      setLivePrices(prevPrices => ({
        ...prevPrices,
        [stockSymbol]: currentPrice,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchHoldings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://zerodha-back-koeo.onrender.com/api/portfolio/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHoldings(res.data.holdings);

        
        const initialPrices = {};
        res.data.holdings.forEach(h => {
          initialPrices[h.stockSymbol] = h.currentPrice || 0;
        });
        setLivePrices(initialPrices);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHoldings();
    }
  }, [token]);

  if (loading) return <p>Loading portfolio...</p>;

  return (
    <div>
      <h2>Your Portfolio (Live Prices {socketConnected ? '🟢' : '🔴'})</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Current Price</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(({ stockSymbol, quantity }) => {
            const price = livePrices[stockSymbol] || 0;
            const value = price * quantity;
            return (
              <tr key={stockSymbol} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{stockSymbol}</td>
                <td className="border border-gray-300 px-4 py-2">{quantity}</td>
                <td className="border border-gray-300 px-4 py-2">${price.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">${value.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
