var mysql = require("./mysql.js");
var crypto = require('crypto');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";
var mq_client = require('../rpc/client');

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

function userSignIn(req, res){
	console.log("in userSignIn client");
	var data = {"email":req.body.email,"password":req.body.password,"methodName":"userSignIn"};
	mq_client.make_request('login_queue',data, function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			req.session.data={"email":results.email,"twitterHandle":results.twitterHandle,"name":results.name};
			console.log(req.session.data);
			res.send({"status":results.status});
		}  
	});
}

function userSignUp(req, res){
	
	var encryptPassword = crypto.createHash("md5").update(req.body.userDetails.password).digest('hex');
	var twitterHandle = "@"+(req.body.userDetails.email).substring(0,(req.body.userDetails.email).indexOf("@"));
	
	var data = {"firstName": req.body.userDetails.firstName, "lastName":req.body.userDetails.lastName, "email": req.body.userDetails.email, "password":encryptPassword,"contact": req.body.userDetails.phone, "twitterHandle":twitterHandle,country:"",state:"",city:"",birthDate:"","follower_list":[],"following_List":[],"methodName":"userSignUp"};
	
	mq_client.make_request('login_queue',data, function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{	
			req.session.data={"email":results.email,"twitterHandle":results.twitterHandle,"name":results.name};
			console.log(req.session.data);
			res.send(results);
		}  
	});
	
}


exports.userSignIn=userSignIn;
exports.userSignUp=userSignUp;