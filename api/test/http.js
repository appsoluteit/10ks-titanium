var unirest = require("unirest");

var http = {
    post: function(to, request, quiet, then) {
        unirest.post(to)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send(request)
            .end(function(response) {
                if(!quiet) {
                    console.log("Response: ", response.body);
                }

                then(response.body);
            });
    }
};

module.exports = http;