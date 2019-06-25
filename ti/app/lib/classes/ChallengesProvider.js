/**
 * @file Challenges Provider
 * @description Provides an abstraction of the challenges endpoint interactions via the API helper. Also handles paging.
 * @summary Use this provider class to interact with the challenges API endpoint instead of communicating with it manually.
 * @require helpers/APIHelper
 * @require q
 * @exports ChallengesProvider
 */

var APIHelper = require('helpers/APIHelper');
var q = require('q');

/**
 * @class
 * @description Creates a new instance of the Challenges Provider
 */
function ChallengesProvider() { }

/**
 * @description Gets the challenges from the challenges API endpoint. This will recur so long as there are additional pages in the API response.
 * @param {Number} page The page to fetch.
 * @returns Promise
 */
ChallengesProvider.prototype.getChallenges = function(page) {
	var defer = q.defer();
	var me = this;
	
	if(page === undefined) {
		page = 1;
	}
	
	function onSuccess(e) {
		Ti.API.info("Get challenges success. Page = ", page);

		if(e.next) {
			setTimeout(function() {
				//Sleep a little so we don't flood the network
				
				me.getChallenges(page + 1).then(function(nextResponse) {
					e.results = e.results.concat(nextResponse.results);
					//Note: The JS engine here doesn't support Array.push.apply.
					
					Ti.API.info("Page " + page + " resolving. Records: " + e.results.length);
					defer.resolve(e);
				});
			}, 200);
		}
		else {
			Ti.API.info("Last page finished: " + page);
			defer.resolve(e);
		}
	}
	
	function onFail(e) {
		defer.reject(e);
	}
	
	APIHelper.get({
		url:		"challenges/?page=" + page,
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
	
	return defer.promise;
};

ChallengesProvider.prototype.getCurrentChallenge = function() {
	var deferer = q.defer();

	function onSuccess(e) {
		Ti.API.info("getCurrentChallenge success");

		// Pass back the top result (the most recent)
		deferer.resolve(e.results[0]);
	}
	
	function onFail(e) {
		deferer.reject(e);
	}
	
	APIHelper.get({
		url:		"challenges/",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});

	return deferer.promise;
};

ChallengesProvider.prototype.getTask = function(taskUrl) {
	var deferer = q.defer();

	function onSuccess(e) {
		Ti.API.info("getTask success");
		Ti.API.info(JSON.stringify(e));
		
		deferer.resolve(e);
	}
	
	function onFail(e) {
		deferer.reject(e);
	}
	
	APIHelper.get({
		url: taskUrl,
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});

	return deferer.promise;
};

ChallengesProvider.prototype.fetch = function() {
	return this.getChallenges(); //return the promise returned by getChallenges
};

module.exports = ChallengesProvider;