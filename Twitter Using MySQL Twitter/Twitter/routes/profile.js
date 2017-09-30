mysql = require("./mysql.js");

function profile(req, res){
  res.render('profile');
};

function profileData(req,res){
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

		var sqlquery4="select tweetId,tweet,twitterHandle from tweets where email=";
		sqlquery4+=	"'"+req.session.data.email+"'";
		sqlquery4+= " order by dateTime desc";
		
		var sqlquery5="select count(*) from tweets where email=";
		sqlquery5+= "'"+req.session.data.email+"'";
		sqlquery5+= ";";
		
		console.log(sqlquery1);
		console.log(sqlquery2);
		console.log(sqlquery3);
		console.log(sqlquery4);
		
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

function followingData(req,res){

	if(req.session.data){
		
		var sqlquery1="select following,followingTwitterHandle,name from following_list where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= ";";

		console.log(sqlquery1);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				res.send({"status":"200","followingArray":rows})
			}
		});	
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function unfollow(req,res){

	if(req.session.data){
		
		var sqlquery1="select * from following_list where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= " and following=";
		sqlquery1+= "'"+req.body.unfollowEmail+"'";
		sqlquery1+= ";";
		
		var sqlquery2="delete from following_list where email=";
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= " and following=";
		sqlquery2+= "'"+req.body.unfollowEmail+"'";
		sqlquery2+= ";";
		
		console.log(sqlquery1);
		console.log(sqlquery2);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				if(rows.length == 1){
					mysql.fetchData(sqlquery2,function(err,rows){
						if(err){
							console.log("return");
							var result={"status":"400","message":"Something Went wrong 2"};
							res.send(result);
						}else{
							res.redirect("/afterUnFollow");
						}
					});
				}else{
					var result={"status":"400","message":"Something Went wrong"};
					res.send(result);
				}
			}
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function afterUnFollow(req,res){

	if(req.session.data){
		
		var followingCount ;
		
		var sqlquery1="select count(*) from following_list where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= ";";

		var sqlquery2="select following,followingTwitterHandle,name from following_list where email=";
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= ";";
		
		console.log(sqlquery1);
		console.log(sqlquery2);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				followingCount = rows[0]["count(*)"];
				
				mysql.fetchData(sqlquery2,function(err,rows){
					if(err){
						console.log("return");
						var result={"status":"400","message":"Something Went wrong 1"};
						res.send(result);
					}else{
						res.send({"status":"200","followingArray":rows,"followingCount":followingCount})
					}	
				});	
			}
		});	
	}else{
		console.log("nitesh");
		res.send({"status":"400","message":"Please reload the page and try again"});
	}


	
}

