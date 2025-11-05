const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Portfolio = require('../models/Portfolio');
const { verifyToken } = require('../middleware/auth');
const mongoose = require('mongoose');


const processPendingOrder = async (order, io) => {
  setTimeout(async () => {
    try {
  
      const isSuccess = Math.random() > 0.2;
      order.status = isSuccess ? 'completed' : 'failed';
      await order.save();

      if (isSuccess) {
        
        await updatePortfolio(order.userId, order.stockSymbol, order.quantity, order.orderType);
      }


      io.emit('orderStatusUpdate', {
        orderId: order._id.toString(),
        status: order.status,
        userId: order.userId.toString(),
      });

      console.log(`Order ${order._id} processed with status: ${order.status}`);
    } catch (err) {
      console.error('Error processing order:', err);
    }
  }, 7000); 
};


router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      orderType,
      status,
      stockSymbol,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { userId };

    if (orderType) query.orderType = orderType;
    if (status) query.status = status;
    if (stockSymbol) query.stockSymbol = stockSymbol.toUpperCase();

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [orders, total] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error fetching orders with filters:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', verifyToken, async (req, res) => {
  const {
    stockSymbol,
    quantity,
    price,
    orderType,
    limitPrice,
    stopPrice,
    trailingAmount,
    trailingPercent,
  } = req.body;
  const userId = req.user.id;
  const io = req.app.locals.io;


  if (!['buy', 'sell', 'limit', 'stop_loss', 'trailing_stop'].includes(orderType)) {
    return res.status(400).json({ message: 'Invalid order type' });
  }
  if (!stockSymbol || !quantity || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (quantity <= 0 || price <= 0) {
    return res.status(400).json({ message: 'Quantity and price must be positive' });
  }

  if (orderType === 'limit' && (limitPrice === undefined || limitPrice <= 0)) {
    return res.status(400).json({ message: 'Limit price must be provided and positive for limit orders' });
  }
  if (orderType === 'stop_loss' && (stopPrice === undefined || stopPrice <= 0)) {
    return res.status(400).json({ message: 'Stop price must be provided and positive for stop loss orders' });
  }
  if (orderType === 'trailing_stop' && 
      ( (trailingAmount === undefined || trailingAmount <= 0) && (trailingPercent === undefined || trailingPercent <=0) )
     ) {
    return res.status(400).json({ message: 'Trailing amount or trailing percent must be provided and positive for trailing stop orders' });
  }

  const newOrder = new Order({
    userId,
    stockSymbol,
    quantity,
    price,
    orderType,
    limitPrice: orderType === 'limit' ? limitPrice : undefined,
    stopPrice: orderType === 'stop_loss' ? stopPrice : undefined,
    trailingAmount: orderType === 'trailing_stop' ? trailingAmount : undefined,
    trailingPercent: orderType === 'trailing_stop' ? trailingPercent : undefined,
    status: 'pending',
  });

  try {
    await newOrder.save();

    io.emit('orderStatusUpdate', {
      orderId: newOrder._id.toString(),
      status: newOrder.status,
      userId,
    });


    processPendingOrder(newOrder, io);

    res.json(newOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Order processing failed' });
  }
});

const updatePortfolio = async (userId, stockSymbol, quantity, orderType) => {
  const existingHolding = await Portfolio.findOne({ userId, stockSymbol });
  if (orderType === 'buy') {
    if (existingHolding) {
      existingHolding.quantity += quantity;
      await existingHolding.save();
    } else {
      const newHolding = new Portfolio({
        userId,
        stockSymbol,
        quantity,
        averagePrice: 0,
      });
      await newHolding.save();
    }
  } else if (orderType === 'sell') {
    if (existingHolding) {
      existingHolding.quantity -= quantity;
      if (existingHolding.quantity <= 0) {
        await Portfolio.deleteOne({ _id: existingHolding._id });
      } else {
        await existingHolding.save();
      }
    }
  }
};

router.delete('/:orderId', verifyToken, async (req, res) => {
  let orderId = req.params.orderId.trim();
  const userId = req.user.id;
  const io = req.app.locals.io;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    console.log('Invalid orderId format');
    return res.status(400).json({ message: 'Invalid order ID format' });
  }

  const order = await Order.findOne({ _id: orderId, userId });

  if (!order) {
    return res.status(404).json({ message: 'Order not found or unauthorized' });
  }

  if (order.status !== 'pending') {
    return res.status(400).json({ message: 'Only pending orders can be cancelled' });
  }

  order.status = 'cancelled';
  await order.save();

 
  io.emit('orderStatusUpdate', {
    orderId: order._id.toString(),
    status: order.status,
    userId,
  });

  res.json({ message: 'Order cancelled', order });
});

module.exports = router;
