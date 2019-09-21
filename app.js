const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


mongoose.connect('mongodb+srv://shop-api-admin:' + process.env.MONGO_ATLAS_PW + '@node-rest-api-shop-ykti9.mongodb.net/test?retryWrites=true&w=majority', 
{
  // it will use mongo DB client to connect to DB under the hood , which is the recomended way
  useMongoClient: true
}
);

// Using the morgan middleware
app.use(morgan('dev'));

// Using the morgan middleware
// we configure  body parser to handle which type of requests
// it should handle
// Note: we will parse urlencoded data 
// and we'll configute it by passing an object which has a single
// property i.e extended: true/false 
// we will set it to true if we want to parse rich data
// but here we'll parse only the simple normal data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS -> Cross-Origin Resource Sharing
// Handling CORS errors
app.use((req, res, next) => {
  // we pass * as second arg because we want to allow access to everyone
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Header', 
  'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if(req.method === "OPTIONS"){
    res.header('Access-Control-Allow-Methods', 
    'PUT, POST, PATCH DELETE, GET')
    return res.status(200).json({});
  }
  next();
});
// 1'type of middleware
// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It works!"
//   })
// //  next();
// });

// this is use to handle all the requests targeting '/products'
// It will simply tell if the url is targeting product resource then it must be 
// handled by the router the we pass below as a 2'nd arg.
// any url starts with /products will be forwarded to /products file
app.use('/products', productRoutes);

app.use('/orders', orderRoutes);


// Handling Errors
app.use((req,res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;