const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    http = require('http');
    mongoose = require('mongoose'),
    config = {
      DB: 'mongodb://eladdahan:sculpture77@ds213615.mlab.com:13615/maapilim'
    }
 

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

// Parsers


// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/Maapilim-Inventory')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors(corsOptions));

app.use('/products', productsRoute);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/Maapilim-Inventory/index.html'));
});

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
