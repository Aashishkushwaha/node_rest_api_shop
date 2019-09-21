const express = require('express');
const router = express.Router();


// handling incoming GET req to /orders
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling the GET req on /orders'
  });
})
.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  }
  res.status(201).json({
    message: "Handling the POST req on /orders",
    createdOrder: order
  })
});


router.get('/:orderId', (req, res, next) => {
const id = req.params.orderId;
  if(id === "special"){
    res.status(200).json({
      message: "You've discovered the special order",
      id
    });
  }
  else{
    res.status(200).json({
      message: "you've just orderd regular item"
    })
  }
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: "Your order has been deleted",
  });
});


module.exports = router;