var mysql = require("./mysql.js");
var crypto = require('crypto');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

function userSignIn(req, res){
	
	var encryptPassword = crypto.createHash("md5").update(req.body.userDetails.password).digest('hex');
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_details');

		coll.findOne({email: req.body.userDetails.email, password:encryptPassword}, function(err, user){
			if(user){
				console.log(user.follower_list.length);
				req.session.data={"email":user.email,"twitterHandle":user.twitterHandle,"name":user.firstName+" "+user.lastName};
				console.log(req.session.data);
				var result={"status":"200"};
				res.send(result);
			}else{
				var result={"status":"400"};
				res.send(result);
			}
		});
	});
}

function userSignUp(req, res){
	
	var encryptPassword = crypto.createHash("md5").update(req.body.userDetails.password).digest('hex');
	var twitterHandle = "@"+(req.body.userDetails.email).substring(0,(req.body.userDetails.email).indexOf("@"));
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_details');
		
		coll.insert({"firstName": req.body.userDetails.firstName, "lastName":req.body.userDetails.lastName, "email": req.body.userDetails.email, "password":encryptPassword,"contact": req.body.userDetails.phone, "twitterHandle":twitterHandle,country:"",state:"",city:"",birthDate:"","follower_list":[],"following_List":[]}, function(err, user){
			if(user){
				console.log("nitesh");
				req.session.data={"email":req.body.userDetails.email,"twitterHandle":req.body.userDetails.twitterHandle,"name":req.body.userDetails.firstName+" "+req.body.userDetails.lastName };
				console.log(req.session.data);
				var result={"status":"200"};
				res.send(result);
			}else{
				var result={"status":"400"};
				res.send(result);
			}
		});
		
	});
}


exports.userSignIn=userSignIn;
exports.userSignUp=userSignUp;