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

                //console.log("Auth key: ", authKey);

                token = "Token " + authKey;
                
                http.get(url, token, function(response) {
                    console.log("User response:", response);

                    responseBody = response;
                    done();
                });
            });
        });

        it("Should pass", function() {
            expect(responseBody.url).to.be.a('string');
        });
    });
});