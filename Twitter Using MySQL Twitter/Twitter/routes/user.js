var mysql = require("./mysql.js");
var crypto = require('crypto');

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

function userSignIn(req, res){
	
	console.log(req.body.password);
	var encryptPassword = crypto.createHash("md5").update(req.body.userDetails.password).digest('hex');
	
	var sqlquery="select * from user_details where email=";
	sqlquery+= "'"+req.body.userDetails.email+"'";
	sqlquery+= " and password=";
	sqlquery+= "'"+encryptPassword+"'";
	sqlquery+= ";";
	
	console.log(sqlquery);
	
	mysql.fetchData(sqlquery,function(err,rows){
		if(err){
			var result={"status":"400"};
			res.send(result);
		}else{
			if(rows.length === 1){
				req.session.data={"email":rows[0].email,"twitterHandle":rows[0].twitterHandle,"name":rows[0].firstName+" "+rows[0].lastName};
				var result={"status":"200"};
				res.send(result);
			}else{
				var result={"status":"400"};
				res.send(result);
			}
		}
	});
}

function userSignUp(req, res){
	
	var encryptPassword = crypto.createHash("md5").update(req.body.userDetails.password).digest('hex');
	var twitterHandle = "@"+(req.body.userDetails.email).substring(0,(req.body.userDetails.email).indexOf("@"));
	
	var sqlquery="insert into user_details(firstName,lastName,email,password,contact,twitterHandle) values(";
	sqlquery+= "'"+req.body.userDetails.firstName+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.userDetails.lastName+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.userDetails.email+"'";
	sqlquery+= ",";
	sqlquery+= "'"+encryptPassword+"'";
	sqlquery+= ",";
	sqlquery+= "'"+req.body.userDetails.phone+"'";
	sqlquery+= ",";
	sqlquery+= "'"+twitterHandle+"'";
	sqlquery+= ");";
	
	console.log(sqlquery);
	
	mysql.fetchData(sqlquery,function(err,rows){
		if(err){
			console.log("return");
			var result={"status":"400"};
			res.send(result);
		}else{
			req.session.data={"email":req.body.userDetails.email,"twitterHandle":twitterHandle,"name":req.body.userDetails.firstName+" "+req.body.userDetails.lastName };
			var result={"status":"200"};
			res.send(result);
		}
		
	});
	
}


exports.userSignIn=userSignIn;
exports.userSignUp=userSignUp;