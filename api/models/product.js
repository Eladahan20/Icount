// product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Product = new Schema({
  sku: {
    type: String
  },
  product_name: {
    type: String
  },
  product_cost: {
    type: String
  },
  product_price: {
      type: String
  },
  product_quantity: {
    type: String
},
  stamps :{
    type: Array
}
},{
    collection: 'Products'
});

module.exports = mongoose.model('Products', Product);
