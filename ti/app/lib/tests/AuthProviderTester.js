require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var AuthProvider = require('classes/AuthProvider');
var authProvider = new AuthProvider(null, null);

function test() {
	describe("AuthHelper", function() {
		describe("Login", function() {
			before(function(done) {
				Ti.App.Properties.removeProperty('AuthKey');
				Alloy.Globals.IsLoggedIn = null;
				Alloy.Globals.AuthKey = null;
				
				authProvider.login(
					'ichimansteps@gmail.com',
					'12345678'
				).then(function() {
					done();
				});
			});
			
			it("Should have setup authentication properties", function() {
				expect(Ti.App.Properties.hasProperty('AuthKey'))
					.to.equal(true);
					
				expect(Alloy.Globals.IsLoggedIn).to.equal(true);
				
				expect(Alloy.Globals.AuthKey).to.be.a('string');
			});
		});
		
		describe("Get User", function() {
			before(function(done) {
				Ti.App.Properties.removeProperty("UserURL");
				Alloy.Globals.UserURL = null;
				
				authProvider.getUser().then(function() {
					done();
				});
			});
			
			it("Should obtain user info", function() {
				expect(Ti.App.Properties.hasProperty('UserURL'))
					.to.equal(true);
					
				expect(Alloy.Globals.UserURL).to.be.a('string');
			});
		});
		
		describe("Logout", function() {
			before(function(done) {
				authProvider.logout().then(function() {
					done();
				});
			});
			
			it("Should have removed the authentication properties", function() {
				expect(Ti.App.Properties.hasProperty('AuthKey'))
					.to.equal(false);
					
				expect(Alloy.Globals.IsLoggedIn).to.equal(false);
				expect(Alloy.Globals.AuthKey).to.equal("");
			});
		});
		
		describe("Register", function() {
			var result = null;
			
			before(function(done) {
				authProvider.register(
					'ichimansteps@gmail.com', 
					'ichimansteps@gmail.com',
					'12345678',
					'12345678' 
				)
				.then(function(response) {
					result = response;
					done();
				}, function(error) {
					result = error;
					done();
				});
			});
			
			it("Should return that a user with that username already exists", function() {
				expect(result).to.equal('Username: A user with that username already exists.');
			});
		});
	});
}

module.exports.test = test;