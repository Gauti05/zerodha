import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import OrderForm from './OrderForm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockDetail = ({ stock }) => {
  if (!stock) return null;

  const labels = ['Sep 28', 'Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4'];

  const priceData = [
    stock.price * 0.92,
    stock.price * 0.95,
    stock.price * 0.93,
    stock.price * 0.96,
    stock.price * 0.94,
    stock.price * 0.97,
    stock.price,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: `${stock.symbol} Price`,
        data: priceData,
        fill: false,
        backgroundColor: 'rgb(34,197,94)', 
        borderColor: 'rgba(34,197,94,0.8)',
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Price History (Last 7 Days)' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Date' },
      },
      y: {
        display: true,
        title: { display: true, text: 'Price (USD)' },
        suggestedMin: Math.min(...priceData)*0.95,
        suggestedMax: Math.max(...priceData)*1.05,
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{stock.name} ({stock.symbol})</h2>
      <p className="mb-2">Current Price: ${stock.price.toFixed(2)}</p>
      <p className={`mb-6 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        Change: {stock.change >= 0 ? '+' : ''}
        {stock.change.toFixed(2)}%
      </p>

      <Line data={chartData} options={chartOptions} />

      <OrderForm stockSymbol={stock.symbol} />
    </div>
  );
};

export default StockDetail;
