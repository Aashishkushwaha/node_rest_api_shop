const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: 
  {
    type: mongoose.Schema.Types.ObjectId,
    // ref means we will store the reference of other record
    // used to config type
    // this will hold the name of the model we want to map
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    // if not passed then it will take default
    default: 1
  }
});

module.exports = mongoose.model('Order', orderSchema);