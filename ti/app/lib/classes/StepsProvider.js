/**
 * @file Steps Provider
 * @description Provides an abstraction of the steps endpoint interactions via the API helper. Also handles paging.
 * @summary Use this provider class to interact with the steps API endpoint instead of communicating with it manually.
 * @require helpers/APIHelper
 * @require q
 * @exports StepsProvider
 */

var APIHelper = require('helpers/APIHelper');
var q = require('q');

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
StepsProvider.prototype.getSteps = function(page, onProgress) {
	var defer = q.defer();
	var me = this;
	
	if(page === undefined) {
		page = 1;
	}
	
	function onSuccess(e) {
		Ti.API.info("Get steps success. Page = ", page);
		//Ti.API.info("Response", e);
		
		var pageSize = 100;
		var percentComplete = Math.round(((page * pageSize) / e.count) * 100);
		if(percentComplete > 100) {
			percentComplete = 100;
		}
		
		if(typeof(onProgress) === 'function') {
			onProgress("Downloading..." + percentComplete + "%");		
		}
		
		if(e.next) {
			setTimeout(function() {
				//Sleep a little so we don't flood the network. Try to keep the delay minimal though, for accounts with
				//lots of data.
				
				me.getSteps(page + 1, onProgress).then(function(nextResponse) {
					e.results = e.results.concat(nextResponse.results);
					//Note: The JS engine here doesn't support Array.push.apply.
					
					Ti.API.info("Page " + page + " resolving. Records: " + e.results.length);
					defer.resolve(e);
				});
			}, 100); 
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
StepsProvider.prototype.postSteps = function(models, count, onProgress) {
	var defer = q.defer();
	var me = this;
	
	var jsonModel = models[models.length - 1];
	
	var data = Alloy.Globals.Steps.toBackboneModel(jsonModel);
	
	if(typeof(onProgress) === 'function') {
		Ti.API.info("Posted " + models.length + " of " + count);
		
		var percentComplete = Math.round((count - models.length) / count * 100);
		onProgress("Uploading..." + percentComplete + "%");		
	}
	
	models.pop();
		
	function onSuccess(e) {		
		Alloy.Globals.Steps.saveAsSynced(jsonModel.id);
		
		if(models.length === 0) {
			Ti.API.info("All models posted. Resolving");
			defer.resolve();			
		}
		else {
			me.postSteps(models, count, onProgress).then(function onSuccess() {
				Ti.API.info("Resolving instance: " + models.length);
				defer.resolve();
			});
		}
	}
	
	function onFail(e) {
		Ti.API.info("Post steps fail", JSON.stringify(e));
		defer.reject(e.errorMessage);
	}
	
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

StepsProvider.prototype.sync = function(rootView, options) {
    var me = this;
    
    function getStepsSuccess(steps) {
    	Ti.API.info("Get steps success. Count = " + steps.count + ", Total = " + steps.results.length);
    	
    	if(typeof(options.onProgress === 'function')) {
    		options.onProgress("Saving steps...");	
    	}
    	
     	steps.results.forEach(function(item) {
     		var json = {
     			stepsWalked: item.steps_walked,
     			stepsTotal: item.steps_total,
     			activityPart: item.activity_part,
     			vigorousMins: item.vigorous,
     			moderateMins: item.moderate,
     			stepsDate: new Date(item.steps_date),
     			lastSyncedOn: new Date(),
     			lastUpdatedOn: null
     			//lastUpdatedOn: new Date()
     		};

			//Overwrite any existing items
			var existingItem = Alloy.Globals.Steps.readByDate(json.stepsDate);
			if(existingItem) {
				json.id = existingItem.id;	
			}
			
     		Alloy.Globals.Steps.writeSingle(json);	
     	});
     	
     	options.onComplete();
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
				
				Ti.API.info("Failed to get steps Invalid token");
     		}
     		else {
     			Ti.API.info("Unable to get steps. Unknown reason");
     		}
     		
     		options.onComplete(reason.detail);	
     	}
     	else {
			Alloy.createWidget('com.mcongrove.toast', null, {
				text: 'Failed to get steps. Reason: ' + reason,
				duration: 2000,
				view: rootView,
				theme: 'error'
			});	
			
			Ti.API.info("Failed to get steps. Reason: " + reason);
			options.onComplete(reason);
     	}   	
    }
    
    function postStepsSuccess() {
    	Ti.API.info("Post steps success");
    	
		me.getSteps(1, options.onProgress)
		  .then(getStepsSuccess, getStepsFail);
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
		
		options.onComplete(reason);
    }
    
    //Post first. Keep the server up-to-date. Then we can trust whatever is returned by the server's GET response.  
 	var toPost = Alloy.Globals.Steps.readWhereNeedsSyncing();
 	Ti.API.info("Models to post: " + toPost.length);
 	
 	if(toPost.length > 0) {
	    this.postSteps(toPost, toPost.length, options.onProgress)
	    	.then(postStepsSuccess, postStepsFail);
 	}
 	else {
 		this.getSteps(1, options.onProgress)
 			.then(getStepsSuccess, getStepsFail);
 	}
};

module.exports = StepsProvider;