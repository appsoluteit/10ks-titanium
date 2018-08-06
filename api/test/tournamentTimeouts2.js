'use strict';

var http = require("./http.js");
var chai = require("chai");
var expect = chai.expect;
var AUTH_TOKEN = null;

describe("GET /tournament_timeouts", function(url, quiet) {
    url = 'https://www.10000steps.org.au/api/tournament_timeouts/';
	quiet = true;

    before(function(done) {
        http.login(function(authKey) {
            AUTH_TOKEN = "Token " + authKey;
            done();
        });
    });

    describe("LIST OK", function(responseBody) {
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

        it("Should return available 'timeout' tournaments", function() {
            expect(responseBody.results).to.be.an('array');
            expect(responseBody.results[0].team).to.be.an('object');
            expect(responseBody.results[0].team.tournament).to.be.an('object');
            expect(responseBody.results[0].team.tournament.id).to.be.a('number');
        });
    });
});

describe("GET /tournament_timeouts2/", function(url, quiet, tournamentId) {
    url = 'https://www.10000steps.org.au/api/tournament_timeouts/';
    quiet = false;

    before(function(done) {
        var config = {
            to: url,
            quiet: quiet,
            token: AUTH_TOKEN,
            then: function(response) {
                tournamentId = response.results[0].team.tournament.id;
                url = 'https://www.10000steps.org.au/api/tournament_timeouts2/' + tournamentId;
                done();
            }
        };

        http.get(config);
    });

    describe("DETAILS OK", function(responseBody) {
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
    
        it("Should return the details of timeout tournament with id " + tournamentId, function() {
            expect(responseBody.timeout_teams).to.be.an('array');
        });
    });
});