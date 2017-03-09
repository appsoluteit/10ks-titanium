'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;

describe("POST /auth/login/", function(url, quiet) {
	url = 'https://www.10000steps.org.au/api/auth/login/';
	quiet = true;

	describe("OK", function(responseBody, requestBody) {
		requestBody = {
			username: 'admin@jasonsultana.com',
			password: 'steps1990'
		};

		before(function(done) {
			http.post(url, requestBody, quiet, function(response) {
				responseBody = response;
				done();
			});
		});

		it("Should pass", function() {
			expect(responseBody.key).to.not.be.undefined;
		});
	});

	describe("MISSING PASSWORD", function(responseBody, requestBody) {
		requestBody = {
			username: 'admin@jasonsultana.com',
			password: ''
		};

		before(function(done) {
			http.post(url, requestBody, quiet, function(response){
				responseBody = response;
				done();
			});
		});

		it("Should prompt for password", function() {
			expect(responseBody.password[0]).to.equal('This field may not be blank.');
		});
	});

	describe("MISSING USERNAME", function(responseBody, requestBody) {
		requestBody = {
			username: '',
			password: 'steps1990'
		};

		before(function(done) {
			http.post(url, requestBody, quiet, function(response) {
				responseBody = response;
				done();
			});
		});

		it("Should prompt for username", function() {
			expect(responseBody.non_field_errors[0]).to.equal('Must include either "username" or "email" and "password".');
		});
	});

	describe("LOGIN FAILED", function(responseBody, requestBody) {
		requestBody = {
			username: 'admin@jasonsultana.com',
			password: 'steps1991'
		};

		before(function(done) {
			http.post(url, requestBody, quiet, function(response) {
				responseBody = response;
				done();
			});
		});

		it("Should fail", function() {
			expect(responseBody.non_field_errors[0]).to.equal('Unable to log in with provided credentials.');
		});
	});
});