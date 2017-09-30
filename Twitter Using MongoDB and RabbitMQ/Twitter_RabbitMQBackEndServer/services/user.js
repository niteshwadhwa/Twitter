//var mysql = require("./mysql.js");
var crypto = require('crypto');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

function userSignIn(msg, callback){
	
	console.log("In userSignIn");
	
	var encryptPassword = crypto.createHash("md5").update(msg.password).digest('hex');
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_details');

		coll.findOne({email: msg.email, password:encryptPassword}, function(err, user){
			mongo.disconnect();
			if(user){
				var result={"status":"200","email":user.email,"twitterHandle":user.twitterHandle,"name":user.firstName+" "+user.lastName};
			}else{
				var result={"status":"400"};
			}
			callback(result);
		});
	});
}

function userSignUp(msg, callback){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_details');
		
		coll.insert({"firstName": msg.firstName, "lastName":msg.lastName, "email": msg.email, "password":msg.password,"contact": msg.contact, "twitterHandle":msg.twitterHandle,country:"",state:"",city:"",birthDate:"","follower_list":[],"following_list":[]}, function(err, user){
			
			if(user){
				var result={"status":"200","email":msg.email,"twitterHandle":msg.twitterHandle,"name":msg.firstName+" "+msg.lastName};
			}else{
				var result={"status":"400"};
			}
			callback(result);
		});
		
	});
}

function handle_request(msg, callback){
	
	if(msg.methodName == "userSignIn"){
		userSignIn(msg,function(result){
			callback(null,result);
		});
	}else if(msg.methodName == "userSignUp"){
		userSignUp(msg,function(result){
			callback(null,result);
		});
	}
	
}


exports.userSignIn=userSignIn;
exports.userSignUp=userSignUp;
exports.handle_request = handle_request;