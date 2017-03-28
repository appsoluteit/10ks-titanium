'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;

describe("GET /auth/user/", function(url, quiet) {
    url = "https://www.10000steps.org.au/api/auth/user/";
    quiet = true;

    describe("OK", function(requestBody, responseBody, token) {
        before(function(done) {
            http.login(function(authKey) {
                token = "Token " + authKey;

                var config = {
                    to: url,
                    quiet: quiet,
                    token: token,
                    then: function(response) {
                        responseBody = response;
                        done();
                    }
                };

                http.get(config);
            });
        });

        it("Should pass", function() {
            expect(responseBody.url).to.be.a('string');
            expect(responseBody.username).to.be.a('string');
            expect(responseBody.email).to.be.a('string');
            expect(responseBody.groups).to.be.an('array');
            expect(responseBody.walker).to.not.equal(undefined); //may be null or an object
        });
    });
});
