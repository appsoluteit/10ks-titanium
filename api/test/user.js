'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;

describe("GET /auth/user/", function(url, quiet) {
    url = "https://www.10000steps.org.au/api/auth/user/";
    quiet = false;

    describe("OK", function(requestBody, responseBody, token) {
        before(function(done) {
            http.login(function(authKey) {
                token = "Token " + authKey;
                
                http.get(url, token, function(response) {
                    responseBody = response;
                    done();
                });
            });
        });

        it("Should pass", function() {
            expect(responseBody.url).to.be.a('string');
            expect(responseBody.username).to.be.a('string');
            expect(responseBody.email).to.be.a('string');
            expect(responseBody.groups).to.be.an('array');
            expect(responsebody.walker).to.be.an('object');
        });
    });
});