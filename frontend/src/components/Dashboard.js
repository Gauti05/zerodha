import React, { useState } from 'react';
import OrderForm from './OrderForm';
import PortfolioDashboard from './PortfolioDashboard';  
import OrderHistory from './OrderHistory';
import Modal from './Modal'; 

const Dashboard = () => {
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  const handleOrderPlaced = () => {
    setRefreshOrders(prev => !prev);
    setIsModalOpen(false); 
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

    
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Place Order
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <OrderForm onOrderPlaced={handleOrderPlaced} />
      </Modal>

      <PortfolioDashboard />

      <OrderHistory key={refreshOrders} />
    </div>
  );
};

export default Dashboard;
