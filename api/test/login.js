'use strict';

const http = require("./http.js");
const chai = require("chai");
const expect = chai.expect;

describe("POST /auth/login/", function() {
	const url = 'https://www.10000steps.org.au/api/auth/login/';
	const quiet = true;

	describe("MISSING PASSWORD", function() {
		let requestBody = {
			username: 'ichimansteps@gmail.com',
			password: ''
		};

		let responseBody = {};

		before(function(done) {
			let config = {
				to: url,
				request: requestBody,
				quiet: quiet,
				then: function(response) {
					responseBody = response;
					done();
				}
			};

			http.post(config);
		});

		it("Should prompt for password", function() {
			expect(responseBody.password[0]).to.equal('This field may not be blank.');
		});
	});

	describe("MISSING USERNAME", function() {
		let requestBody = {
			username: '',
			password: '12345678'
		};

		let responseBody = {};

		before(function(done) {
			let config = {
				to: url,
				request: requestBody,
				quiet: quiet,
				then: function(response) {
					responseBody = response;
					done();
				}
			};

			http.post(config);
		});

		it("Should prompt for username", function() {
			expect(responseBody.non_field_errors[0]).to.equal('Must include either "username" or "email" and "password".');
		});
	});

	describe("LOGIN FAILED", function() {
		let requestBody = {
			username: 'ichimansteps@gmail.com',
			password: '123456789 '
		};

		let responseBody = {};

		before(function(done) {
			let config = {
				to: url,
				request: requestBody,
				quiet: quiet,
				then: function(response) {
					responseBody = response;
					done();
				}
			};

			http.post(config);
		});

		it("Should fail", function() {
			expect(responseBody.non_field_errors[0]).to.equal('Unable to log in with provided credentials.');
		});
	});

	describe("OK", function() {
		let requestBody = {
			username: 'ichimansteps@gmail.com',
			password: '12345678'
		};

		let responseBody = {};

		before(function(done) {
			let config = {
				to: url,
				request: requestBody,
				quiet: quiet,
				then: function(response) {
					responseBody = response;
					done();
				}
			};

			http.post(config);
		});

		it("Should pass", function() {
			expect(responseBody.key).to.not.be.undefined;
		});
	});
});
