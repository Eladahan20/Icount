// business.route.js

const express = require('express');
const app = express();
const productsRoutes = express.Router();
const fs = require('fs');
const path = require('path');
var multer = require('multer');
var xlsxj = require("xlsx-to-json");
var xlsj = require("xls-to-json");

// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('products-icount');
/* GET home page. */
// Requir

let Products = require('../models/product');

//our file upload function.
productsRoutes.route('/').post(function (req, res, next) {
    var _path = '';
    upload(req, res, function (err) {
       if (err) {
         // An error occurred when uploading
         console.log(err);
         return res.status(422).send("an Error occured")
       } else { 
         console.log(excelToJson(req.file.path));
          res.json(excelToJson(req.file.path));
      // Noret error occured.
      
    }
      //  const workSheetsFromFile = xlsx.json(path);
      //  console.log(workSheetsFromFile);
      //  return res.send("Upload Completed for "+path); 
 });
});
// Defined get data(index or listing) route
productsRoutes.route('/').get(function (req, res) {
    Products.find(function (err, products){
    if(err){
      console.log(err);
    }
    else {
      res.json(products);
    }
  });
});

function excelToJson(filepath) {
   xlsj({
        input: filepath, 
        output: "output.json"
      }, function(err, result) {
        if(err) {
          return err;
        }else {
         console.log(result);
         return result;
        }
    });

}
module.exports = productsRoutes;



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
