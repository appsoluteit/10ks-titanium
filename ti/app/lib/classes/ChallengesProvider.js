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
		url:		"challenges_current/?version=2",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});

	return deferer.promise;
};

ChallengesProvider.prototype.getActiveTask = function() {
	var deferer = q.defer();

	function onSuccess(e) {
		Ti.API.info("getActiveTask success");

		// Only active results should be returned from the API now,
		// but leave this filter here just in case.
		var results = e.results.filter(function(r) {
			return r.is_active;
		});

		var activeTask = results[0];
		Ti.API.info(activeTask);

		// Pass back the top result (the most recent) active task
		deferer.resolve(activeTask);
	}
	
	function onFail(e) {
		deferer.reject(e);
	}
	
	APIHelper.get({
		url:		"challenge_participant_current",
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
		
		var parts = taskUrl.split('/').filter(function(e) { return e.length; });
		var taskId = parts[parts.length - 1];

		e.url = taskUrl;
		e.id = taskId;

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

ChallengesProvider.prototype.getProgress = function() {
	// Create requires task_id (int) and show_rank (boolean)

	var deferred = q.defer();

	function onSuccess(e) {
		Ti.API.info('ChallengesProvider getProgress success. Response:', e);

		var result = e.results[0]; // take the first item in the response
		deferred.resolve(result);
	}

	function onFail(e) {
		Ti.API.error(e);
		deferred.reject(e);
	}

	APIHelper.get({
		headers: [{
			key: 	"Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		message:    'Loading progress...',
		url: 		'challenge_participant/',
		success: 	onSuccess,
		fail:		onFail
	});

	return deferred.promise;
};

ChallengesProvider.prototype.join = function(taskId) {
	// Create requires task_id (int) and show_rank (boolean)

	var deferred = q.defer();

	function onSuccess(e) {
		deferred.resolve(e);
	}

	function onFail(e) {
		Ti.API.error(e);
		deferred.reject(e);
	}

	var data = {
		task_id: taskId,
		show_rank: true
	};

	APIHelper.post({
		headers: [{
			key: 	"Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		message:    'Joining Challenge...',
		url: 		'challenge_participant/',
		data: 		data,
		success: 	onSuccess,
		fail:		onFail
	});

	return deferred.promise;
};

module.exports = ChallengesProvider;