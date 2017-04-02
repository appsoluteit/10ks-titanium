require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var APIHelper = require('helpers/APIHelper');

function test() {
	describe("APIHelper", function(authKey) {
		describe("POST", function() {
			before(function(done) {			
				function onSuccess(response) {					
					authKey = response.key;					
					done();
				}
				
				function onFail(response) {
					done();
				}
				
				var data = {
					username: 'jason.sultana01@gmail.com',
					password: 'steps1990'
				};
	
				APIHelper.post({
					message:    'Logging in...',
					url: 		'auth/login/',
					data: 		data,
					success: 	onSuccess,
					fail:		onFail
				});	
			});		
			
			it("Should return an authenticaton token", function() {
				expect(authKey).to.be.a('string');
			});
		});
		
		describe("GET", function(userUrl) {
			before(function(done) {
				function onSuccess(response) {
					userUrl = response.url;
					done();
				}
				
				function onFail(response) {
					done();
				}
				
				APIHelper.get({
					message: 	"Fetching your account...",
					url: 		"auth/user/",
					headers: [{
								key: "Authorization",
								value: "Token " + authkey
					}],
					
					success: 	onSuccess,
					fail: 		onFail
				});
				
				it("Should return a user object", function() {
					expect(userUrl).to.be.a('string');
				});
			});		
		});
	});
}

module.exports.test = test;