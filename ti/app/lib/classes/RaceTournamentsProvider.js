/**
 * @file Race Tournaments Provider
 * @description Provides an abstraction of the race tournaments endpoint interactions via the API helper. Also handles paging.
 * @summary Use this provider class to interact with the race tournaments API endpoint instead of communicating with it manually.
 * @require helpers/APIHelper
 * @require q
 * @exports RaceTournamentsProvider
 */

var APIHelper = require('helpers/APIHelper');
var q = require('q');

/**
 * @class
 * @description Creates a new instance of the Race Tournaments Provider
 */
function RaceTournamentsProvider() { }

/**
 * @description Gets the races from the race tournaments API endpoint. This will recur so long as there are additional pages in the API response.
 * @param {Number} page The page to fetch.
 * @returns Promise
 */
RaceTournamentsProvider.prototype.getRaces = function(page) {
	var defer = q.defer();
	var me = this;
	
	if(page === undefined) {
		page = 1;
	}
	
	function onSuccess(e) {
		Ti.API.info("Get races success. Page = ", page);
		
		if(e.next) {
			setTimeout(function() {
				//Sleep a little so we don't flood the network
				
				me.getRaces(page + 1).then(function(nextResponse) {
					e.results = e.results.concat(nextResponse.results);
					//Note: The JS engine here doesn't support Array.push.apply.
					
					Ti.API.info("Page " + page + " resolving. Records: " + e.results.length);
					defer.resolve(e);
				});
			}, 200);
		}
		else {
			defer.resolve(e);
		}
	}
	
	function onFail(e) {
		defer.reject(e);
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	APIHelper.get({
		url:		"tournament_races/?page=" + page,
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
	
	return defer.promise;
};

RaceTournamentsProvider.prototype.fetch = function() {	
	return this.getRaces();
};

module.exports = RaceTournamentsProvider;