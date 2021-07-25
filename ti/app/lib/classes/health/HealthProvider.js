var q = require('q');
var DateTimeHelper = require('helpers/DateTimeHelper');

function getProvider() {
    // Will return a proxy to one of:
        // Apple HealthKit
        // Google Fit
        // Samsung Health

    var provider = Ti.App.Properties.getString('healthProvider', null);
    if (provider == null) {
        return null;
    }

    switch (provider) {
        case 'healthkit': 
            return require('classes/health/HealthkitProxy');

        case 'google-fit':
            // TODO
            break;

        case 'samsung-health':
            // TODO
            break;

        default:
            Ti.App.error('Unknown health provider: ' + provider);
            return null;
    }
}

function importSteps(customFrom) {
    var provider = getProvider();
    if (provider == null) {
        console.warn('Health provider is null. exiting...');
        return q.resolve();
    }
    else {
        // Note: Ideally we would want to know when the user last synced from HealthKit in a device-agnostic way,
        // so that it persists between app-installs and devices. Since we don't have one though,
        // the safest thing for us to do is to semi-intelligently filter out steps in Alloy.Globals.Steps.writeSingle,
        // such that if a step entry looks like it already exists, it's not written again. 
        // We can't use the new /steps/latest endpoint here, since that could cause steps to not get synced if the user syncs first,
        // then imports second.
        var lastSyncDate = Ti.App.Properties.getString('lastSyncDate', null);

		var defaultFrom = DateTimeHelper.parseLocal(lastSyncDate);
        var to = DateTimeHelper.now();
        var twoWeeksAgo = DateTimeHelper.localise(new Date(to.getTime() - (1000*60*60*24*14))); // milliseconds * seconds * minutes * hours * days

        Ti.API.info('Importing steps from: ', defaultFrom);
        Ti.API.info('2 weeks ago:', twoWeeksAgo);

        if (defaultFrom < twoWeeksAgo) {
            Ti.API.info('Showing spinner');
            Alloy.Globals.Spinner.show('Importing steps...');
        }

        return provider
            .querySteps(customFrom || defaultFrom, to)
            .then(function(response) {
                // If the result is a string, assume its JSON and parse it
                if (typeof(response.result) === 'string') {
                    response.result = JSON.parse(response.result);
                }

                Ti.API.info('HealthProvider processing results. Count = ' + response.result.length);

                response.result.forEach(element => {
                    var date = DateTimeHelper.parseLocal(element.eventDate);
                    var steps = element.steps;
    
                    console.log('HealthProvider processing item', element);
                    console.log('Reading existing steps by date', date);

                    var item = Alloy.Globals.Steps.readByDate(date); // find an existing steps record for that date
                    if (!item) {
                        // We assume that there is only one source of truth for steps walked on any given day.
                        // In other words, either the existing local data has accurate step data, or HealthKit, or some other provider.
                        // Incrementing steps here (i.e - stepsWalked += steps) can result in steps doubling up if the user re-imports from a health provider (eg: healthkit). 
                        // Steps may also be tracked in multiple providers (eg: HealthKit plus FitBit). So let's only save step data from a health provider if it didn't already exist locally.
                        item = {
                            activityPart: 0,
                            moderateMins: 0,
                            vigorousMins: 0,
                            stepsWalked: steps,
                            stepsTotal: steps,
                            stepsDate: date
                        };
        
                        Ti.API.info('Saving item from health provider', item);
                        Alloy.Globals.Steps.writeSingle(item);
                    }
                });
    
                Ti.App.Properties.setString('lastSyncDate', to.toISOString());
            })
            .finally(function() {
                Ti.API.info('HealthProvider hiding spinner.');
                Alloy.Globals.Spinner.hide();
            });
    }
}

//module.exports.getProvider = getProvider;
module.exports.importSteps = importSteps;