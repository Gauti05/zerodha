const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));


const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const portfolioRoutes = require('./routes/portfolio');
const stockRoutes = require('./routes/stock');


app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stock', stockRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Zerodha Kite Clone Backend is running');
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});

const stocks = {
  AAPL: 150,
  MSFT: 300,
  GOOGL: 2800,
  TSLA: 700,
};


function simulatePriceUpdates() {
  setInterval(() => {
    const symbols = Object.keys(stocks);
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

   
    const changePercent = (Math.random() * 6 - 3) / 100;
    stocks[symbol] = +(stocks[symbol] * (1 + changePercent)).toFixed(2);

    io.emit('priceUpdate', {
      stockSymbol: symbol,
      currentPrice: stocks[symbol],
    });

    console.log(`Emitted price update: ${symbol} - $${stocks[symbol]}`);
  }, 5000); 
}


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.locals.io = io;

simulatePriceUpdates();


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
