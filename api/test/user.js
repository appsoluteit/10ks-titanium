'use strict';

const http = require("./http.js");
const chai = require("chai");
const expect = chai.expect;
var AUTH_TOKEN = null;

describe("GET /auth/user/", function() {
    const url = "https://www.10000steps.org.au/api/auth/user/";
    const quiet = true;

    before(function(done) {
        http.login(function(authKey) {
            AUTH_TOKEN = "Token " + authKey;
            done();
        });
    });

    describe("OK", function() {
        let responseBody = {};

        before(function(done) {
            let config = {
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

        it("Should pass", function() {
            expect(responseBody.url).to.be.a('string');
            expect(responseBody.username).to.be.a('string');
            expect(responseBody.email).to.be.a('string');
            expect(responseBody.groups).to.be.an('array');
            expect(responseBody.walker).to.not.equal(undefined); //may be null or an object
        });
    });
});
