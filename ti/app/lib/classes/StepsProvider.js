/**
 * @file Steps Provider
 * @description Provides an abstraction of the steps endpoint interactions via the API helper. Also handles paging.
 * @summary Use this provider class to interact with the steps API endpoint instead of communicating with it manually.
 * @require helpers/APIHelper
 * @require q
 * @exports StepsProvider
 * @todo This class is incomplete. It needs to read from and write from local storage (waiting for a StepsDataProvider to do this) instead of sending dummy data.
 */

var APIHelper = require('helpers/APIHelper');
var StepsDataProvider = require('classes/StepsDataProvider');
var q = require('q');
	
var stepsDataProvider = new StepsDataProvider();

/**
 * @class
 * @description Creates a new instance of the Steps Provider
 */
function StepsProvider() { }

/**
 * @description Gets the steps from the steps API endpoint. This will recur so long as there are additional pages in the API response.
 * @param {Number} page The page to fetch.
 * @returns Promise
 */
StepsProvider.prototype.getSteps = function(page) {
	var defer = q.defer();
	var me = this;
	
	if(page === undefined) {
		page = 1;
	}
	
	function onSuccess(e) {
		Ti.API.info("Get steps success. Page = ", page);
		//Ti.API.info("Response", e);
		
		if(e.next) {
			setTimeout(function() {
				//Sleep a little so we don't flood the network
				
				me.getSteps(page + 1).then(function(nextResponse) {
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
		url:		"steps/?page=" + page,
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
StepsProvider.prototype.postSteps = function(models) {
	var defer = q.defer();
	var me = this;
	
	if(models === undefined) {
		models = stepsDataProvider.readWhereNeedsSyncing();
		Ti.API.info("Read models: " + models.length);
	}
	
	function onSuccess(e) {
		Ti.API.info("Post steps success", JSON.stringify(e));
		
		if(models.length === 0) {
			Ti.API.info("All models posted. Resolving");
			defer.resolve();			
		}
		else {
			me.postSteps(models).then(function() {
				Ti.Api.info("Resolving instance: " + models.length);
				defer.resolve();
			});
		}
	}
	
	function onFail(e) {
		Ti.API.info("Post steps fail", JSON.stringify(e));
		defer.reject(e.errorMessage);
	}
	
	var jsonModel = models[models.length - 1];
	Ti.API.info("JSON model: ", jsonModel);
	
	var data = stepsDataProvider.toBackboneModel(jsonModel);
	Ti.API.info("Backbone Model:", data);
	
	models.pop();
	
	Ti.API.info("Posting model. # remaining: " + models.length);
	
	APIHelper.post({
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

StepsProvider.prototype.sync = function(rootView, callback) {
    var me = this;
    
    function getStepsSuccess(steps) {
    	Ti.API.info("Get steps success. Count = " + steps.count + ", Total = " + steps.results.length);
    	
     	steps.results.forEach(function(item) {
     		var json = {
     			stepsWalked: item.steps_walked,
     			stepsTotal: item.steps_total,
     			activityPart: item.activity_part,
     			vigorousMins: item.vigorous,
     			moderateMins: item.moderate,
     			stepsDate: new Date(item.steps_date),
     			lastSyncedOn: new Date(),
     			lastUpdatedOn: new Date()
     		};
     		
     		stepsDataProvider.writeSingle(json);
     	});
     	   
     	var toPost = stepsDataProvider.readWhereNeedsSyncing();
     	Ti.API.info("Models to post: " + toPost.length);
     	//Ti.API.info(toPost);
     	
     	if(toPost.length > 0) {
	     	//Sleep for a little so we don't flood the network 	
	     	setTimeout(function() {
	     		return me.postSteps(toPost);  
	     	}, 200);  		
     	}
    }
    
    function getStepsFail(reason) {
    	Ti.API.info("Get steps fail");
    	
     	if(reason.detail) {
     		if(reason.detail === 'Invalid token.') {
				Alloy.createWidget('com.mcongrove.toast', null, {
					text: 'Sesson expired. Please log in again.',
					duration: 2000,
					view: rootView,
					theme: 'error'
				});	
				
				throw "InvalidToken";
				
				Ti.API.info("Unable to sync. Invalid token");
     		}
     		else {
     			Ti.API.info("Unable to sync. Unknown reason");
     		}	
     	}
     	else {
			Alloy.createWidget('com.mcongrove.toast', null, {
				text: 'Failed to get steps. Reason: ' + reason,
				duration: 2000,
				view: rootView,
				theme: 'error'
			});	
			
			Ti.API.info("Failed to get steps. Reason: " + reason);
     	}   	
    }
    
    function postStepsSuccess() {
    	Ti.API.info("Post steps success");
    	
    	setTimeout(function() {
    		//If we stack these widgets too fast, things can break.
			//Alloy.createWidget('com.mcongrove.toast', null, {
			//	text: 'Steps synced successfully!',
			//	duration: 2000,
			//	view: rootView,
			//	theme: 'success'
			//});
			
			Ti.API.info("Sync success. Invoking callback.");
			callback();    
    	}, 1000);	
    }
    
    function postStepsFail(reason) {
    	Ti.API.info("Post steps fail");
    	
		Alloy.createWidget('com.mcongrove.toast', null, {
			text: 'Failed to post steps. Reason: ' + reason,
			duration: 2000,
			view: rootView,
			theme: 'error'
		});			 
		
		Ti.API.info("Failed to post steps. " + reason);    	
    }
    
	this.getSteps()
	    .then(getStepsSuccess, getStepsFail)
	    .then(postStepsSuccess, postStepsFail);
};

module.exports = StepsProvider;