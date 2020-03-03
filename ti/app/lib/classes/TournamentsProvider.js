/**
 * @file Tournaments Provider
 * @description Provides an abstraction of the new tournaments endpoint. Also handles paging.
 * @summary Use this provider class to interact with the new tournaments endpoint.
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

function sortDates(a, b) {    
    if(a.tournamentStartDate.getTime() > b.tournamentStartDate.getTime()) {
        return -1;
    }
    else if(a.tournamentStartDate.getTime() < b.tournamentStartDate.getTime()) {
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

    get('tournaments', page)
        .then(function onSuccess(result) {
            // Timeouts
            timeouts = result.timeouts.map(function(item) {
                // Timeout tournaments without a name should show the number of weeks.
                if(!item.name || !item.name.length) {
                    item.name = item.weeks + " Week Time Out Tournament";
                }

                var teamSteps = 0;
                var userTeam = item.timeout_teams.filter(function(e) {
                    return e.is_users_team;
                })[0];

                if(userTeam) {
                    teamSteps = userTeam.total_steps;
                }

                // Flatten out the response
                return {
                    teamName: item.name,
                    tournamentId: item.id,
                    tournamentName: item.name,
                    tournamentWeeks: item.weeks,
                    tournamentStartDate: new Date(item.date_started),
                    tournamentEndDate: new Date(item.end_date),
                    type: 'timeout',
                    teams: item.timeout_teams,
                    teamSteps: teamSteps
                    //hasNextPage: !!(timeouts.next) //True if truthy, false if falsy.
                };
            })
            results = results.concat(timeouts);

            // Races
            races = result.races.map(function(item) {
                var teamSteps = 0;
                var userTeam = item.race_teams.filter(function(e) {
                    return e.is_users_team;
                })[0];

                if(userTeam) {
                    teamSteps = userTeam.total_steps;
                }

                return {
                    teamName: item.name,
                    tournamentId: item.id,
                    tournamentName: item.tournament.title,
                    tournamentTime: item.tournament.default_time,
                    tournamentTotalSteps: item.tournament.total_steps,
                    tournamentDistance: item.tournament.distance_metres,
                    tournamentStartDate: new Date(item.date_started),

                    teamSteps: teamSteps,
                    type: 'race',
                    active: item.tournament.active,
                    teams: item.race_teams,
                    //hasNextPage: true, // debug: uncomment this to force it to show a load more button when there aren't any.
                    //hasNextPage: !!(races.next)
                };
            })
            .filter(function(item) { return item.active == 1; });         
            results = results.concat(races);

            results.sort(sortDates);
            deferer.resolve(results);
        }, function onFail(e) {
            deferer.reject(e);
        });

    return deferer.promise;
};

module.exports = TournamentsProvider;