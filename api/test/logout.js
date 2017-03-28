'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;

describe("POST /auth/logout", function(url, quiet, oldToken) {
    url = 'https://www.10000steps.org.au/api/auth/logout/';
    quiet = true;

    describe("Logout OK", function(requestBody, responseBody, token) {
        before(function(done) {
            http.login(function(authKey) {
                token = "Token " + authKey;
                oldToken = token;

                var config = {
                    to: url,
                    quiet: quiet,
                    authToken: token,
                    then: function(response) {
                        responseBody = response;
                        done();
                    }
                };

                http.post(config);
            });
        });

        it("Should pass", function() {
            expect(responseBody.success).to.equal('Successfully logged out.');
        });
    });

    describe("Generate new token", function(requestBody, responseBody, token) {
        before(function(done) {
            http.login(function(authKey) {
                token = "Token " + authKey;

                var config = {
                    to: url,
                    quiet: quiet,
                    authToken: token,
                    then: function(response) {
                        responseBody = response;
                        done();
                    }
                };

                http.post(config);
            });
        });

        it("Should be a new token", function() {
            expect(token).to.not.equal(oldToken);
        });
    });
});
