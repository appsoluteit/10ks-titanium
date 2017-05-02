'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;

describe("GET /steps/", function(url, quiet, timestamp) {
	url = 'https://www.10000steps.org.au/api/steps/';
	quiet = false;

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

        it("Should return steps data", function() {
            expect(responseBody.count).to.be.a('number');
            expect(responseBody.next).to.not.equal(undefined);
            expect(responseBody.previous).to.not.equal(undefined);
            expect(responseBody.results).to.be.an('array');
        });
    });
});

describe("POST /steps/", function(url, quiet, timestamp) {
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

	it("Should send steps data", function() {
		//todo: steps_date seems to be the only required field.
	});
});
