var healthkit = require('ti.healthkit');
var q = require('q');

function querySteps(from, to) {
    var deferred = q.defer();

    Ti.API.info('Importing steps from HealthKit');

    healthkit.querySteps(from, to, function(response) {
        Ti.API.info('healthkit query steps got response!');
        Ti.API.info(response);

        if (response.success) {
            deferred.resolve(response);
        }
        else {
            deferred.reject(response);
        }
    });

    return deferred.promise;
}

module.exports.querySteps = querySteps;