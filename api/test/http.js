var unirest = require("unirest");

var http = {
    //  
    post: function() {
        var to, request, authToken, quiet, then;

        if(arguments.length === 4) {
            to = arguments[0];
            request = arguments[1];
            quiet = arguments[2];
            then = arguments[3]
        }
        else if(arguments.length === 5) {
            to = arguments[0];
            authToken = arguments[1];
            request = arguments[2];
            quiet = arguments[3];
            then = arguments[4];
        }
        else {
            throw "Unknown argument length";
        }

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

        http.post('https://www.10000steps.org.au/api/auth/login/', request, true, function(responseBody) {
            //console.log("Login response: ", responseBody);
            then(responseBody.key);
        });
    }
};

module.exports = http;