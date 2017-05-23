/**
 * @file Steps Data Provider
 * @description Provides an abstraction of the Alloy model for simplifying handling of the local steps data
 * @summary Use this provider class to interact with the steps Alloy model
 * @requires helpers/FormatHelper
 * @requires helpers/DateTimeHelper
 * 
 */

var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');

var collection = Alloy.createCollection('log');

/**
 * @class
 * @description Represents a JSON model with attributes in camelCase and dates represented by JS Date objects. 
 * @param {BackboneModel} model An instance of `BackboneModel` loaded from local storage (Optional)
 * @see http://backbonejs.org/#Model-get
 */
function JsonModel(model) {
	//As far as I can tell, `get` isn't a data-bound operation so it shouldn't 
	//carry much of a performance overhead. It seems as though all of the data is "fetched" from the local DB
	//via Collecton::fetch. See: http://backbonejs.org/#Collection-fetch.
	if(model) {
		this.alloyId = model.get('alloy_id');
		this.activityPart = model.get('activity_part');
		this.moderateMins = model.get('moderate');
		this.vigorousMins = model.get('vigorous');
		this.stepsWalked = model.get('steps_walked');
		this.stepsTotal = model.get('steps_total');
		this.stepsDate = new Date(model.get('steps_date'));
		this.lastUpdatedOn = new Date(model.get('last_updated_on'));
		this.lastSyncedOn = new Date(model.get('last_synced_on'));
		
		if(!DateTimeHelper.isValidDate(this.stepsDate)) {
			this.stepsDate = undefined;
		}
		
		if(!DateTimeHelper.isValidDate(this.lastUpdatedOn)) {
			this.lastUpdatedOn = undefined;
		}
		
		if(!DateTimeHelper.isValidDate(this.lastSyncedOn)) {
			this.lastSyncedOn = undefined;
		}	
	}
	else {
		this.activityPart = 0;
		this.moderateMins = 0;
		this.vigorousMins = 0;
		this.stepsWalked = 0;
		this.stepsTotal = 0;
	}
}

/**
 * @class
 * @description Represents a Backbone model that can be written to local storage.
 * @param {JsonModel} An instance of JsonModel (Optional)
 */
function BackboneModel(json) {
	if(json) {
		this.alloy_id = json.alloyId;
		this.activity_part = json.activityPart;
		this.moderate = json.moderateMins;
		this.vigorous = json.vigorousMins;
		this.steps_walked = json.stepsWalked;
		this.steps_total = json.stepsTotal;
			
		this.steps_date = FormatHelper.formatDate(json.stepsDate);
		this.last_updated_on = FormatHelper.formatDate(json.lastUpdatedOn);
		this.last_synced_on = FormatHelper.formatDate(json.lastSyncedOn);	
	}
}

/**
 * @class
 * Initialises the data provider and calls `this.load()`, which results in re-fetching data from local storage. To avoid unnecessary database operations,
 * try to reduce the number of instances of the steps data provider you create.
 */
function StepsDataProvider() {
	this.load();
}

/**
 * @description Performs a full load of local data. Call this to get changes after saving. It is the equivalent of calling the constructor a 
 * second time.
 */
StepsDataProvider.prototype.load = function() {
	collection.fetch();	//Call fetch here so the collection doesn't get cached by module caching
	
	this.models = [];
	var me = this;
	
	var data = collection.toArray();
	//Ti.API.info("Collecton", JSON.stringify(data));
	
	data.forEach(function(item) {
		//Ti.API.info("Item in collection:", JSON.stringify(item));
		
		var jsonItem = new JsonModel(item);
		
		//Ti.API.info("Converted item: ", JSON.stringify(jsonItem));
		
		me.models.push(jsonItem);
	});
};

/**
 * @description Reads a single step record from local storage for the provided date.
 * @param {Date} dateObj The date to search for
 * @returns {Object} A steps object logged for the supplied date or null if it wasn't found.
 */
StepsDataProvider.prototype.readSingle = function(dateObj) {	
	return this.models.filter(function(item) {
		if(!item.stepsDate) {
			Ti.API.warn("Steps date not set");
			return false;
		}
		
		//Ti.API.info("Current item:", item.stepsDate.getDate(), item.stepsDate.getMonth(), item.stepsDate.getFullYear());
		//Ti.API.info("Looking for:", dateObj.getDate(), dateObj.getMonth(), dateObj.getFullYear());
		
		var match = item.stepsDate.getDate() === dateObj.getDate() &&
			   		item.stepsDate.getMonth() === dateObj.getMonth() &&
			   		item.stepsDate.getFullYear() === dateObj.getFullYear();
			   		
		//Ti.API.info("Match:", match);
		
		return match;
	})[0];
};

/**
 * @description Returns an array of step records which either have not been synced yet or have been updated since their last sync.
 * @returns {Array.<Object>} An array of step records
 */
StepsDataProvider.prototype.readWhereNeedsSyncing = function() {
	return this.models.filter(function(item) {
		if(!item.lastUpdatedOn || !item.lastSyncedOn) {
			//lastUpdatedOn or lastSyncedOn are undefined. We need to sync this item.
			return true;	
		}
		else if(item.lastUpdatedOn.getTime() > item.lastSyncedOn.getTime()) {
			//The item has been updated since it was last synced. Sync it again.
			return true;	
		}
		else {
			return false;
		}
	});
};

/**
 * @description Returns an array of step records aggregated for the provided year. The array will have 12 elements, one for each month, from January to December.
 * @param {Number} year The year to get the data for
 * @returns {Array.<Number>} An array of step records for the each month of the provided year
 */
StepsDataProvider.prototype.readByMonthForYear = function(year) {	
	var data = [0,0,0,0,0,0,0,0,0,0,0,0];
	
	this.models.forEach(function(item) {
		if(item.stepsDate.getFullYear() === year) {
			data[item.stepsDate.getMonth()] += item.stepsTotal;	
		}
	});
	
	return data;
};

/**
 * @description Writes a single step record to local storage.
 * @param {JsonModel} model The object model to write to storage.
 * @returns {BackboneModel} The backbone model written to storage.
 */
StepsDataProvider.prototype.writeSingle = function(model) {
	var backboneModel = new BackboneModel(model);
		
	Ti.API.debug("Writing model", JSON.stringify(backboneModel));
	
	var logInstance = Alloy.createModel('log', backboneModel);
	
	if(logInstance.isValid()) {
		Ti.API.debug("Model valid. Saving");
		logInstance.save();
	}
	else {
		Ti.API.error("Model not valid. Destroying");
		logInstance.destroy();
	}	
	
	return backboneModel;
};

/**
 * @description Removes all logged steps from local storage.
 */
StepsDataProvider.prototype.removeAll = function() {
	Ti.API.debug("Removing all models");
	collection.deleteAll();
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