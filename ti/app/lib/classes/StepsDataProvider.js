/**
 * @file Steps Data Provider
 * @description Provides an abstraction of the local steps data by providing a global in-memory data store (this reads all data from
 * 	the backbone collection on load). When items are added via this model, they are added to both the in-memory data store as well as the
 *  local SQlite persistent storage.
 *
 * @summary Use this provider class to interact with the steps Alloy model. This should be treated as a singleton - only one global
 * instance should ever exist for performance reasons.
 *
 * @requires helpers/FormatHelper
 * @requires helpers/DateTimeHelper
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
	if (model) {
		this.id = model.get('id');
		this.activityPart = model.get('activity_part');
		this.moderateMins = model.get('moderate');
		this.vigorousMins = model.get('vigorous');
		this.stepsWalked = model.get('steps_walked');
		this.stepsTotal = model.get('steps_total');
		
		this.stepsDate = new Date(model.get('steps_date'));
		
		if (!DateTimeHelper.isValidDate(this.stepsDate)) {
			Ti.API.error(this.stepsDate + " is not a steps date. Setting to undefined. Source = " + model.get('steps_date'));
			this.stepsDate = undefined;
		}
		else {
			this.stepsDate = DateTimeHelper.localise(this.stepsDate);	
		}
		
		//the engine doesn't like creating a date via ticks
		//passed to the constructor. Do it this way.
		
		this.lastUpdatedOn = new Date();
		this.lastUpdatedOn.setTime(model.get('last_updated_on'));
		
		this.lastSyncedOn = new Date();
		this.lastSyncedOn.setTime(model.get('last_synced_on'));

		if (!DateTimeHelper.isValidDate(this.lastUpdatedOn)) {
			Ti.API.error(this.lastUpdatedOn + " is not a lastUpdatedOn date. Setting to undefined. Source = " + model.get('last_updated_on'));
			this.lastUpdatedOn = undefined;
		}

		if (!DateTimeHelper.isValidDate(this.lastSyncedOn)) {
			Ti.API.error(this.lastSyncedOn + " is not a valid lastSyncedOn date. Setting to undefined. Source = " + model.get('last_synced_on'));
			this.lastSyncedOn = undefined;
		}
	} else {
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
	if (json) {
		this.id = json.id;
		this.activity_part = json.activityPart;
		this.moderate = json.moderateMins;
		this.vigorous = json.vigorousMins;
		this.steps_walked = json.stepsWalked;
		this.steps_total = json.stepsTotal;

		this.steps_date = FormatHelper.formatDate(json.stepsDate);
		
		//Store ticks for lastUpdatedOn and lastSyncedOn, to catch the time
		//component
		if(DateTimeHelper.isValidDate(json.lastUpdatedOn)) {
			this.last_updated_on = json.lastUpdatedOn.getTime();			
		}
		
		if(DateTimeHelper.isValidDate(json.lastSyncedOn)) {
			this.last_synced_on = json.lastSyncedOn.getTime();	
		}
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
 * @description Converts a JSON model to a backbone model. Useful for sending data to the Api endpoint.
 */
StepsDataProvider.prototype.toBackboneModel = function(jsonModel) {
	return new BackboneModel(jsonModel);
};

/**
 * @description Performs a full load of local data. This should only be called with good reason. It is the equivalent of calling the constructor a
 * second time.
 */
StepsDataProvider.prototype.load = function() {
	collection.fetch();
	//Call fetch here so the collection doesn't get cached by module caching

	this.models = [];
	var me = this;

	var data = collection.toArray();

	data.forEach(function(item) {
		var jsonItem = new JsonModel(item);
		me.models.push(jsonItem);
	});
};

/**
 * @description Reads a single step record from local storage for the provided date.
 * @param {Date} dateObj The date to search for
 * @returns {Object} A steps object logged for the supplied date or null if it wasn't found.
 */
StepsDataProvider.prototype.readByDate = function(dateObj) {
	return this.models.filter(function(item) {
		if(item.stepsDate === undefined) {
			Ti.API.warn("Reading single record from local storage: Steps date not set", item);
			return false;
		}

		return DateTimeHelper.areDatesEqual(item.stepsDate, dateObj);
	})[0];
};

/**
 * @description Returns an array of step records which either have not been synced yet or have been updated since their last sync.
 * @returns {Array.<Object>} An array of step records
 */
StepsDataProvider.prototype.readWhereNeedsSyncing = function() {
	return this.models.filter(function(item) {
		if (!item.lastSyncedOn) {
			//The item has never been synced. We need to sync this item.
			return true;
		}
		else if(!item.lastUpdatedOn) {
			//The item has never been updated. Skip it.
			return false;
		} 
		else if (item.lastUpdatedOn.getTime() > item.lastSyncedOn.getTime()) {
			//The item has been updated since it was last synced. Sync it again.
			return true;
		} else {
			return false;
		}
	});
};

