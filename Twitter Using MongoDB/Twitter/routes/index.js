var mysql = require("./mysql.js");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

function signIn(req,res){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('signIn');
}

function signUp(req,res){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('signUp');
}

function session(req,res){
	if(req.session.data){
		console.log("Session Exists..");
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll1 = mongo.collection('user_details');
			
			coll1.findOne({email: req.session.data.email}, function(err, user){
				if(user){
					res.send({"status":"200","userDetails":user});
				}	
			});
		});
		
	}
	else{
		console.log("NO Session Exists..");
		var result={"status":"400"};
		res.send(result);
	}
}

function sessionEnd(req,res){
	if(req.session.data){
		console.log("Session Exists..Destroying Session");
		req.session.destroy();
		console.log("Session Destroyed");
	}

	console.log("NO Session Exists..");
	var result={"status":"400"};
	res.send(result);
	
}

exports.sessionEnd=sessionEnd;
exports.session=session;
exports.signUp=signUp;
exports.signIn=signIn;