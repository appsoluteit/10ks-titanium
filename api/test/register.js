'use strict';

const http = require("./http.js");
const chai = require("chai");
const expect = chai.expect;

describe("POST /auth/registration/", function() {
	const url = 'https://www.10000steps.org.au/api/auth/registration/';
	const quiet = true;

	//This has been commented out so we don't create too many
	//dummy accounts
    describe("OK", function() {
        let timestamp = Date.now();
        let requestBody = {
            username: timestamp + "@something.com",
            email: timestamp + "@something.com",
            password1: 'password',
            password2: 'password'
        };
		let responseBody = {};

		/*
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
            expect(responseBody).to.be.empty; //empty object indicates success
        });
		*/
    });

    describe("REQUIRED FIELDS", function() {
        let requestBody = {};
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

        it("Should require an email, password and password confirmation", function() {
            expect(responseBody.email[0]).to.equal('This field is required.');
            expect(responseBody.password1[0]).to.equal('This field is required.');
            expect(responseBody.password2[0]).to.equal('This field is required.');
        })
    });

    describe("EMPTY FIELDS", function() {
        let requestBody = {
            email: "",
            password1: "",
            password2: ""
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

        it("Should enforce an email, password and password confirmation are not empty", function() {
            expect(responseBody.email[0]).to.equal('This field may not be blank.');
            expect(responseBody.password1[0]).to.equal('This field may not be blank.');
            expect(responseBody.password2[0]).to.equal('This field may not be blank.');
        });
    });

    describe("USER EXISTS", function() {
        let requestBody = {
            email: 'ichimansteps@gmail.com',
            password1: 'password',
            password2: 'password'
        };

		let responseBody = {};

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

    describe("PASSWORD MINIMUM LENGTH", function() {
        let timestamp = Date.now();
        let requestBody = {
            email: timestamp + "@somewhere.com",
            password1: '1234567',
            password2: '1234567'
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

        it("Should complain that the password is too short", function() {
            expect(responseBody.password1[0]).to.equal('This password is too short. It must contain at least 8 characters.');
        });
    });
});
