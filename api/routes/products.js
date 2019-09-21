const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require("../models/product");

router.get('/', (req, res, next) => {
  // res.status(200).json({
  //   message: 'Handling the GET request to /products'
  // });

  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      // if(docs.length > 0 )
        res.status(200).json(docs);
      // else
      //   res.status(404).json({
      //     message: "No enteries found"
      //   })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    })
});

// we can use below syntax to chain requests as well like
/*
router.get('/',(req, res) => {
  console.log('get req');
})
.post('/',(req, res) => {
  console.log('post request');
})
*/

router.post('/', (req,res,next) => {
  const product = new Product({
    // it will generate a new unique id each time we call
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "handling the POST request to /products",
      createdProduct: result
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

router.get('/:productId',(req, res, next)=> {
  const id = req.params.productId;
  console.log("requested : " + id);
  Product.findById(id)
  .exec()
  .then(doc => {
    console.log("from database",doc);
    if(doc)
      res.status(200).json(doc);
    else{
      res.status(404).json({
        message: "Couldn't find the specified product"
      });
    }
  })
  .catch(err => { 
    console.log(err)
    res.status(500).json({error: err});
  });
});

router.patch('/:productId',(req, res, next)=> {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value
  }
  // second arg. to update method is the object which will
  // hold the changes
  Product.update({_id: id}, { $set: updateOps })
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json(result);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error});
  })
});

router.delete('/:productId',(req, res, next)=> {
  const id = req.params.productId;
  Product.remove({_id: id})
  .exec()
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  })
});

module.exports = router;