const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB');
 

const productsRoute = require('./routes/products.routes');
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/products', productsRoute);


const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});