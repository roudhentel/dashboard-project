let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let busboy = require('connect-busboy');
let fileUpload = require('express-fileupload');
let path = require('path');
let PORT = process.env.port || 8080;
let http = require('http').Server(app);

// for file upload and multi-part post
app.use(fileUpload());
app.use(busboy());

// configure app to use bodyParser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));

// log request
app.use(morgan('dev'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

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

// declare user route
let userRoute = require('./server/routes/user');
app.use('/api/user', userRoute);

let widgetRoute = require('./server/routes/widget');
app.use('/api/widget', widgetRoute);

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// start with index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/");
});

// start app
http.listen(PORT, function () {
    console.log('Listening on ' + PORT);
});