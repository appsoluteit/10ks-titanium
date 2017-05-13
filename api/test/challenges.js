'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;
var AUTH_TOKEN = null;

describe("GET /challenges/", function(url, quiet) {
    url = 'https://www.10000steps.org.au/api/challenges/';
	quiet = true;

    before(function(done) {
        http.login(function(authKey) {
            AUTH_TOKEN = "Token " + authKey;
            done();
        });
    });

    describe("OK", function(responseBody) {
        before(function(done) {
            var config = {
                to: url,
                quiet: quiet,
                token: AUTH_TOKEN,
                then: function(response) {
                    responseBody = response;
                    done();
                }
            };

            http.get(config);
        });

        it("Should return available challenges", function() {

        });
    }
}