/**
 * @description Returns an array of step records aggregated for the provided year. The array will have 12 elements, one for each month, from January to December.
 * @param {Number} year The year to get the data for. Eg: 2017
 * @returns {Array.<Number>} An array of step records for the each month of the provided year
 */
StepsDataProvider.prototype.readByMonthForYear = function(year) {
	var data = new Array(12);
	for (var i = 0; i < data.length; i++) {
		data[i] = 0;
	}

	this.models.forEach(function(item) {
		if (item.stepsDate.getFullYear() === year) {
			data[item.stepsDate.getMonth()] += item.stepsTotal;
		}
	});

	return data;
};

/**
 * @description Returns an array of step records aggregated for the provided month and year. The array will have 31 elements, one for each possible day of a month.
 * @param {Number} month The month to get the data for. Eg: 1 for January, 12 for December.
 * @param {Number} year The year to get the data for. Eg: 2017
 * @returns {Array.<Number>} An array of steps records for each day of the provided month/year.
 */
StepsDataProvider.prototype.readByDayForMonth = function(month, year) {
	var data = new Array(31);
	for (var i = 0; i < data.length; i++) {
		data[i] = 0;
	}

	this.models.forEach(function(item) {
		if (item.stepsDate.getFullYear() === year && item.stepsDate.getMonth() === month - 1) {
			data[item.stepsDate.getDate() - 1] += item.stepsTotal;
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
	var instance = Alloy.createModel('log', backboneModel);

	if (instance.isValid()) {
		if(instance.isNew()) {
			instance.save();
			//Ti.API.debug("Saved model to local storage. Id = " + instance.id);
			
			model.id = instance.id;
			this.models.push(model);	
		}
		else {
			//Ti.API.debug("Model exists. Updating...");
			instance.save();
			
			var bFound = false;
			for(var i = 0; i < this.models.length; i++) {
				if(DateTimeHelper.areDatesEqual(this.models[i].stepsDate, model.stepsDate)) {
					var existingId = this.models[i].id;
					this.models[i] = model;
					this.models[i].id = existingId; //keep the PK in tact	
					
					bFound = true;				
				}
			}
			
			if(!bFound) {
				Ti.API.error("Instance already exists, but couldn't find it in memory storage");				
			}
			else {
				//Ti.API.debug("Updated model");
			}
		}
	} else {
		Ti.API.error("Model not valid. Destroying");
		instance.destroy();
	}

	return backboneModel;
};

/**
 * @description Finds the record with the modelId, sets lastSyncedOn to now and calls writeSingle.
 */
StepsDataProvider.prototype.saveAsSynced = function(modelId) {
	var record = this.models.filter(function(item) {
		return item.id == modelId;
	})[0];
	
	record.lastSyncedOn = new Date(); //now 
	
	this.writeSingle(record); //save the record
};

/**
 * @description Removes all logged steps from local storage.
 */
StepsDataProvider.prototype.removeAll = function() {
	Ti.API.debug("Removing all models");
	collection.deleteAll();
	this.models = [];
};

/**
 * @description Calculates the sum of all steps synced so far and returns it.
 * @returns {Number}
 */
StepsDataProvider.prototype.readLifeTimeSteps = function() {
	var sum = 0;
	
	this.models.forEach(function(item) {
		sum += item.stepsTotal;
	});
	
	return sum;
};

/**
 * @description Returns an array of years that have been logged 
 */
StepsDataProvider.prototype.readYears = function() {
	var years = [];
	
	this.models.forEach(function(item) {
		var tmp = item.stepsDate.getFullYear();
		
		if (years.indexOf(tmp) === -1) {
			years.push(tmp);
		}
	});
	
	return years;
};

StepsDataProvider.prototype.readMonthsAndYears = function() {
	var monthYears = [];
	
	this.models.forEach(function(item) {
		var tmpYear = item.stepsDate.getFullYear();
		var tmpMonth = item.stepsDate.getMonth();
		
		var obj = {
			year: tmpYear,
			month: tmpMonth	
		};
		
		if (monthYears.indexOf(obj) === -1) {
			monthYears.push(obj);
		}
	});
	
	return monthYears;
};

StepsDataProvider.prototype.readMonthsForYear = function(year) {
	var months = [];
	
	this.models.forEach(function(item) {
		var tmpMonth = item.stepsDate.getMonth();
		var tmpYear = item.stepsDate.getFullYear();
		
		if (months.indexOf(tmpMonth) === -1 && tmpYear === year) {
			months.push(tmpMonth);
		}
	});
	
	return months;
};

module.exports = StepsDataProvider;
