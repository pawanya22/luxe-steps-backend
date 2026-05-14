const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Product', productSchema);