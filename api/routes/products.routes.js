const express = require('express');
const app = express();
const productsRoutes = express.Router();
const fs = require('fs');
const path = require('path');
var xlsj = require("xls-to-json");

// File Upload System
var multer = require('multer');
var DIR = './uploads/';
var upload = multer({
  dest: DIR
}).single('products-icount');


let Products = require('../models/product');
let databaseProducts = [];



// 1. GET - collects all records from DB and send it as json.
productsRoutes.route('/').get(function (req, res) {
  Products.find(function (err, products) {
    if (err) {
      console.log(err);
    } else {
      databaseProducts = products;
      res.json(products);
    }
  });
});

//2. POST - collects a file uploaded, modify it, convert it to JSON and send it to the modification function.
productsRoutes.route('/').post(function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(422).send("an Error occured")
    }

    xlsj({
      input: req.file.path,
      output: "output.json",
      sheet: "Inventory"
    }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        result = modifyJson(result)
      }
      res.json(modifyDatabase(result));
    });

  });
});

function findInArray(array, SKU) {
  let temp = array.filter(function(elem) {
    return elem['SKU'] === SKU;
  });
  return temp[0];
}

function modifyDatabase(newInventoryCount) {
  let bulkOperations = [];
  for (let i = 0; i < databaseProducts.length; i++) {
    var temp = findInArray(newInventoryCount, databaseProducts[i]['SKU']);
    if (temp['Quantity'] != databaseProducts[i]["Quantity"]) {
      const thisProduct = databaseProducts[i]['SKU'];
      const changeInQuantity = temp['Quantity'] - databaseProducts[i]['Quantity'];
      const stamps = {
        [(new Date()).getTime()]: changeInQuantity
      }
      bulkOperations.push({
        'updateOne': {
          'filter': {
            'SKU': thisProduct
          },
          'update': {
            '$inc': {
              'Quantity': changeInQuantity
            },
            '$push': {
              'Stamps' :  stamps 
            }
          }
        }


      });
    }
  }

  const bulkResult = Products.bulkWrite(bulkOperations)

  return bulkResult;
}




function modifyJson(array) {
  for (let i = 0; i < array.length; i++) {
    delete(array[i]['Includes VAT']);
    delete(array[i]['is_deleted']);
    delete(array[i]['Condition ID']);
    delete(array[i]['Type ID']);
    delete(array[i]['Manufacturer ID']);
    delete(array[i]['Measurement Unit ID']);
    delete(array[i]['Search']);
    delete(array[i]['Serials']);
    delete(array[i]['עלות לפני מע"מ - מטבע']);
    delete(array[i]['מספר מוטבע']);
    delete(array[i]['מינימום מותר']);
    delete(array[i]['מחיר ללקוח לפני מע"מ - מטבע']);
    delete(array[i]['עלות לפני מע"מ']);
    delete(array[i]['מחיר ללקוח לפני מע"מ']);
    delete(array[i]['Warehouse ID']);

    array[i]['SKU'] = array[i]['מק"ט'];
    delete(array[i]['מק"ט']);

    array[i]['Name'] = array[i]['שם המוצר'];
    delete(array[i]['שם המוצר']);

    array[i]['Quantity'] = array[i]['כמות במלאי'];
    delete(array[i]['כמות במלאי']);
  }
  return array;
}


module.exports = productsRoutes;
