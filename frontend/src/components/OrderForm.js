import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const OrderForm = ({ onOrderPlaced }) => {
  const { token } = useContext(AuthContext);
  const [stockSymbol, setStockSymbol] = useState('');
  const [orderType, setOrderType] = useState('buy'); 
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [trailingAmount, setTrailingAmount] = useState('');
  const [trailingPercent, setTrailingPercent] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!stockSymbol.trim()) errors.stockSymbol = 'Stock symbol is required';
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0)
      errors.quantity = 'Quantity must be a positive number';

    
    if (!price || isNaN(price) || Number(price) <= 0)
      errors.price = 'Price must be a positive number';

    switch (orderType) {
      case 'limit':
        if (!limitPrice || isNaN(limitPrice) || Number(limitPrice) <= 0)
          errors.limitPrice = 'Limit price must be a positive number';
        break;
      case 'stop_loss':
        if (!stopPrice || isNaN(stopPrice) || Number(stopPrice) <= 0)
          errors.stopPrice = 'Stop price must be a positive number';
        break;
      case 'trailing_stop':
        if (
          (!trailingAmount || isNaN(trailingAmount) || Number(trailingAmount) <= 0) &&
          (!trailingPercent || isNaN(trailingPercent) || Number(trailingPercent) <= 0)
        )
          errors.trailing = 'Enter valid trailing amount or percent';
        break;
      default:
        break;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        stockSymbol: stockSymbol.toUpperCase(),
        orderType,
        quantity: Number(quantity),
        price: Number(price),
      };

      if (orderType === 'limit') payload.limitPrice = Number(limitPrice);
      if (orderType === 'stop_loss') payload.stopPrice = Number(stopPrice);
      if (orderType === 'trailing_stop') {
        if (trailingAmount) payload.trailingAmount = Number(trailingAmount);
        if (trailingPercent) payload.trailingPercent = Number(trailingPercent);
      }

      await axios.post('http://localhost:5000/api/order', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Order placed successfully!', { position: 'top-center', autoClose: 2000 });
      if (onOrderPlaced) onOrderPlaced();

      setStockSymbol('');
      setOrderType('buy');
      setQuantity('');
      setPrice('');
      setLimitPrice('');
      setStopPrice('');
      setTrailingAmount('');
      setTrailingPercent('');
      setFormErrors({});
    } catch (err) {
      toast.error('Failed to place order. Please try again.', { position: 'top-center', autoClose: 3000 });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded shadow mb-4 max-w-xl mx-auto" noValidate>
      <h3 className="text-lg font-semibold mb-3">Place Order</h3>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Stock Symbol"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
          className={`border rounded p-2 w-full ${formErrors.stockSymbol ? 'border-red-600' : 'border-gray-300'}`}
          aria-invalid={!!formErrors.stockSymbol}
          aria-describedby="stockSymbolError"
          required
        />
        {formErrors.stockSymbol && (
          <p id="stockSymbolError" className="text-red-600 mt-1">
            {formErrors.stockSymbol}
          </p>
        )}
      </div>

    
      <div className="mb-4">
        <label className="block mb-1">Order Type</label>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="border rounded p-2 w-full"
          aria-label="Order Type"
        >
          <option value="buy">Market Buy</option>
          <option value="sell">Market Sell</option>
          <option value="limit">Limit</option>
          <option value="stop_loss">Stop Loss</option>
          <option value="trailing_stop">Trailing Stop</option>
        </select>
      </div>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={`border rounded p-2 w-full ${formErrors.quantity ? 'border-red-600' : 'border-gray-300'}`}
          aria-invalid={!!formErrors.quantity}
          aria-describedby="quantityError"
          min="1"
          required
        />
        {formErrors.quantity && (
          <p id="quantityError" className="text-red-600 mt-1">
            {formErrors.quantity}
          </p>
        )}
      </div>

    
      <div className="mb-4">
        <input
          type="number"
          placeholder="Price (base / trigger price)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`border rounded p-2 w-full ${formErrors.price ? 'border-red-600' : 'border-gray-300'}`}
          aria-invalid={!!formErrors.price}
          aria-describedby="priceError"
          min="0.01"
          step="0.01"
          required
        />
        {formErrors.price && (
          <p id="priceError" className="text-red-600 mt-1">
            {formErrors.price}
          </p>
        )}
      </div>

     
      {orderType === 'limit' && (
        <div className="mb-4">
          <input
            type="number"
            placeholder="Limit Price"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className={`border rounded p-2 w-full ${formErrors.limitPrice ? 'border-red-600' : 'border-gray-300'}`}
            aria-invalid={!!formErrors.limitPrice}
            aria-describedby="limitPriceError"
            min="0.01"
            step="0.01"
            required
          />
          {formErrors.limitPrice && <p id="limitPriceError" className="text-red-600 mt-1">{formErrors.limitPrice}</p>}
        </div>
      )}

      {orderType === 'stop_loss' && (
        <div className="mb-4">
          <input
            type="number"
            placeholder="Stop Price"
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value)}
            className={`border rounded p-2 w-full ${formErrors.stopPrice ? 'border-red-600' : 'border-gray-300'}`}
            aria-invalid={!!formErrors.stopPrice}
            aria-describedby="stopPriceError"
            min="0.01"
            step="0.01"
            required
          />
          {formErrors.stopPrice && <p id="stopPriceError" className="text-red-600 mt-1">{formErrors.stopPrice}</p>}
        </div>
      )}

      {orderType === 'trailing_stop' && (
        <>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Trailing Amount (optional)"
              value={trailingAmount}
              onChange={(e) => setTrailingAmount(e.target.value)}
              className={`border rounded p-2 w-full ${
                formErrors.trailing ? 'border-red-600' : 'border-gray-300'
              }`}
              aria-invalid={!!formErrors.trailing}
              aria-describedby="trailingError"
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Trailing Percent (optional)"
              value={trailingPercent}
              onChange={(e) => setTrailingPercent(e.target.value)}
              className={`border rounded p-2 w-full ${
                formErrors.trailing ? 'border-red-600' : 'border-gray-300'
              }`}
              aria-invalid={!!formErrors.trailing}
              aria-describedby="trailingError"
              min="0.01"
              step="0.01"
            />
          </div>
          {formErrors.trailing && <p id="trailingError" className="text-red-600 mt-1">{formErrors.trailing}</p>}
        </>
      )}

   
      <button
        type="submit"
        disabled={loading || Object.keys(formErrors).length > 0}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
        aria-disabled={loading || Object.keys(formErrors).length > 0}
      >
        {loading ? 'Placing...' : 'Place Order'}
      </button>
    </form>
  );
};

export default OrderForm;
