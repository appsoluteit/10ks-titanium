var healthkit = require('ti.healthkit');
var q = require('q');

function querySteps(from, to) {
    var deferred = q.defer();

    Ti.API.info(`[HealthkitProxy] Importing steps from HealthKit. From ${from}, to ${to}.`);

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