var q = require('q');

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
        return q.resolve();
    }
    else {
        var lastSyncDate = Ti.App.Properties.getString('lastSyncDate', null);
		var from = new Date(lastSyncDate);
        var to = new Date(); // today
        var twoWeeksAgo = new Date(to.getTime() - (1000*60*60*24*14)); // milliseconds * seconds * minutes * hours * days

        Ti.API.info('Importing steps from: ', from);
        Ti.API.info('2 weeks ago:', twoWeeksAgo);

        if (from < twoWeeksAgo) {
            Ti.API.info('Showing spinner');
            Alloy.Globals.Spinner.show('Importing steps...');
        }

        return provider
            .querySteps(from, to)
            .then(function(response) {
                Ti.API.info('HealthProvider processing results.');

                response.result = JSON.parse(response.result);
                response.result.forEach(element => {
                    var date = new Date(element.eventDate);
                    var steps = element.steps;
    
                    var item = Alloy.Globals.Steps.readByDate(date); // find an existing steps record for that date
                    if (!item) {
                        item = {
                            activityPart: 0,
                            moderateMins: 0,
                            vigorousMins: 0,
                            stepsWalked: 0,
                            stepsTotal: 0,
                            stepsDate: date
                        };
                    }
                    
                    // we need to increment both of these fields; stepsWalked so that it's editable in the form,
                    // stepsTotal so that it shows up in the list
                    item.stepsWalked += steps; 
                    item.stepsTotal += steps;
    
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