/**
 * @file Steps Provider
 * @description Provides an abstraction of the steps endpoint interactions via the API helper
 * @summary Use this provider class to interact with the steps API endpoint instead of communicating with it manually.
 * @require helpers/APIHelper
 * @require q
 * @exports StepsProvider
 * @todo This class is incomplete. It needs to read from and write from local storage (waiting for a StepsDataProvider to do this) instead of sending dummy data.
 */

var APIHelper = require("helpers/APIHelper");
var q = require('q');

/**
 * @class
 * @description Creates a new instance of the Steps Provider
 */
function StepsProvider() { }

/**
 * @description Gets the steps from the steps API endpoint. This will recur so long as there are additional pages in the API response.
 * @todo incomplete
 * @param {Number} page The page to fetch.
 * @returns Promise
 */
StepsProvider.prototype.getSteps = function(page) {
	var defer = q.defer();
	
	function onSuccess(e) {
		Ti.API.info("Get steps success", JSON.stringify(e));
		
		//TODO: Add/update results to local storage
		//TODO: Recur while e.next is not null
		
		defer.resolve(e);
	}
	
	function onFail(e) {
		defer.reject(e);
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	APIHelper.get({
		message:	"Fetching steps...",
		url:		"steps/",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
	
	return defer.promise;
};

/**
 * @description Recursively posts to the steps endpoint for each of the step records in local storage that have not been synced to the server yet
 * (or have been updated since the last sync)
 * @todo incomplete
 * @returns Promise
 */
StepsProvider.prototype.postSteps = function() {
	var defer = q.defer();
	
	function onSuccess(e) {
		Ti.API.info("Post steps success", JSON.stringify(e));
		
		defer.resolve();
	}
	
	function onFail(e) {
		Ti.API.info("Post steps fail", JSON.stringify(e));
		
		defer.reject(e.errorMessage);
	}
	
	//TODO: Get all steps in local storage which have NOT been synced yet
	//Recur until they've all been posted
	var data = {
		//user: Alloy.Globals.UserURL,
		steps_date: "2016-10-12",
		steps_total: "9999",
		//steps_walked: "9999",
		//moderate: "9999",
		//vigorous: "9999",
		activity_part: "9999"
	};
	
	Ti.API.info("Posting", data);
	
	APIHelper.post({
		message:	"Sending steps...",
		url: 		"steps/",
		headers: [{
			key: 	"Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		
		data: 		data,
		success: 	onSuccess,
		fail: 		onFail
	});	
	
	return defer.promise;
};

module.exports = StepsProvider;