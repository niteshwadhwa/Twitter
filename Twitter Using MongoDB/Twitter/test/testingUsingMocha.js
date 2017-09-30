/**
 * New node file
 */
var assert = require('assert'),
	http = require('http');
	
describe('Running Mocha Test Cases',function(){
	
	it('Should return at the home page of application when url is correct', function(done){
		http.get('http://localhost:3000/home', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('Should logout from the application when logout function is called', function(done){
		http.get('http://localhost:3000/logout', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('Should return successfully when session is empty', function(done){
		http.get('http://localhost:3000/homeData', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('Should not return the profile page if the url is wrong', function(done){
		http.get('http://localhost:3000/userProfile', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});
	
	it('Should return the profile page if the url is correct', function(done){
		http.get('http://localhost:3000/profile', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
})
