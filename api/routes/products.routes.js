const express = require('express');
const app = express();
const productsRoutes = express.Router();
const fs = require('fs');
const path = require('path');
var xlsj = require("xls-to-json");

// File Upload System
var multer = require('multer');
var DIR = 'api/uploads/';
var upload = multer({
  dest: DIR
}).single('products-icount');


let Products = require('../models/product');
let last_update = require('../models/last_update');
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
productsRoutes.route('/last').get(function (req, res) {
  last_update.find(function (err, products) {
    if (err) {
      console.log(err);
    } else {
      res.json(products);
    }
  });

});
productsRoutes.route('/erase').get(function (req, res) {
  Products.updateMany({},
    { $pop: { Stamps : -1 }},
    function (err, products) {
    if (err) {
      console.log(err);
    } else {
      res.json(products);
    }
  });

});

productsRoutes.route('/:id').get(function (req, res) {
  let id = req.params.id;
  Products.findById(id, function (err, product){
    res.json(product);
});
});





//2. POST - collects a file uploaded, modify it, convert it to JSON and send it to the modification function.
productsRoutes.route('/').post(function (req, res, next) {
  removeAllFiles(DIR);
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
    if (databaseProducts[i]['SKU'] == '1') { continue; }
    var temp = findInArray(newInventoryCount, databaseProducts[i]['SKU']);
    if (temp['Quantity'] && (temp['Quantity'] != databaseProducts[i]["Quantity"])) {
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
  let bulkResults;
  if (bulkOperations.length> 0 ) {
    Products.bulkWrite(bulkOperations, function(err,result) {
      if (err) { console.log(err); }
      bulkResults = result;
    });
  }
  let time = new Date().getTime();
  last_update.findOneAndUpdate(
    {'sku': 1}, 
    {$set : {'last_update' : time}},
    {new: true },
    function(err,raw) {
    if (err) { console.log(err); }
    if (raw) {console.log(raw)};
  });
  
  // last_update.find(function(err,result) {
  //   console.log('do that');
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     last_date = result;
  //   }
  // });
  return bulkResults;
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

function removeAllFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}


module.exports = productsRoutes;
