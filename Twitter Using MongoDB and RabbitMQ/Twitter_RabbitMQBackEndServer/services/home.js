//var mysql = require("./mysql.js");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";

function home(req,res){
	console.log(req.session.data);
	res.render("home",{"status":"200"});
}
function logout(req,res){
	res.render('logout',{"status":"200"});
}
function newTweet(msg,callback){
		
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('tweets');
		
		coll.insert({"email":msg.email , "tweet":msg.tweet ,"tweetId":msg.tweetId ,"twitterHandle":msg.twitterHandle,"dateTime":msg.dateTime,"name":msg.name}, function(err, user){
			if(user){
				var result={"status":"200"};
			}else{
				var result={"status":"400","message":"Something Went wrong"};
			}
			callback(result);
		});
		
	});
	
	
//	mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll = mongo.collection('tweets');
//			
//			coll.insert({"email":msg.email , "tweet":msg.tweet ,"tweetId":msg.tweetId ,"twitterHandle":msg.twitterHandle,"dateTime":msg.dateTime,"name":msg.name}, function(err, success){
//				if(success){
//					var result={"status":"200"};
//				}else{
//					var result={"status":"400","message":"Something Went wrong"};
//				}
//				callback(result);
//			});
//		
//		});
}

function reTweet(msg,callback){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('tweets');

		coll.findOne({"tweetId": msg.tweetId_Request}, function(err, success){
			if(success){
				coll.insert({"email": msg.email, "tweet":success.tweet,"tweetId":msg.tweetId ,"twitterHandle":msg.twitterHandle,"dateTime":msg.today,"name":msg.name}, function(err, success){
					if(success){
						var result={"status":"200","message":"ReTweeted Sucessfully !! Thank you"};
					}else{
						var result={"status":"400","message":"Something Went wrong"};
					}
					callback(result);
				});
				
			}else{
				var result={"status":"400","message":"Something Went wrong 1"};
				callback(result);
			}
		});
	});
	
	
	
	
//	if(req.session.data){
//		
//		var today = new Date();
//		var dd = today.getDate();
//		var mm = today.getMonth()+1; 
//		var yyyy = today.getFullYear();
//		var hh = today.getHours();
//		var mi = today.getMinutes();
//		var ss = today.getSeconds();
//		
//		if(dd < 10){
//			dd = '0'+dd;
//		}
//		if(mm < 10){
//			mm = '0'+mm;
//		}
//		if(hh < 10){
//			hh = '0'+hh;
//		}
//		if(mi < 10){
//			mi = '0'+mi;
//		}
//		if(ss < 10){
//			ss = '0'+ss;
//		}
//		today = yyyy+"-"+mm+"-"+dd+" "+hh+":"+mi+":"+ss;
//		var tweetId = Math.floor(Math.random()*10000000000);
//		
//		mongo.connect(mongoURL, function(){
//			console.log('Connected to mongo at: ' + mongoURL);
//			var coll = mongo.collection('tweets');
//
//			coll.findOne({"tweetId": req.body.retweetId}, function(err, success){
//				if(success){
//					coll.insert({"email": req.session.data.email, "tweet":success.tweet,"tweetId":tweetId ,"twitterHandle":req.session.data.twitterHandle,"dateTime":today,"name":req.session.data.name}, function(err, success){
//						if(success){
//							var result={"status":"200","message":"ReTweeted Sucessfully !! Thank you"};
//							res.redirect('/homeData');
//						}else{
//							var result={"status":"400","message":"Something Went wrong"};
//							res.send(result);
//						}
//					});
//					
//				}else{
//					var result={"status":"400","message":"Something Went wrong 1"};
//					res.send(result);
//				}
//			});
//		
//		});
//		
//	}else{
//		res.send({"status":"400","message":"Please reload the page and try again"});
//	}
}



