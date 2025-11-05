const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  stockSymbol: { type: String, required: true },
  orderType: {
    type: String,
    enum: ['buy', 'sell', 'limit', 'stop_loss', 'trailing_stop'],
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },         
  limitPrice: { type: Number },                    
  stopPrice: { type: Number },                      
  trailingAmount: { type: Number },                 
  trailingPercent: { type: Number },                
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending',
  },
  executedPrice: { type: Number },                  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

