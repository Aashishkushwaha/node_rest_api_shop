const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
// this will tell store all the files into the uploads folder
//const upload = multer({dest: 'uploads/'});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,'./uploads');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
})

const fileFilter = function(req, file, cb){
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    // accept file
    cb(null, true);
  }
  else{
    // reject file
    cb(null, false);
  }
}

// new way to config multer that suggests multer how to store files
const upload = multer(
  {
    storage: storage, 
    limits: {
      // filesize can be in bytes . here we can store a file of max. 5MB
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

const Product = require("../models/product");

router.get('/', (req, res, next) => {
  // res.status(200).json({
  //   message: 'Handling the GET request to /products'
  // });

  // select is used to specify which data to be retrived 
  // from the database eg. in this case we only want id, name & price
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      // if(docs.length > 0 )
        res.status(200).json(response);
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

router.post('/', upload.single('productImage') ,(req,res,next) => {
  console.log(req.file);
  const product = new Product({
    // it will generate a new unique id each time we call
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "Created product Successfully",
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + result._id
        }
      }
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
  .select('name price id productImage')
  .exec()
  .then(doc => {
    console.log("from database",doc);
    if(doc)
    {
      let response = {
        name: doc.name,
        price: doc.price,
        productImage: doc.productImage,
        _id: doc._id,
        request: {
          desc: "To get list of all products",
          type: 'GET',
          url: 'http://localhost:3000/products'
        }
      }
      res.status(200).json(response);
    }
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
  console.log(updateOps);
  Product.update({_id: id}, { $set: updateOps })
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: "Product updated",
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products/' + id
      }
    });
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
    res.status(200).json({
      message: "Product deleted",
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: { name: 'String', price: 'Number'}
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

module.exports = router;