var APIHelper = require('helpers/APIHelper');
var APIHelper = require("helpers/APIHelper");
var q = require('q');

function StepsProvider(container) {
	this.container = container;
}

StepsProvider.prototype.getSteps = function(page) {
	var defer = q.defer();
	
	function onSuccess(e) {
		Ti.API.info("Get steps success", JSON.stringify(e));
		
		//TODO: Add results to local storage
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
	
	//TODO: Make these real
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