//设置环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var errorhandler = require('errorhandler');
var fs = require('fs');
var config = require('./config');
var Redis = require('ioredis');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.database.uri, config.database.options);
var db = mongoose.connection;
db.once("open", function (cb) {
	console.log("connect success!")
});

//redis
new Redis(config.redis);

// require mongodb models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
	if (/(.*)\.(js$)/.test(file)) {
		require(modelsPath + '/' + file);
	}
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.enable('trust proxy');
app.use(cors());

//Logging request
if (process.env.NODE_ENV === 'production') {
	//write to file
	var logPath = path.join(__dirname, '/logFile');
	fs.existsSync(logPath) || fs.mkdirSync(logPath);
	var logStream = FileStreamRotator.getStream({
		date_format: 'YYYYMMDD',
		filename: path.join(logPath, 'request-%DATE%.log'),
		frequency: 'daily',
		verbose: false
	});
	app.use(morgan('tiny', {stream: logStream}))
} else {
	app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
var sessionOption = {
	secret: config.session.secret,
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 24 * 60 * 60 * 1000},
	store: new RedisStore(config.session.store)
};
app.use(session(sessionOption));

app.use(passport.initialize());
//optional
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public/client/dest')));

require('./routes/router')(app);

// error handlers
if (process.env.NODE_ENV === 'development') {
	// only use in development
	app.use(errorhandler());
} else {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
}

// Start server
app.listen(config.port, function () {
	console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
	console.log('http://localhost:%d/index.html', config.port);
});

module.exports = app;
