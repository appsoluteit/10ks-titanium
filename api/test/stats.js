'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;
var AUTH_TOKEN = null;

describe("GET /stats/", function(url, quiet) {
    url = 'https://www.10000steps.org.au/api/step_stats/';
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

        it("Should return statistics data", function() {
            expect(responseBody.average_steps).to.be.a('number');
            expect(responseBody.seven_day_average).to.be.a('number');
            expect(responseBody.max_month).to.be.an('object');
            expect(responseBody.max_day).to.be.an('object');
        });

        it("Should return month data", function() {
            expect(responseBody.max_month.total).to.be.a('number');
            expect(responseBody.max_month.month).to.be.a('string');
        });

        it("Should return day data", function() {
            expect(responseBody.max_day.user).to.be.a('string');
            expect(responseBody.max_day.steps_total).to.be.a('number');
            expect(responseBody.max_day.steps_walked).to.be.a('number');
            expect(responseBody.max_day.steps_date).to.be.a('string');
            expect(responseBody.max_day.activity_part).to.be.a('number');
            expect(responseBody.max_day.moderate).to.be.a('number');
            expect(responseBody.max_day.vigorous).to.be.a('number');
        });
    });
});
