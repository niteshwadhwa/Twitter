var ejs= require('ejs');
var mysql = require('mysql');
var arrayOfPools= [];


function getConnection(){
	var connection = mysql.createConnection({
		host : 'localhost', 
		user : 'root',
		password : 'root',
		database : 'twitter'
	});
	return connection;
}
for(var i=0;i<1000;i++){
	var connection=getConnection();
	arrayOfPools.push(connection);
}
function getConnectionFromPool(){
	var connection = arrayOfPools.pop();
	return connection;
}
function releaseConnectionFromPool(connection){
	arrayOfPools.push(connection);
}
function fetchData(sqlQuery,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnectionFromPool();
	//var connection=getConnection();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			releaseConnectionFromPool(connection);
			callback(err, rows);
		}
	});
	//console.log("\nConnection closed..");
	//connection.end();
}
exports.fetchData = fetchData;