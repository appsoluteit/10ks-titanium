'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;
var AUTH_TOKEN = null;

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm > 9 ? '' : '0') + mm,
          (dd > 9 ? '' : '0') + dd
	  ].join('-');
};

describe("GET /steps/", function(url, quiet) {
	url = 'https://www.10000steps.org.au/api/steps/';
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

        it("Should return steps data", function() {
            expect(responseBody.count).to.be.a('number');
            expect(responseBody.next).to.not.equal(undefined);
            expect(responseBody.previous).to.not.equal(undefined);
            expect(responseBody.results).to.be.an('array');
        });
    });
});

describe("POST /steps/", function(url, quiet, responseBody) {
    url = 'https://www.10000steps.org.au/api/steps/';
	quiet = false;

    describe("OK", function(requestBody, responseBody) {
        before(function(done) {
    		var today = new Date();

    		requestBody = {
    			steps_date: today.yyyymmdd(),
    			vigorous: 10,
    			moderate: 5,
    			steps_walked: 20
    		};

    		var config = {
    			authToken: AUTH_TOKEN,
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

    	it("Should send steps data", function() {
    		expect(responseBody.activity_part).to.equal(2500);
    		expect(responseBody.steps_total).to.equal(2520);
    	});
    });
});
