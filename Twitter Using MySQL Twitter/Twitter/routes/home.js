var mysql = require("./mysql.js");

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
		
		var sqlquery="insert into tweets(email,tweet,twitterHandle,dateTime,name) values(";
		sqlquery+= "'"+req.session.data.email+"'";
		sqlquery+= ",";
		sqlquery+= "'"+req.body.newTweet+"'";
		sqlquery+= ",";
		sqlquery+= "'"+req.session.data.twitterHandle+"'";
		sqlquery+= ",";
		sqlquery+= "'"+today+"'";
		sqlquery+= ",";
		sqlquery+= "'"+req.session.data.name+"'";
		sqlquery+= ");";
	
		console.log(sqlquery);
	
		mysql.fetchData(sqlquery,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong"};
				res.send(result);
			}else{
				var result={"status":"200","message":"Tweet added Sucessfully"};
				res.redirect('/homeData');
			}
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
		
		var sqlquery1="select tweet from tweets where tweetId=";
		sqlquery1+= "'"+req.body.retweetId+"'";
		sqlquery1+= ";";

		console.log(sqlquery1);
	
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				
				var sqlquery="insert into tweets(email,tweet,twitterHandle,dateTime,name) values(";
				sqlquery+= "'"+req.session.data.email+"'";
				sqlquery+= ",";
				sqlquery+= "'"+rows[0]["tweet"]+"'";
				sqlquery+= ",";
				sqlquery+= "'"+req.session.data.twitterHandle+"'";
				sqlquery+= ",";
				sqlquery+= "'"+today+"'";
				sqlquery+= ",";
				sqlquery+= "'"+req.session.data.name+"'";
				sqlquery+= ");";
				
				mysql.fetchData(sqlquery,function(err,rows){
					if(err){
						console.log("return");
						var result={"status":"400","message":"Something Went wrong"};
						res.send(result);
					}else{
						var result={"status":"200","message":"ReTweeted Sucessfully !! Thank you"};
						res.redirect('/homeData');
					}
				});	
			}
		});	
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
}



function homeData(req,res){
	console.log("nitesh");
	if(req.session.data){
		
		var output1 = 0,output2 = 0,output3 = 0,output4 = 0;
		var tweets = [];
		var userDetails, followerCount, followingCount ;
		
		var sqlquery1="select firstName,lastName,twitterHandle from user_details where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= ";";
		
		var sqlquery2="select count(*) from follower_list where email=";
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= ";";
		
		var sqlquery3="select count(*) from following_list where email=";
		sqlquery3+= "'"+req.session.data.email+"'";
		sqlquery3+= ";";

		var sqlquery4="select tweetId,tweet,twitterHandle from tweets where email in (select following from following_list where email=";
		sqlquery4+= "'"+req.session.data.email+"'";
		sqlquery4+= ") or email =";
		sqlquery4+=	"'"+req.session.data.email+"'";
		sqlquery4+= " order by dateTime desc;";
		
		var sqlquery5="select count(*) from tweets where email=";
		sqlquery5+= "'"+req.session.data.email+"'";
		sqlquery5+= ";";
		
		console.log(sqlquery1);
		console.log(sqlquery2);
		console.log(sqlquery3);
		console.log(sqlquery4);
		console.log(sqlquery5);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				userDetails = rows[0];
				
				mysql.fetchData(sqlquery2,function(err,rows){
					if(err){
						console.log("return");
						var result={"status":"400","message":"Something Went wrong 2"};
						res.send(result);
					}else{
						followerCount = rows[0]["count(*)"];
						
						mysql.fetchData(sqlquery3,function(err,rows){
							if(err){
								console.log("return");
								var result={"status":"400","message":"Something Went wrong 3"};
								res.send(result);
							}else{
								
								followingCount = rows[0]["count(*)"];
								
								mysql.fetchData(sqlquery4,function(err,rows){
									if(err){
										console.log("return");
										var result={"status":"400","message":"Something Went wrong 4"};
										res.send(result);
									}else{
										tweets = rows;
										
										mysql.fetchData(sqlquery5,function(err,rows){
											if(err){
												console.log("return");
												var result={"status":"400","message":"Something Went wrong 5"};
												res.send(result);
											}else{
												tweetsCount = rows[0]["count(*)"];
												
												console.log(userDetails.firstName+""+userDetails.lastName+""+userDetails.twitterHandle);
												console.log(followingCount);
												console.log(followerCount);
												console.log(tweetsCount);
												res.send({"status":"200","userDetails":userDetails,"followingCount":followingCount,"followerCount":followerCount,"tweetsCount":tweetsCount,"tweetArray":tweets});
											}
										});	
									}
								});	
							}
						});	
					}
				});	
			}
		});	
	}else{
		console.log("nitesh");
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function searchTweet(req,res){
	
	if(req.session.data){
		
		console.log("nitesh	+"+req.body.hashTag);
		
		var sqlquery1 = "";
		
		if(req.body.hashTag != "" && (req.body.hashTag).substring(1) == "#"){
			sqlquery1="select tweetId,tweet,twitterHandle from tweets where tweet like '%";
			sqlquery1+=(req.body.hashTag).substring(1,((req.body.hashTag).length)-1);
			sqlquery1+="%'";
			sqlquery1+=" order by dateTime desc;";
		}else if(req.body.hashTag != "" && (req.body.hashTag).substring(1) != "#"){
			sqlquery1="select tweetId,tweet,twitterHandle from tweets where tweet like '%";
			sqlquery1+=req.body.hashTag;
			sqlquery1+="%'";
			sqlquery1+=" order by dateTime desc;";
		}else{
			sqlquery1="select tweetId,tweet,twitterHandle from tweets where email in (select following from following_list where email=";
			sqlquery1+= "'"+req.session.data.email+"'";
			sqlquery1+= ") or email =";
			sqlquery1+=	"'"+req.session.data.email+"'";
			sqlquery1+= " order by dateTime desc;";
		}
		console.log(sqlquery1);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				res.send({"status":"200","tweetArray":rows});
			}
		});	
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