function homeData(msg,callback){
	
		var tweets = [];
		var userDetails, followerCount, followingCount, tweetsCount ;
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll1 = mongo.collection('user_details');
			
			
			coll1.findOne({email: msg.email},{firstName:1,lastName:2,twitterHandle:3,follower_list:4,following_list:5}, function(err, user){
				if(user){
					userDetails = {"firstName":user.firstName,"lastName":user.lastName,"twitterHandle":user.twitterHandle};
					
					console.log(user.follower_list.length);
					console.log(user.following_list.length);
					
					followerCount = user.follower_list.length;
					followingCount = user.following_list.length;
					
					var coll2 = mongo.collection('tweets');
					coll2.find({"email": msg.email}).sort({"dateTime":1}).toArray(function(err, tweets) {
						 if(err){
							var result={"status":"400"};
							callback(result);
						 }else{
							 
							 console.log("Nitesh Wadhwa in 2");
							 
							 tweetsCount = tweets.length;
							 var coll3 = mongo.collection('tweets');
							 coll3.find({ $or:[{"email":{$in:((user.following_list.length > 0)? user.following_list.following :"" )},"email": msg.email}]}).sort({"dateTime":1}).toArray(function(err, tweetArray) {
								 if(err){
									var result={"status":"400"};
								 }else{
									 console.log("Nitesh Wadhwa in 3");
									 var result={"status":"200","userDetails":userDetails,"followingCount":followingCount,"followerCount":followerCount,"tweetsCount":tweetsCount,"tweetArray":tweetArray};
								 }
								 callback(result);
							}); 
						}
					});
				}else{
					var result={"status":"400"};
					callback(result);
				}
			});
		});
	
}


function searchTweet(msg,callback){
	
	
		if(msg.hashTag !== "" && (msg.hashTag).substring(1) === "#"){
			
			console.log("1");
			
			mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = mongo.collection('tweets');
				
				coll.find({"tweet":(msg.hashTag).substring(1,((msg.hashTag).length)-1)},{"tweetId":1,"tweet":2,"twitterHandle":3}).sort({"dateTime":-1}).toArray(function(err, tweetArray) {
					if(err){
						var result={"status":"400","message":"Something Went wrong"};
					}else{
						var result = {"status":"200","tweetArray":tweetArray};
					}
					callback(result);
				}); 
			});
			
		}else if(msg.hashTag != "" && (msg.hashTag).substring(1) != "#"){
			
			mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				
				var coll1 = mongo.collection('tweets');
				
				coll1.find({"tweet": new RegExp(msg.hashTag)}).sort({"dateTime":-1}).toArray(function(err, tweetArray) {
					if(err){
						var result={"status":"400"};
					}else{
						console.log(tweetArray[0]);
						var result={"status":"200","tweetArray":tweetArray};
					}
					callback(result);
				});  
				
			});		
			

		}else{
			
			console.log("3");
			
			mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				
				var coll1 = mongo.collection('user_details');
				var coll2 = mongo.collection('tweets');
				
				coll1.findOne({"email":msg.email},{following_list:1}, function(err, user){
					if(err){
						var result={"status":"400","message":"Something Went wrong"};
						callback(result);
					}else{
						 coll2.find({ $or:[{"email":{$in:user.following_list.following},"email": msg.email}]}).sort({"dateTime":-1}).toArray(function(err, tweetArray) {
							 if(err){
								var result={"status":"400"};
							 }else{
								 var result={"status":"200","tweetArray":tweetArray};
							 }
							 callback(result);
						});  
					}
				});
			});			
			
		}
}

function handle_request(msg, callback){
	
	if(msg.methodName == "newTweet"){
		newTweet(msg,function(result){
			callback(null,result);
		});
	}else if(msg.methodName == "reTweet"){
		reTweet(msg,function(result){
			callback(null,result);
		});
	}else if(msg.methodName == "homeData"){
		homeData(msg,function(result){
			callback(null,result);
		});
	}else if(msg.methodName == "searchTweet"){
		searchTweet(msg,function(result){
			callback(null,result);
		});
	}
	
}



exports.logout=logout;
exports.home=home;
exports.newTweet=newTweet;
exports.homeData = homeData;
exports.reTweet = reTweet;
exports.searchTweet=searchTweet;
exports.handle_request = handle_request;