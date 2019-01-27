// product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Product = new Schema({
  SKU: {
    type: String
  },
  Name: {
    type: String
  },
  Quantity: {
    type: Number
},
  Stamps :{
    type: Array
}
},{
    collection: 'Products'
});

module.exports = mongoose.model('Products', Product);
