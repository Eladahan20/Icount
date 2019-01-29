// product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let last_update = new Schema({
  sku: {
    type: Number
  },
  last_update: {
    type: Number
  }
}, {
  collection: 'last_update'
});

module.exports = mongoose.model('last_update', last_update);
