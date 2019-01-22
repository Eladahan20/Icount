// business.route.js

const express = require('express');
const app = express();
const productsRoutes = express.Router();
const fs = require('fs');
const path = require('path');
var multer = require('multer');
var xlsxj = require("xlsx-to-json");
var xlsj = require("xls-to-json");
var exceljs = require("exceljs");
var xlsParser = require('xls-parser')

var DIR = './uploads/';
var upload = multer({
  dest: DIR
}).single('products-icount');


let Products = require('../models/product');

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
      comapareDB(result);
      res.send(result);
      // Compare it to db, and add a stamp in case of a change
    });

  });
});

productsRoutes.route('/').get(function (req, res) {
  Products.find(function (err, products) {
    if (err) {
      console.log(err);
    } else {
      res.json(products);
    }
  });
});



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

    array[i]['SKU'] = array[i]['מק"ט'];
    delete(array[i]['מק"ט']);

    array[i]['product_name'] = array[i]['שם המוצר'];
    delete(array[i]['שם המוצר']);

    array[i]['product_cost'] = array[i]['עלות לפני מע"מ'];
    delete(array[i]['עלות לפני מע"מ']);

    array[i]['product_price'] = array[i]['מחיר ללקוח לפני מע"מ'];
    delete(array[i]['מחיר ללקוח לפני מע"מ']);

    array[i]['product_quantity'] = array[i]['כמות במלאי'];
    delete(array[i]['כמות במלאי']);

    array[i]['warehouse'] = array[i]['Warehouse ID'];
    delete(array[i]['Warehouse ID']);
  }
  return array;
}

// const bulkOperations = results.map(product => {
//   const stamps = { [(new Date()).getTime()] : changeInQuantity };
//   return {
//       'updateOne': {
//           'filter': { 'product_name': product.product_name },
//           'update': { 
//               '$inc': { 'product_quantity': changeInQuantity },
//               '$push': { stamps }
//           }
//       }
//   };
// });
// function comapareDB(result) {
//   for (let i = 0; i < result.length; i++) {
//     var date = Date.now();
    
//     Products.findOneAndUpdate(
//       {"product_name": result[i]['product_name']},
//       { $inc: {product_quantity: - result[i]['product_name']}},
//       { $push: { stamps: {date : product_quantity - result[i]['product_name']} }}
//     ).exec();
//   }
// }
module.exports = productsRoutes;


// function excelToJson(filepath) {
//    xlsj({
//         input: filepath, 
//         output: "output.json"
//       }, function(err, result) {
//         if(err) {
//           return err;
//         }else {
//          console.log(result);
//          return result;
//         }
//     });


// // // Defined store route
// businessRoutes.route('/add').post(function (req, res) {
//   let business = new Business(req.body);
//   business.save()
//     .then(business => {
//       res.status(200).json({'business': 'business in added successfully'});
//     })
//     .catch(err => {
//     res.status(400).send("unable to save to database");
//     });
// });


// // Defined edit route
// businessRoutes.route('/edit/:id').get(function (req, res) {
//   let id = req.params.id;
//   Business.findById(id, function (err, business){
//       res.json(business);
//   });
// });

// //  Defined update route
// businessRoutes.route('/update/:id').post(function (req, res) {
//     Business.findById(req.params.id, function(err, next, business) {
//     if (!business)
//       return next(new Error('Could not load Document'));
//     else {
//         business.person_name = req.body.person_name;
//         business.business_name = req.body.business_name;
//         business.business_gst_number = req.body.business_gst_number;

//         business.save().then(business => {
//           res.json('Update complete');
//       })
//       .catch(err => {
//             res.status(400).send("unable to update the database");
//       });
//     }
//   });
// });

// // Defined delete | remove | destroy route
// businessRoutes.route('/delete/:id').get(function (req, res) {
//     Business.findByIdAndRemove({_id: req.params.id}, function(err, business){
//         if(err) res.json(err);
//         else res.json('Successfully removed');
//     });
// });
