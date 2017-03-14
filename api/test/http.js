var unirest = require("unirest");

var http = {
    post: function(config) {
        var to = config.to, 
            request = config.request, 
            authToken = config.authToken, 
            quiet = config.quiet, 
            then = config.then;

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if(authToken) {
            headers.Authorizaton = authToken;
        }

        unirest.post(to)
            .headers(headers)
            .send(request)
            .end(function(response) {
                if(!quiet) {
                    console.log("Response: ", response.body);
                }

                then(response.body);
            });
    },

    get: function(to, token, then) {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        };

        console.log("GET headers", headers);

        unirest.get(to)
               .headers(headers)
               .send()
               .end(function(response) {
                   console.log("Response: ", response.body);

                   then(response.body);
               });
    },

    // Logs into my default account and returns the auth key
    login: function(then) {
        var request = {
            username: 'admin@jasonsultana.com',
            password: 'steps1990'
        };

        var config = {
            to: 'https://www.10000steps.org.au/api/auth/login/',
            request: request,
            quiet: true,
            then: function(responseBody) {
                then(responseBody.key)
            }
        };

        http.post(config);
    }
};

module.exports = http;