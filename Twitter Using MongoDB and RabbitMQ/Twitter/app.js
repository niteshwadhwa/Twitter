
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , home = require('./routes/home')
  , profile = require('./routes/profile')
  , http = require('http')
  , path = require('path')
  , mongo = require("./routes/mongo");

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/twitter";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);

var app = express();

app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/session', routes.session);
app.get('/sessionEnd', routes.sessionEnd);
app.get('/signUp', routes.signUp);
app.get('/signIn', routes.signIn);
app.post('/userSignIn', user.userSignIn);
app.post('/userSignUp', user.userSignUp);
app.get('/home', home.home);
app.get('/homeData', home.homeData);
app.post('/searchTweet',home.searchTweet);
app.post('/newTweet', home.newTweet);
app.get('/logout', home.logout);
app.get('/profile', profile.profile);
app.get('/profileData', profile.profileData);
app.get('/followingData', profile.followingData);
app.post('/unfollow', profile.unfollow);
app.get('/afterUnFollow', profile.afterUnFollow);
app.get('/followerData', profile.followerData);
app.post('/follow', profile.follow);
app.post('/reTweet',home.reTweet);
app.get('/afterFollow', profile.afterFollow);
app.get('/getDetails', profile.getDetails);
app.post('/updateDetails',profile.updateDetails);


//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});