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

function importSteps() {
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

        // We'll need to localise these dates, after all. For GMT +10, they should all be yesterday at 14:00 UTC time.
        var lastSyncDateStr = Ti.App.Properties.getString('lastSyncDate', null);

		var from = new Date(lastSyncDateStr); // This should always be an ISO string, so okay to init with new Date(isoString)
        var to = DateTimeHelper.now();
        var twoWeeksAgo = new Date(to.getTime() - (1000*60*60*24*14)); // milliseconds * seconds * minutes * hours * days

        Ti.API.info('last sync date: ', lastSyncDateStr);
        Ti.API.info('Importing steps from: ', from);
        Ti.API.info('2 weeks ago:', twoWeeksAgo);
        Ti.API.info('Importing steps to: ', to);

        if (from < twoWeeksAgo) {
            // If the last import was more than two weeks ago, show a spinner as this may take a while.
            Ti.API.info('Showing spinner');
            Alloy.Globals.Spinner.show('Importing steps...');
        }

        return provider
            .querySteps(from, to)
            .then(function(response) {
                // If the result is a string, assume its JSON and parse it
                if (typeof(response.result) === 'string') {
                    response.result = JSON.parse(response.result);
                }

                Ti.API.info('HealthProvider processing results. Count = ' + response.result.length);

                response.result.forEach(element => {
                    var date = DateTimeHelper.parseLocal(element.eventDate); // Use parseLocal to make this relative to your timezone. 
                                                                             // Eg: for GMT +10, this should be at 1400 the previous day with a +10 timezone offset
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
                            stepsWalked: 0,
                            stepsTotal: 0,
                            stepsDate: date
                        };
                    }

                    // We need to increment each time, as the step records imported from the health provider may have multiple entries for each day
                    item.stepsWalked += steps; 
                    item.stepsTotal += steps;
                    item.lastUpdatedOn = new Date(); // Update the lastUpdatedOn timestamp, so it appears red and will be synced to the API

                    Ti.API.info('Saving item from health provider', item);
                    Alloy.Globals.Steps.writeSingle(item);
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