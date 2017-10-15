/**
 * @file DateTimeHelper
 * @description Provides static helper functions for performing Date/Time operations
 * @module
 */

/**
 * Returns a month name from January - December based on the provided index.
 * @param {Integer} index A number 0-11 that indicates the month.
 * @returns {String}
 */
function getMonthNameFromIndex(index) {
	var monthNames = [
		"January", 
		"February", 
		"March", 
		"April", 
		"May", 
		"June", 
		"July", 
		"August", 
		"September", 
		"October", 
		"November", 
		"December"
	];

	return monthNames[index];
}

function getIndexFromMonthName(strName) {
	var monthNames = [
		"January", 
		"February", 
		"March", 
		"April", 
		"May", 
		"June", 
		"July", 
		"August", 
		"September", 
		"October", 
		"November", 
		"December"
	];
	
	for(var i = 0; i < monthNames.length; i++) {
		if(monthNames[i] === strName) {
			return i;
		}
	}	
};

/**
 * Returns the name of the current month.
 * @returns {String}
 */
function getCurrentMonthName() {
	var m = new Date().getMonth();
	return getMonthNameFromIndex(m);
}

/**
 * Computes and returns a label that represents the given date. Eg: Mon Feb 24.
 * @param {Date} dateObj A date object for the date to process
 * @param {Boolean} includeYear Whether or not this function should include the year at the end of the string
 * @returns {String} The date label
 */
function getDateLabel(dateObj, includeYear) {
	var dayNames = [
		"Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"
	];
	
	var monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];	
	
	var days = dateObj.getDate();
	var str = dayNames[dateObj.getDay()] + " " + 
			  monthNames[dateObj.getMonth()] + " " + 
			  (days < 10? "0" + days : days);
			  
	if(includeYear) {
		str += " " + dateObj.getFullYear();
	}
			  
	return str;
}

/**
 * Computes and returns a label that represents the date in dd/MM/yyyy format. Eg: 01/02/2013
 * @param {Date} dateobj A date object
 * @returns {String} The date label
 */
function getShortDateLabel(dateObj) {
	if(isValidDate(dateObj)) {
		return ("0" + dateObj.getDate()).slice(-2) 
		     + "/"
		     + ("0" + (dateObj.getMonth()+1)).slice(-2)
		     + "/"
		     + dateObj.getFullYear();
	}
	else {
		Ti.API.error("Invalid date supplied to getShortDateLabel: ", dateObj);
		return "";
	}
}

/**
 * Computes and returns a label that represents the month for the given date. Eg: January 2017
 * @param {Date} dateObj A date to operate on
 * @returns {String} The month/year label
 */
function getMonthLabel(dateObj) {	
	var month = getMonthNameFromIndex(dateObj.getMonth());
	var year = dateObj.getFullYear();
	
	return month + " " + year;
}

/**
 * Gets a Date Object for the day before dateObj
 * @param {Date} dateObj The input date
 * @returns {Date} A date object set 1 day before dateObj
 */
function getDayBefore(dateObj) {
	return new Date(dateObj.getTime() - (24*60*60*1000));
}

/**
 * Determines whether or not dateObj is a valid date
 * @param {Object} dateObj A date to examine
 */
function isValidDate(dateObj) {
	if ( Object.prototype.toString.call(dateObj) === "[object Date]" ) {
		if ( isNaN( dateObj.getTime() ) ) {
			return false;
  		}
  		else {
  			return true;
  		}
	}
	else {
		return false;
	}
}

function areDatesEqual(date1, date2) {
	if(!isValidDate(date1) || !isValidDate(date2)) {
		return false;
	}
	
	var match = date1.getDate() === date2.getDate() &&
		   		date1.getMonth() === date2.getMonth() &&
		   		date1.getFullYear() === date2.getFullYear();	
		   		
	return match;
}

/**
 * Returns a date localised to the device timezone.
 */
function localise(dateObj) {	
	var localTimezoneMins = dateObj.getTimezoneOffset();
	//Ti.API.info("Local timezone hours: " + localTimezoneMins / 60);
	
	var localTimezoneMs = localTimezoneMins * 60000; //in milliseconds
	//Ti.API.info("Local timezone ms: " + localTimezoneMs);
	
	//Undo whatever time adjustment the JS engine will do to the local time.
	//Eg: if the local timezone is UTC-6, apply t - (-6) = t + 6 = UTC+0 time.
	var localTime = new Date(dateObj.getTime() + localTimezoneMs);
    
    //Ti.API.info("Original date", dateObj);
    //Ti.API.info("Local date", localTime);
    
    return localTime;
}

module.exports.getMonthNameFromIndex = getMonthNameFromIndex;
module.exports.getIndexFromMonthName = getIndexFromMonthName;
module.exports.getCurrentMonthName = getCurrentMonthName;
module.exports.getShortDateLabel = getShortDateLabel;
module.exports.getDateLabel = getDateLabel;
module.exports.getMonthLabel = getMonthLabel;
module.exports.getDayBefore = getDayBefore;
module.exports.isValidDate = isValidDate;
module.exports.areDatesEqual = areDatesEqual;
module.exports.localise = localise;