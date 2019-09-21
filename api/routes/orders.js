const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

// handling incoming GET req to /orders
router.get('/', (req, res, next) => {
  // exex() is chained to turn it into the promise
  Order.find()
  .select('quantity product _id')
  // populate is used to populate other properties 
  // i.e it will expand the info of the populated property
  // second arg to populated indicates which info you want to populate
  .populate('product', 'name')
  .exec()
  .then(docs => {
    // console.log(docs);
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          quantity: doc.quantity,
          product: doc.product,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`
          }
        }
      })
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  })
})
.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
  .then(product => {
    if(!product) {
      return res.status(404).json({
        message: "Product Not Found"
      })
    }
    const order = new Order({
      // mongoose.Types.ObjectId() - this will create a 
      //unique id each time we call it
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    return order
      .save()
  })
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "order stored",
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + result._id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  })
});

router.get('/:orderId', (req, res, next) => {
const id = req.params.orderId;
  Order.findById(id)
  .select('quantity product _id')
  .populate('product')
  .exec()
  .then(order => {
    if(!order){
      return res.status(404).json({
        message: "Order not Found"
      });
    }
    res.status(200).send({
      order,
      request: {
        desc: "To get list of all orders",
        type: "GET",
        url: "http://localhost:3000/orders"
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  })
});

router.delete('/:orderId', (req, res, next) => {
  Order.remove({_id: req.params.orderId})
  .exec()
  .then(result => {
    res.status(200).json({
      message: "Order deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/orders",
        body: { 
          productId: 'ID',
          quantity: 'Number'
        }
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
});


module.exports = router;