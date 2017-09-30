var mysql = require("./mysql.js");
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
		var sqlquery="select * from user_details where email=";
		sqlquery+= "'"+req.session.data.email+"'";
		sqlquery+= ";";
		
		mysql.fetchData(sqlquery,function(err,rows){
			var result={"status":"200","rows":rows};
			res.send(result);
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