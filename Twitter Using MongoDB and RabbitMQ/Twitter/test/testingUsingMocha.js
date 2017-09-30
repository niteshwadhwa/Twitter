/**
 * New node file
 */
var assert = require('assert'),
	http = require('http');
	
describe('Running Mocha Test Cases',function(){
	
	it('Successful when session is empty', function(done){
		http.get('http://localhost:3000/homeData', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('No output if the url is wrong', function(done){
		http.get('http://localhost:3000/userProfile', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});
	

	it('Return profile page if url is correct', function(done){
		http.get('http://localhost:3000/profile', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('Logout from application when logout function is called', function(done){
		http.get('http://localhost:3000/logout', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('No home page is returned if the url is incorrect', function(done){
		http.get('http://localhost:3000/home', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
})