function followerData(req,res){

	if(req.session.data){
		
		var followerArrayShowButton = [];
		var followerArrayHideButton = [];
		
		// user not following 
		
		var sqlquery1="select follower,followerTwitterHandle,name from follower_list where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= " and follower not in (select following from following_list where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= "and following in (select follower from follower_list where email ="
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= "));";

		// user following
		
		var sqlquery2="select follower,followerTwitterHandle,name from follower_list where email=";
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= " and follower in (select following from following_list where email=";
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= "and following in (select follower from follower_list where email ="
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= "));";
		
		console.log(sqlquery1);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				followerArrayShowButton = rows;
				mysql.fetchData(sqlquery2,function(err,rows1){
					if(err){
						console.log("return");
						var result={"status":"400","message":"Something Went wrong 1"};
						res.send(result);
					}else{
						var followerArrayHideButton = rows1;
						res.send({"status":"200","followerArrayShowButton":followerArrayShowButton,"followerArrayHideButton":followerArrayHideButton});
					}
				});
			}
		});	
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function follow(req,res){

	if(req.session.data){
		
		var sqlquery1="select * from user_details where email=";
		sqlquery1+= "'"+req.body.followEmail+"'";
		sqlquery1+= ";";
	
		console.log(sqlquery1);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				if(rows.length == 1){
					
					var sqlquery2="insert into following_list(email,following,name,followingTwitterHandle) values(";
					sqlquery2+= "'"+req.session.data.email+"'";
					sqlquery2+= ",";
					sqlquery2+= "'"+req.body.followEmail+"'";
					sqlquery2+= ",";
					sqlquery2+= "'"+rows[0].firstName+" "+rows[0].lastName+"'";
					sqlquery2+= ",";
					sqlquery2+= "'"+rows[0].twitterHandle+"'";
					sqlquery2+= ");";
					
					mysql.fetchData(sqlquery2,function(err,rows){
						if(err){
							console.log("return");
							var result={"status":"400","message":"Something Went wrong 2"};
							res.send(result);
						}else{
							res.redirect("/afterFollow");
						}
					});
				}else{
					var result={"status":"400","message":"Something Went wrong"};
					res.send(result);
				}
			}
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function afterFollow(req,res){

	if(req.session.data){
		
		var followerArrayShowButton = [];
		var followerArrayHideButton = [];
		var followingCount;
		
		// user not following 
		
		var sqlquery1="select follower,followerTwitterHandle,name from follower_list where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= " and follower not in (select following from following_list where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= "and following in (select follower from follower_list where email ="
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= "));";

		// user following
		
		var sqlquery2="select follower,followerTwitterHandle,name from follower_list where email=";
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= " and follower in (select following from following_list where email=";
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= "and following in (select follower from follower_list where email ="
		sqlquery2+= "'"+req.session.data.email+"'";
		sqlquery2+= "));";
		
		
		var sqlquery3="select count(*) from following_list where email=";
		sqlquery3+= "'"+req.session.data.email+"'";
		sqlquery3+= ";";
		
		console.log(sqlquery1);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				followerArrayShowButton = rows;
				mysql.fetchData(sqlquery2,function(err,rows1){
					if(err){
						console.log("return");
						var result={"status":"400","message":"Something Went wrong 1"};
						res.send(result);
					}else{
						var followerArrayHideButton = rows1;
						mysql.fetchData(sqlquery3,function(err,rows){
							if(err){
								console.log("return");
								var result={"status":"400","message":"Something Went wrong 1"};
								res.send(result);
							}else{
								followingCount = rows[0]["count(*)"];
								res.send({"status":"200","followerArrayShowButton":followerArrayShowButton,"followerArrayHideButton":followerArrayHideButton,"followingCount":followingCount});
							}
						});
					}
				});
			}
		});	
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function getDetails(req,res){
	
	if(req.session.data){
		
		var sqlquery1="select firstName,lastName,email,country,state,city,birthDate,twitterHandle,contact from user_details where email=";
		sqlquery1+= "'"+req.session.data.email+"'";
		sqlquery1+= ";";
		
		console.log(sqlquery1);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				
				res.send({"status":"200","userDetails":rows[0]});
			}
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function updateDetails(req,res){
	
	if(req.session.data){
		
		
		var sqlquery1="update  user_details set country=";
			sqlquery1+="'"+req.body.country+"'";
			sqlquery1+=",state=";
			sqlquery1+="'"+req.body.state+"'";
			sqlquery1+=",city=";
			sqlquery1+="'"+req.body.city+"'";
			sqlquery1+=",birthDate=";
			sqlquery1+="'"+req.body.birthDate+"'";
			sqlquery1+=",twitterHandle=";
			sqlquery1+="'"+req.body.twitterHandle+"'";
			sqlquery1+=" where email=";
			sqlquery1+="'"+req.session.data.email+"'";
				
		console.log(sqlquery1);
		
		mysql.fetchData(sqlquery1,function(err,rows){
			if(err){
				console.log("return");
				var result={"status":"400","message":"Something Went wrong 1"};
				res.send(result);
			}else{
				
				res.redirect("/getDetails");
			}
		});
		
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