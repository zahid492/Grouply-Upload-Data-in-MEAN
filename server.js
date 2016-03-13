// BASE SETUP
// =============================================================================

// import modules needed
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var cors=require('cors');
var http = require('http').Server(app);


// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port     = process.env.PORT || 8081; // set our port

//database connection
var mongoose = require('mongoose');
var dbconfig = require('./app/config/db');
mongoose.connect(dbconfig.options.uri); // connect to our database

app.use(express.static(__dirname + '/client-side/'))

app.get('/', function(req, res) {
      res.sendfile(__dirname +'/client-side/index.html')  
    });
// create our router
var router = express.Router();

require('./app/routes')(router,app,io);

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);






// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


http.listen(port, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Listening on port 8081");
    }
});


