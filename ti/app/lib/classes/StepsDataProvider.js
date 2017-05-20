/**
 * @file Steps Data Provider
 * @description Provides an abstraction of the Alloy model for simplifying handling of the local steps data
 * @summary Use this provider class to interact with the steps Alloy model
 * @requires helpers/FormatHelper
 * @requires helpers/DateTimeHelper
 * @todo
 */

var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');

var collection = Alloy.createCollection('log');
collection.fetch();

/**
 * Converts a backbone model to a JSON model
 */
function backboneToJson(model) {
	var json = {
		alloyId: model.get('alloy_id'),
		
		activityPart: model.get('activity_part'),
		moderateSteps: model.get('moderate'),
		vigorousSteps: model.get('vigorous'),
		stepsWalked: model.get('steps_walked'),
		stepsTotal: model.get('steps_total'),
		
		stepsDate: new Date(model.get('steps_date')),
		lastUpdatedOn: new Date(model.get('last_updated_on')),
		lastSyncedOn: new Date(model.get('last_synced_on'))
	};
	
	if(!DateTimeHelper.isValidDate(json.stepsDate)) {
		json.stepsDate = undefined;
	}
	
	if(!DateTimeHelper.isValidDate(json.lastUpdatedOn)) {
		json.lastUpdatedOn = undefined;
	}
	
	if(!DateTimeHelper.isValidDate(json.lastSyncedOn)) {
		json.lastSyncedOn = undefined;
	}
	
	return json;
}

function jsonToBackbone(json) {
	var model = {
		alloy_id: json.alloyId,
		
		activity_part: json.activityPart,
		moderate: json.moderateSteps,
		vigorous: json.vigorousSteps,
		steps_walked: json.stepsWalked,
		steps_total: json.stepsTotal,
		
		steps_date: FormatHelper.formatDate(json.stepsDate),
		last_updated_on: FormatHelper.formatDate(json.lastUpdatedOn),
		last_synced_on: FormatHelper.formatDate(json.lastSyncedOn)
	};
	
	return model;
}

function StepsDataProvider() {
	this.models = [];
	var me = this;
	
	var data = collection.toArray();
	Ti.API.info("Collecton", JSON.stringify(data));
	
	data.forEach(function(item) {
		Ti.API.info("Item in collection:", JSON.stringify(item));
		
		var jsonItem = backboneToJson(item);
		
		Ti.API.info("Converted item: ", JSON.stringify(jsonItem));
		
		me.models.push(jsonItem);
	});
}

StepsDataProvider.prototype.readSingle = function(dateObj) {
	//Ti.API.info("Finding match for: ", dateObj);
	//Ti.API.info("Models: ", this.models);
	
	return this.models.filter(function(item) {
		if(!item.stepsDate) {
			Ti.API.info("Steps date not set");
			return false;
		}
		
		Ti.API.info("Current item:", item.stepsDate.getDate(), item.stepsDate.getMonth(), item.stepsDate.getFullYear());
		Ti.API.info("Looking for:", dateObj.getDate(), dateObj.getMonth(), dateObj.getFullYear());
		
		var match = item.stepsDate.getDate() === dateObj.getDate() &&
			   		item.stepsDate.getMonth() === dateObj.getMonth() &&
			   		item.stepsDate.getFullYear() === dateObj.getFullYear();
			   		
		Ti.API.info("Match:", match);
		
		return match;
	})[0];
};

StepsDataProvider.prototype.writeSingle = function(model) {
	model.steps_date = FormatHelper.formatDate(model.steps_date);
	
	var logInstance = Alloy.createModel('log', model);
	
	if(logInstance.isValid()) {
		Ti.API.info("Model valid. Saving");
		logInstance.save();
	}
	else {
		Ti.API.error("Model not valid. Destroying");
		logInstance.destroy();
	}	
};

//1. readForDate(DateTime) : StepLog
//2. readUpdatedSince(DateTime) : StepLog[]
//3. readByMonth(...)

/*
 * StepsDataProvider.where(function(item) {
 * 	   DateTimeHelper.isSameDay(item.StepsDate, someDay);
 * });
 * 
 * StepsDataProvider.where(function(item) {
 * 	   item.LastUpdatedOn.getTime() >= item.LastSyncedOn.getTime()
 * });
 */

module.exports = StepsDataProvider;