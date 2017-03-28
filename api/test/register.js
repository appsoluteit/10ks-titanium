'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;

describe("POST /auth/registration/", function(url, quiet, timestamp) {
	url = 'https://www.10000steps.org.au/api/auth/registration/';
	quiet = true;

    /*
    describe("OK", function(requestBody, responseBody) {
        timestamp = Date.now();
        requestBody = {
            username: timestamp + "@something.com",
            email: timestamp + "@something.com",
            password1: 'password',
            password2: 'password'
        };

		before(function(done) {
			http.post(url, requestBody, quiet, function(response) {
				responseBody = response;
				done();
			});
		});

        it("Should pass", function() {
            expect(responseBody).to.be.empty; //empty object indicates success
        });
    });
    */

    describe("REQUIRED FIELDS", function(requestBody, responseBody) {
        requestBody = {};

		before(function(done) {
            var config = {
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

        it("Should require an email, password and password confirmation", function() {
            expect(responseBody.email[0]).to.equal('This field is required.');
            expect(responseBody.password1[0]).to.equal('This field is required.');
            expect(responseBody.password2[0]).to.equal('This field is required.');
        })
    });

    describe("EMPTY FIELDS", function(requestBody, responseBody) {
        requestBody = {
            email: "",
            password1: "",
            password2: ""
        };

 		before(function(done) {
            var config = {
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

        it("Should enforce an email, password and password confirmation are not empty", function() {
            expect(responseBody.email[0]).to.equal('This field may not be blank.');
            expect(responseBody.password1[0]).to.equal('This field may not be blank.');
            expect(responseBody.password2[0]).to.equal('This field may not be blank.');
        });
    });

    describe("USER EXISTS", function(requestBody, responseBody) {
        requestBody = {
            email: 'admin@jasonsultana.com',
            password1: 'password',
            password2: 'password'
        };

        before(function(done) {
            var config = {
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

        it("Should inform that a user already exists with that email", function() {
            expect(responseBody.email[0]).to.equal('A user is already registered with this e-mail address.');
        });
    });

    describe("PASSWORD MINIMUM LENGTH", function(requestBody, responseBody) {
        timestamp = Date.now();
        requestBody = {
            email: timestamp + "@somewhere.com",
            password1: '1234567',
            password2: '1234567'
        };

 		before(function(done) {
            var config = {
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

        it("Should complain that the password is too short", function() {
            expect(responseBody.password1[0]).to.equal('This password is too short. It must contain at least 8 characters.');
        });
    });
});
