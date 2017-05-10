'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;
var AUTH_TOKEN = null;

//TODO: Add http.login as a top-level before call here.
before(function(done) {
    http.login(function(authKey) {
        AUTH_TOKEN = "Token " + authKey;
        done();
    });
});

describe("GET /stats/", function(url, quiet) {
    url = 'https://www.10000steps.org.au/api/stats/';
	quiet = false;

    describe("OK", function() {
        
    });
});
