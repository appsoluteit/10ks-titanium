/**
 * @file Tournaments Provider
 * @description Provides an abstraction of both the timeout tournaments endpoint and race tournaments endpoint
 * interactions via the API helper. Also handles paging.
 * @summary Use this provider class to interact with the timeout/race tournaments API endpoints instead of communicating with them manually.
 * @require helpers/APIHelper
 * @require q
 * @exports TournamentsProvider
 */

var APIHelper = require('helpers/APIHelper');
var q = require('q');
//Array.prototype.sort = require('polyfills/array.prototype.sort');

/**
 * @class
 * @description Creates a new instance of the Tournaments Provider
 */
function TournamentsProvider() { }

function get(endpoint, page) {
	var defer = q.defer();
	
	if(page === undefined) {
		page = 1;
	}
	
	function onSuccess(e) {
		defer.resolve(e);
	}
	
	function onFail(e) {
		defer.reject(e);
	}
	
	APIHelper.get({
		url:		endpoint + "/?page=" + page,
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
	
	return defer.promise;
}

function getTimeouts(page) {
    return get('tournament_timeouts', page);
}

function getRaces(page) {
    return get('tournament_races', page);
}

function sortDates(a, b) {
    Ti.API.info('Sorting between ' + a + ' and ' + b);
    
    if(a.tournamentStartDate.getTime() < b.tournamentStartDate.getTime()) {
        return -1;
    }
    else if(a.tournamentStartDate.getTime() > b.tournamentStartDate.getTime()) {
        return 1;
    }
    else {
        return 0;
    }
}

/**
 * Fetches a single page of both tournaments and races and joins them. 
 * @param {*} page 
 */
TournamentsProvider.prototype.fetch = function(page) {
    var deferer = q.defer();
    var results = [];

    getTimeouts(page)
        .then(function onSuccess(timeouts) {
            Ti.API.info(timeouts);

            timeouts = timeouts.results.map(function(item) {
                // Flatten out the response
                return {
                    teamName: item.team.name,
                    tournamentName: item.team.tournament.name,
                    tournamentWeeks: item.team.tournament.weeks,
                    tournamentStartDate: new Date(item.team.tournament.date_started),
                    tournamentSteps: item.steps,
                    type: 'timeout',
                    //hasNextPage: true,
                    hasNextPage: !!(timeouts.next) //True if truthy, false if falsy.
                };
            })
            results = results.concat(timeouts);


            return getRaces(page);
        }, function onFail(e) {
            deferer.reject(e);
        })
        .then(function onSuccess(races) {
            Ti.API.info(races);

            races = races.results.map(function(item) {
                return {
                    teamName: '',
                    tournamentName: item.team.tournament.tournament.description.substring(0, 9) + '...' ,
                    tournamentTime: item.team.tournament.tournament.default_time,
                    tournamentTotalSteps: item.team.tournament.tournament.total_steps,
                    tournamentDistance: item.team.tournament.tournament.distance_metres,
                    tournamentStartDate: new Date(item.team.tournament.date_started),
                    tournamentSteps: item.steps,
                    type: 'race',
                    active: item.team.tournament.tournament.active,
                    //hasNextPage: true, // debug: uncomment this to force it to show a load more button when there aren't any.
                    hasNextPage: !!(races.next)
                };
            })
            .filter(function(item) { return item.active == 1; });
            
            results = results.concat(races);

            Ti.API.info(results);
            Ti.API.info('Preparing to sort...');

            results.sort(sortDates);

            Ti.API.info('sorting results finished');

            deferer.resolve(results);
        }, function onFail(e) {
            deferer.reject(e);
        });

    return deferer.promise;
};

module.exports = TournamentsProvider;