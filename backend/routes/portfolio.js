const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { verifyToken } = require('../middleware/auth');

router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const holdings = await Portfolio.find({ userId });

    const detailedHoldings = holdings.map(h => {
      const currentPrice = 100; 
      return {
        stockSymbol: h.stockSymbol,
        quantity: h.quantity,
        averagePrice: h.averagePrice,
        currentPrice,
        currentValue: h.quantity * currentPrice,
      };
    });

    const totalValue = detailedHoldings.reduce((acc, h) => acc + h.currentValue, 0);

    
    res.json({
      holdings: detailedHoldings,
      totalValue,
      history: [], 
    });
  } catch (err) {
    console.error('Portfolio analytics fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch portfolio analytics' });
  }
});

module.exports = router;
