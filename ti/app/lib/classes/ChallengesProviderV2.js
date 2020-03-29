/**
 * @file Challenges Provider V2
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
function ChallengesProviderV2() { }

ChallengesProviderV2.prototype.load = function() {
	// Return an object containing the last joined challenge (if any), plus the
	// available challenge to join (if any).

	function getLastJoinedChallenge() {
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
	}

	function getTask(taskUrl) {
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
	}

	function getAvailableChallenge() {
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
	}

	return getLastJoinedChallenge()
		.then(function(challenge) {
			Ti.API.info('ChallengesProviderV2 got last joined challenge');

			return getTask(challenge.task)
				.then(function(task) {
					Ti.API.info('ChallengesProviderV2 got task');

					return q.resolve({
						challenge: challenge,
						task: task
					});
				});
		})
		.then(function(lastJoinedChallenge) {
			Ti.API.info('ChallengesProviderV2 got last joined challenge and task');

			return getAvailableChallenge()
				.then(function(availableChallenge) {
					Ti.API.info('ChallengesProviderV2 got available challenge');

					return q.resolve({
						lastJoinedChallenge: lastJoinedChallenge,
						availableChallenge: availableChallenge
					})
				})
		})
		.catch(function(err) {
			reject(err);
		});
};

ChallengesProviderV2.prototype.join = function(taskId) {
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

module.exports = ChallengesProviderV2;