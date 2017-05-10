'use strict';

const http = require("./http.js");
const chai = require("chai");
const expect = chai.expect;
let AUTH_TOKEN = null;

describe("POST /auth/logout/", function() {
    const url = 'https://www.10000steps.org.au/api/auth/logout/';
    const quiet = true;

    before(function(done) {
        http.login(function(authKey) {
            AUTH_TOKEN = "Token " + authKey;
            done();
        });
    });

    describe("Logout OK", function() {
        let responseBody = {};

        before(function(done) {
            let config = {
                to: url,
                quiet: quiet,
                authToken: AUTH_TOKEN,
                then: function(response) {
                    responseBody = response;
                    done();
                }
            };

            http.post(config);
        });

        it("Should pass", function() {
            expect(responseBody.detail).to.equal('Successfully logged out.');
        });
    });

    describe("Generate new token", function() {
        let token = null;
        let responseBody = {};

        before(function(done) {
            http.login(function(authKey) {
                token = "Token " + authKey;
                done();
            });
        });

        it("Should be a new token", function() {
            expect(token).to.not.equal(AUTH_TOKEN);
        });
    });
});
