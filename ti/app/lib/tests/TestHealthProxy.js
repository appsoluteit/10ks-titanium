var q = require('q');

function querySteps(from, to) {
    var deferred = q.defer();

    Ti.API.info(`[TestProxy] Importing test steps. From ${from}, to ${to}.`);

    var response = [{
        eventDate: '2021-07-11',
        steps: 1234
    }];

    deferred.resolve({
        result: response
    });

    return deferred.promise;
}

module.exports.ID = "ios_api";
module.exports.querySteps = querySteps;