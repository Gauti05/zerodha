const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/price/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
   
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'API key not configured' });
    }

    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: {
        symbol,
        token: apiKey,
      },
    });

    if (!response.data || typeof response.data.c !== 'number') {
      return res.status(404).json({ message: 'Price data not found for symbol' });
    }

    res.json({ currentPrice: response.data.c });
  } catch (error) {
    console.error('Error fetching stock price:', error);
    res.status(500).json({ message: 'Failed to fetch stock price' });
  }
});

module.exports = router;
