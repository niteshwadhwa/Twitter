var mysql = require("./mysql.js");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/twitter";

function home(req,res){
	console.log(req.session.data);
	res.render("home",{"status":"200"});
}
function logout(req,res){
	res.render('logout',{"status":"200"});
}
function newTweet(req,res){
	
	if(req.session.data){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();
		var hh = today.getHours();
		var mi = today.getMinutes();
		var ss = today.getSeconds();
		
		if(dd < 10){
			dd = '0'+dd;
		}
		if(mm < 10){
			mm = '0'+mm;
		}
		if(hh < 10){
			hh = '0'+hh;
		}
		if(mi < 10){
			mi = '0'+mi;
		}
		if(ss < 10){
			ss = '0'+ss;
		}
		today = yyyy+"-"+mm+"-"+dd+" "+hh+":"+mi+":"+ss;
		var tweetId = Math.floor(Math.random()*10000000000);
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('tweets');
			
			coll.insert({"email": req.session.data.email, "tweet":req.body.newTweet,"tweetId":tweetId ,"twitterHandle":req.session.data.twitterHandle,"dateTime":today,"name":req.session.data.name}, function(err, success){
				if(success){
					var result={"status":"200","message":"Tweet added Sucessfully"};
					res.redirect('/homeData');
				}else{
					var result={"status":"400","message":"Something Went wrong"};
					res.send(result);
				}
			});
		
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

function reTweet(req,res){
	
	if(req.session.data){
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();
		var hh = today.getHours();
		var mi = today.getMinutes();
		var ss = today.getSeconds();
		
		if(dd < 10){
			dd = '0'+dd;
		}
		if(mm < 10){
			mm = '0'+mm;
		}
		if(hh < 10){
			hh = '0'+hh;
		}
		if(mi < 10){
			mi = '0'+mi;
		}
		if(ss < 10){
			ss = '0'+ss;
		}
		today = yyyy+"-"+mm+"-"+dd+" "+hh+":"+mi+":"+ss;
		var tweetId = Math.floor(Math.random()*10000000000);
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('tweets');

			coll.findOne({"tweetId": req.body.retweetId}, function(err, success){
				if(success){
					coll.insert({"email": req.session.data.email, "tweet":success.tweet,"tweetId":tweetId ,"twitterHandle":req.session.data.twitterHandle,"dateTime":today,"name":req.session.data.name}, function(err, success){
						if(success){
							var result={"status":"200","message":"ReTweeted Sucessfully !! Thank you"};
							res.redirect('/homeData');
						}else{
							var result={"status":"400","message":"Something Went wrong"};
							res.send(result);
						}
					});
					
				}else{
					var result={"status":"400","message":"Something Went wrong 1"};
					res.send(result);
				}
			});
		
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
}



function homeData(req,res){
	
	if(req.session.data){
		
		var tweets = [];
		var userDetails, followerCount, followingCount, tweetsCount ;
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll1 = mongo.collection('user_details');
			
			
			coll1.findOne({email: req.session.data.email},{firstName:1,lastName:2,twitterHandle:3,follower_list:4,following_list:5}, function(err, user){
				if(user){
					userDetails = {"firstName":user.firstName,"lastName":user.lastName,"twitterHandle":user.twitterHandle};
					
					followerCount = user.follower_list.length;
					followingCount = user.following_list.length;
					
					var coll2 = mongo.collection('tweets');
					coll2.find({"email": req.session.data.email}).toArray(function(err, tweets) {
						 if(err){
							var result={"status":"400"};
							res.send(result);
						 }else{
							 tweetsCount = tweets.length;
							 var coll3 = mongo.collection('tweets');
							 coll3.find({ $or:[{"email":{$in:((user.following_list.length > 0)? user.following_list.following :"" )},"email": req.session.data.email}]}).sort({"dateTime":-1}).toArray(function(err, tweetArray) {
								 if(err){
									var result={"status":"400"};
									res.send(result);
								 }else{
									 res.send({"status":"200","userDetails":userDetails,"followingCount":followingCount,"followerCount":followerCount,"tweetsCount":tweetsCount,"tweetArray":tweetArray});
								 }
							}); 
						}
					});
				}else{
					var result={"status":"400"};
					res.send(result);
				}
			});
		});
	}
	else{
		console.log("nitesh");
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
}


function searchTweet(req,res){
	
	if(req.session.data){
		
		if(req.body.hashTag !== "" && (req.body.hashTag).substring(1) === "#"){
			
			console.log("1");
			
			mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = mongo.collection('tweets');
				
				coll.find({"tweet":(req.body.hashTag).substring(1,((req.body.hashTag).length)-1)},{"tweetId":1,"tweet":2,"twitterHandle":3}).sort({"dateTime":-1}).toArray(function(err, tweetArray) {
					if(err){
						var result={"status":"400","message":"Something Went wrong"};
						res.send(result);
					}else{
						res.send({"status":"200","tweetArray":tweetArray});
					}
				}); 
			});
			
		}else if(req.body.hashTag != "" && (req.body.hashTag).substring(1) != "#"){
			
			mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				
				var coll1 = mongo.collection('tweets');
				
				coll1.find({"tweet": new RegExp(req.body.hashTag)}).sort({"dateTime":-1}).toArray(function(err, tweetArray) {
					if(err){
						var result={"status":"400"};
						res.send(result);
					}else{
						console.log(tweetArray[0]);
						res.send({"status":"200","tweetArray":tweetArray});
					}
				});  
				
			});		
			

		}else{
			
			console.log("3");
			
			mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				
				var coll1 = mongo.collection('user_details');
				var coll2 = mongo.collection('tweets');
				
				coll1.findOne({"email":req.session.data.email},{following_list:1}, function(err, user){
					if(err){
						var result={"status":"400","message":"Something Went wrong"};
						res.send(result);
					}else{
						 coll2.find({ $or:[{"email":{$in:user.following_list.following},"email": req.session.data.email}]}).sort({"dateTime":-1}).toArray(function(err, tweetArray) {
							 if(err){
								var result={"status":"400"};
								res.send(result);
							 }else{
								 res.send({"status":"200","tweetArray":tweetArray});
							 }
						});  
					}	
				});
			});			
			
		
	  }
	}else{
		console.log("nitesh");
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
	
}



exports.logout=logout;
exports.home=home;
exports.newTweet=newTweet;
exports.homeData = homeData;
exports.reTweet = reTweet;
exports.searchTweet=searchTweet;