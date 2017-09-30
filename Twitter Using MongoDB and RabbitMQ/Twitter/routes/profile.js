var mysql = require("./mysql.js");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";
var mq_client = require('../rpc/client');

function profile(req, res){
  res.render('profile');
};

function profileData(req,res){
	
	if(req.session.data){
		
		var data = {email: req.session.data.email,"methodName":"profileData"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("going in profileData");
				res.redirect('/homeData');
			}  
		});
		
//		var tweets = [];
//		var userDetails, followerCount, followingCount, tweetsCount ;
//		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({email: req.session.data.email},{firstName:1,lastName:2,twitterHandle:3,follower_list:4,following_list:5}, function(err, user){
//				if(user){
//					userDetails = {"firstName":user.firstName,"lastName":user.lastName,"twitterHandle":user.twitterHandle};
//					followerCount = user.follower_list.length;
//					followingCount = user.following_list.length;
//					
//					var coll2 = mongo.collection('tweets');
//					coll2.find({"email": req.session.data.email}).toArray(function(err, tweets) {
//						 if(err){
//							var result={"status":"400"};
//							res.send(result);
//						 }else{
//							 tweetsCount = tweets.length;
//							 res.send({"status":"200","userDetails":userDetails,"followingCount":followingCount,"followerCount":followerCount,"tweetsCount":tweetsCount,"tweetArray":tweets});
//						}
//					});
//				}else{
//					var result={"status":"400"};
//					res.send(result);
//				}
//			});
//		});
	}
	else{
		console.log("nitesh");
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

function followingData(req,res){
	
	if(req.session.data){
		
		console.log("get following Data");
		console.log(req.session.data.email);
		
		var data = {email: req.session.data.email,"methodName":"followingData"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("going in profileData");
				res.send(results);
			}  
		});
		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({email: req.session.data.email},{following_list:1}, function(err, user){
//				if(user){
//					console.log(user.following_list.length);
//					res.send({"status":"200","followingArray":user.following_list});
//				}else{
//					var result={"status":"400","message":"Something Went wrong "};
//					res.send(result);
//				}	
//			});
//		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function unfollow(req,res){

	if(req.session.data){
		
		var data = {email: req.session.data.email,unfollowEmail: req.body.unfollowEmail,"methodName":"unfollow"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("going in profileData");
				if(results.status == "200"){
					res.redirect('/afterUnFollow');
				}else{
					res.send(results)
				}
			}  
		});
		
		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({email: req.session.data.email,following_list:{$elemMatch:{following:req.body.unfollowEmail}},"methodName":"followingData"}, {following_list:1}, function(err, user){
//				if(user){
//					console.log(user.following_list.length);
//					coll1.update({email: req.session.data.email}, {$pull: {following_list: {following: req.body.unfollowEmail}}}, function(err, user){
//						if(err){
//							var result={"status":"400","message":"Something Went wrong 2"};
//							res.send(result);
//						}else{
//							res.redirect("/afterUnFollow");
//						}	
//					});
//				}else{
//					var result={"status":"400","message":"Something Went wrong 1"};
//					res.send(result);
//				}	
//			});
//		});
//		
		
//		
//		
//		var sqlquery1="select * from following_list where email=";
//		sqlquery1+= "'"+req.session.data.email+"'";
//		sqlquery1+= " and following=";
//		sqlquery1+= "'"+req.body.unfollowEmail+"'";
//		sqlquery1+= ";";
//		
//		var sqlquery2="delete from following_list where email=";
//		sqlquery2+= "'"+req.session.data.email+"'";
//		sqlquery2+= " and following=";
//		sqlquery2+= "'"+req.body.unfollowEmail+"'";
//		sqlquery2+= ";";
//		
//		console.log(sqlquery1);
//		console.log(sqlquery2);
//		
//		mysql.fetchData(sqlquery1,function(err,rows){
//			if(err){
//				console.log("return");
//				var result={"status":"400","message":"Something Went wrong 1"};
//				res.send(result);
//			}else{
//				if(rows.length == 1){
//					mysql.fetchData(sqlquery2,function(err,rows){
//						if(err){
//							console.log("return");
//							var result={"status":"400","message":"Something Went wrong 2"};
//							res.send(result);
//						}else{
//							res.redirect("/afterUnFollow");
//						}
//					});
//				}else{
//					var result={"status":"400","message":"Something Went wrong"};
//					res.send(result);
//				}
//			}
//		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function afterUnFollow(req,res){
	
	if(req.session.data){
		
		var data = {email: req.session.data.email,"methodName":"afterUnFollow"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("going in profileData");
				res.send(results)
			}  
		});
		
		
//		var followingCount;
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({email: req.session.data.email},{following_list:1}, function(err, user){
//				if(user){
//					console.log(user.following_list.length);
//					followingCount = user.following_list.length;
//					res.send({"status":"200","followingArray":user.following_list,"followingCount":followingCount})
//				}else{
//					var result={"status":"400","message":"Something Went wrong "};
//					res.send(result);
//				}	
//			});
//		});
		
	}else{
		console.log("nitesh");
		res.send({"status":"400","message":"Please reload the page and try again"});
	}


	
}

function followerData(req,res){

	if(req.session.data){
		
		var data = {email: req.session.data.email,"methodName":"followerData"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("going in profileData");
				res.send(results);
			}  
		});
		
//		var followerArray = [];
//		var followingArray = [];
//		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({email: req.session.data.email},{following_list:1,follower_list:2}, function(err, user){
//				if(user){
//					console.log("1");
//					console.log(user.following_list);
//					console.log(user.follower_list);
//					//var coll1 = mongo.collection('user_details');
//					coll1.find({email:req.session.data.email,follower_list:{$elemMatch:{follower:{$nin:user.follower_list,$nin:user.following_list}}}},{follower_list:1}).toArray(function(err, followerArray) {
//						 if(err){
//							var result={"status":"400"};
//							res.send(result);
//						 }else{
//							 
//							 if(followerArray.length > 0){
//								 console.log(followerArray[0].follower_list);
//								 followerArray = followerArray[0].follower_list;
//							 }
//							 coll1.find({email:req.session.data.email,follower_list:{$elemMatch:{follower:{$in:user.follower_list,$in:user.following_list}}}},{follower_list:1}).toArray(function(err, followingArray) {
//								 if(err){
//									var result={"status":"400"};
//									res.send(result);
//								 }else{
//									 if(followingArray.length > 0){
//										 console.log(followingArray[0].following_list);
//										 followingArray = followingArray.following_list;
//									 }
//									 res.send({"status":"200","followerArrayShowButton":followerArray,"followerArrayHideButton":followingArray});
//								 }
//							 });  
//						 }
//					});  
//					
					
//				}else{
//					res.send({"status":"400","message":"Please reload the page and try again"});
//				}	
//			});
//		});
//		
//		
//		
//		
//		
//		
//		
//		
//		// user not following 
//		
//		var sqlquery1="select follower,followerTwitterHandle,name from follower_list where email=";
//		sqlquery1+= "'"+req.session.data.email+"'";
//		sqlquery1+= " and follower not in (select following from following_list where email=";
//		sqlquery1+= "'"+req.session.data.email+"'";
//		sqlquery1+= "and following in (select follower from follower_list where email ="
//		sqlquery1+= "'"+req.session.data.email+"'";
//		sqlquery1+= "));";
//		
	//	{follower_list:{$elemMatch:{"follower":req.session.data.email,"follower":{$nin:{user.following_list.following},$nin:{user.follower_list.follower}}}}}}
		
		
		
//		// user following
//		
//		var sqlquery2="select follower,followerTwitterHandle,name from follower_list where email=";
//		sqlquery2+= "'"+req.session.data.email+"'";
//		sqlquery2+= " and follower in (select following from following_list where email=";
//		sqlquery2+= "'"+req.session.data.email+"'";
//		sqlquery2+= "and following in (select follower from follower_list where email ="
//		sqlquery2+= "'"+req.session.data.email+"'";
//		sqlquery2+= "));";
//		
//		console.log(sqlquery1);
//		
//		mysql.fetchData(sqlquery1,function(err,rows){
//			if(err){
//				console.log("return");
//				var result={"status":"400","message":"Something Went wrong 1"};
//				res.send(result);
//			}else{
//				followerArrayShowButton = rows;
//				mysql.fetchData(sqlquery2,function(err,rows1){
//					if(err){
//						console.log("return");
//						var result={"status":"400","message":"Something Went wrong 1"};
//						res.send(result);
//					}else{
//						var followerArrayHideButton = rows1;
//						res.send({"status":"200","followerArrayShowButton":followerArrayShowButton,"followerArrayHideButton":followerArrayHideButton});
//					}
//				});
//			}
//		});	
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function follow(req,res){

	if(req.session.data){
		
		var data = {email: req.session.data.email,followEmail:req.body.followEmail,"methodName":"follow"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.status == 200){
					res.redirect("/afterFollow");
				}else{
					res.send(results);
				}
			}  
		});
		
		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({"email": req.body.followEmail},function(err, user){
//				if(user){
//					
//					console.log(user.firstName+"	"+user.lastName+"	"+user.twitterHandle);
//					coll1.update({email: req.session.data.email},{$push: {following_list: {following:req.body.followEmail,name:user.firstName+" "+user.lastName,followingTwitterHandle:user.twitterHandle}}},function(err, success){
//						if(success){
//							res.redirect("/afterFollow");
//						}else{
//							var result={"status":"400","message":"Something Went wrong 2"};
//							res.send(result);
//						}	
//					});	
//					
//				}else{
//					var result={"status":"400","message":"Something Went wrong "};
//					res.send(result);
//				}	
//			});
//		});
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function afterFollow(req,res){

	if(req.session.data){
		
		
		var data = {email: req.session.data.email,"methodName":"afterFollow"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("going in profileData");
				res.send(results);
			}  
		});
		
		
//		var followerArray = [];
//		var followingArray = [];
//		var followingCount = 0;
//		mongo.connect(mongoURL, function(){
//			
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({email: req.session.data.email},{following_list:1,follower_list:2}, function(err, user){
//				if(user){
//					console.log("1");
//					console.log(user.following_list);
//					console.log(user.follower_list);
//					followingCount = user.following_list.length;
//					coll1.find({email:req.session.data.email,follower_list:{$elemMatch:{follower:{$nin:user.follower_list,$nin:user.following_list}}}},{follower_list:1}).toArray(function(err, followerArray) {
//						 if(err){
//							var result={"status":"400"};
//							res.send(result);
//						 }else{
//							 
//							 if(followerArray.length > 0){
//								 console.log(followerArray[0].follower_list);
//								 followerArray = followerArray[0].follower_list;
//							 }
//							 coll1.find({email:req.session.data.email,follower_list:{$elemMatch:{follower:{$in:user.follower_list,$in:user.following_list}}}},{follower_list:1}).toArray(function(err, followingArray) {
//								 if(err){
//									var result={"status":"400"};
//									res.send(result);
//								 }else{
//									 if(followingArray.length > 0){
//										 console.log(followingArray[0].following_list);
//										 followingArray = followingArray.following_list;
//									 }
//									 res.send({"status":"200","followerArrayShowButton":followerArray,"followerArrayHideButton":followingArray,"followingCount":followingCount});
//								 }
//							 });  
//						 }
//					});  
//					
//					
//				}else{
//					res.send({"status":"400","message":"Please reload the page and try again"});
//				}	
//			});
//		});
		
//		var followerArrayShowButton = [];
//		var followerArrayHideButton = [];
//		var followingCount;
//		
//		// user not following 
//		
//		var sqlquery1="select follower,followerTwitterHandle,name from follower_list where email=";
//		sqlquery1+= "'"+req.session.data.email+"'";
//		sqlquery1+= " and follower not in (select following from following_list where email=";
//		sqlquery1+= "'"+req.session.data.email+"'";
//		sqlquery1+= "and following in (select follower from follower_list where email ="
//		sqlquery1+= "'"+req.session.data.email+"'";
//		sqlquery1+= "));";
//
//		// user following
//		
//		var sqlquery2="select follower,followerTwitterHandle,name from follower_list where email=";
//		sqlquery2+= "'"+req.session.data.email+"'";
//		sqlquery2+= " and follower in (select following from following_list where email=";
//		sqlquery2+= "'"+req.session.data.email+"'";
//		sqlquery2+= "and following in (select follower from follower_list where email ="
//		sqlquery2+= "'"+req.session.data.email+"'";
//		sqlquery2+= "));";
//		
//		
//		var sqlquery3="select count(*) from following_list where email=";
//		sqlquery3+= "'"+req.session.data.email+"'";
//		sqlquery3+= ";";
//		
//		console.log(sqlquery1);
//		
//		mysql.fetchData(sqlquery1,function(err,rows){
//			if(err){
//				console.log("return");
//				var result={"status":"400","message":"Something Went wrong 1"};
//				res.send(result);
//			}else{
//				followerArrayShowButton = rows;
//				mysql.fetchData(sqlquery2,function(err,rows1){
//					if(err){
//						console.log("return");
//						var result={"status":"400","message":"Something Went wrong 1"};
//						res.send(result);
//					}else{
//						var followerArrayHideButton = rows1;
//						mysql.fetchData(sqlquery3,function(err,rows){
//							if(err){
//								console.log("return");
//								var result={"status":"400","message":"Something Went wrong 1"};
//								res.send(result);
//							}else{
//								followingCount = rows[0]["count(*)"];
//								res.send({"status":"200","followerArrayShowButton":followerArrayShowButton,"followerArrayHideButton":followerArrayHideButton,"followingCount":followingCount});
//							}
//						});
//					}
//				});
//			}
//		});	
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function getDetails(req,res){
	
	if(req.session.data){
		
		var data = {email: req.session.data.email,"methodName":"getDetails"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				res.send(results);
			}  
		});
		
		
		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.findOne({email: req.session.data.email},{firstName:1,lastName:2,email:3,country:4,state:5,city:6,birthDate:7,twitterHandle:8,contact:9}, function(err, user){
//				if(user){
//					res.send({"status":"200","userDetails":user});
//				}else{
//					var result={"status":"400","message":"Something Went wrong 1"};
//					res.send(result);
//				}	
//			});
//		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function updateDetails(req,res){
	
	if(req.session.data){
		
		var data = {email: req.session.data.email,country:req.body.country,state:req.body.state,city:req.body.city,birthDate:req.body.birthDate,twitterHandle:req.body.twitterHandle,"methodName":"updateDetails"};
		mq_client.make_request('profile_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("going in profileData");
				if(results.status == "200"){
					res.redirect("/getDetails");
				}else{
					res.send(results)
				}
			}  
		});
		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll1 = mongo.collection('user_details');
//			
//			coll1.update({email: req.session.data.email},{ $set: {country:req.body.country,state:req.body.state,city:req.body.city,birthDate:req.body.birthDate,twitterHandle:req.body.twitterHandle}}, function(err, user){
//				if(user){
//					res.redirect("/getDetails");
//				}else{
//					var result={"status":"400","message":"Something Went wrong 1"};
//					res.send(result);
//				}	
//			});
//		});
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

	
}


exports.afterFollow=afterFollow;
exports.follow=follow;
exports.followerData=followerData;
exports.afterUnFollow=afterUnFollow;
exports.unfollow=unfollow;
exports.followingData=followingData;
exports.profileData=profileData;
exports.profile=profile;
exports.getDetails=getDetails;
exports.updateDetails=updateDetails;