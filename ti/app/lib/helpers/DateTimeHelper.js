/**
 * @file DateTimeHelper
 * @description Provides static helper functions for performing Date/Time operations
 * @module
 */

 /////////////////////////////////////////////////////////////////////////////////////////////

module.exports.addWeeks = addWeeks;
module.exports.areDatesEqual = areDatesEqual;
module.exports.getCurrentMonthName = getCurrentMonthName;
module.exports.getDateLabel = getDateLabel;
module.exports.getDayBefore = getDayBefore;
module.exports.getIndexFromMonthName = getIndexFromMonthName;
module.exports.getMinutesBetween = getMinutesBetween;
module.exports.getDaysBetween = getDaysBetween;
module.exports.getMonthLabel = getMonthLabel;
module.exports.getMonthNameFromIndex = getMonthNameFromIndex;
module.exports.getShortDateLabel = getShortDateLabel;
module.exports.getTimeBetween = getTimeBetween;
module.exports.isValidDate = isValidDate;
module.exports.localise = localise;
module.exports.parseLocal = parseLocal;
module.exports.today = today;
module.exports.now = now;
module.exports.midnight = midnight;

/////////////////////////////////////////////////////////////////////////////////////////////

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = MINUTES_PER_HOUR * 24;
const MINUTES_PER_WEEK = MINUTES_PER_DAY * 7;

 /**
 * Adds a number of weeks to a date and returns the result.
 * @param {Date} dateObj The source date to add weeks to. Must be a valid date object.
 * @param {Number} weeks The number of weeks to add.
 */
function addWeeks(dateObj, weeks) {
	var result = new Date();
	result.setTime(dateObj.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000)); // 7 days, 24 hours, 60 minutes, 60 seconds, 1000ms = weeks in milliseconds
	return result;
}

/**
 * Returns a bool indicating whether two dates can be considered equal. i.e - do they hold the same day, month and year value.
 * @param {Date} date1 
 * @param {Date} date2 
 */
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
 * Returns the name of the current month.
 * @returns {String}
 */
function getCurrentMonthName() {
	var m = new Date().getMonth();
	return getMonthNameFromIndex(m);
}

/**
 * Computes and returns a label that represents the given date. Eg: Mon 24 Feb.
 * @param {Date} dateObj A date object for the date to process
 * @param {Boolean} includeYear Whether or not this function should include the year at the end of the string
 * @returns {String} The date label
 */
function getDateLabel(dateObj, includeYear) {
	// Ti.API.info('Getting date label for: ' + dateObj);

	var dayNames = [
		"Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"
	];
	
	var monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];	
	
	var days = dateObj.getDate();
	var str = dayNames[dateObj.getDay()] + " " + 
			  (days < 10? "0" + days : days) + " " +
			  monthNames[dateObj.getMonth()];
			  
	if(includeYear) {
		str += " " + dateObj.getFullYear();
	}
			  
	return str;
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
 * Returns a (zero-based) index for a given month name. This is case-insensitive.
 * @param {String} strName The name of the month to search for. This can't be abbreviated.
 */
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
		if(monthNames[i].toLowerCase() === strName.toLowerCase()) {
			return i;
		}
	}	
};

/**
 * Computes and returns the number of minutes between two dates. If firstDate is prior to secondDate, 0 is returned.
 * @param {*} firstDate 
 * @param {*} secondDate 
 */
function getMinutesBetween(firstDate, secondDate) {	
	var diff = firstDate.getTime() - secondDate.getTime();

	if(diff < 0) {
		return 0;
	}

	return Math.round(diff / 1000 / 60); // convert to seconds, then minutes. 
}

/**
 * Computes and returns the number of days between two dates. If firstDate is prior to secondDate, 0 is returned.
 * Rounded to the nearest whole number
 * @param {*} firstDate 
 * @param {*} secondDate 
 */
function getDaysBetween(firstDate, secondDate) {
	Ti.API.info(`Get days between ${firstDate} and ${secondDate}`);

	var totalMins = getMinutesBetween(firstDate, secondDate);
	Ti.API.info('minutes diff: ' + totalMins);

	var days = totalMins / MINUTES_PER_DAY;
	Ti.API.info('days diff: ' + days);

	//var weeksRemainder = totalMins % MINUTES_PER_WEEK;
	//Ti.API.info('total weeks: ')  
	//var daysRemainder = weeksRemainder % MINUTES_PER_DAY;
	  
	return Math.round(days);
}
/**
 * Computes and returns the time between two dates in a formatted string. Eg: 2 weeks, 3 days, 6 hours, 32 minutes.
 * @param {Date} firstDate 
 * @param {Date} secondDate 
 */
function getTimeBetween(firstDate, secondDate, showHours) {
	if (showHours === undefined) {
		showHours = true;
	}

	Ti.API.info('getTimeBetween', firstDate, secondDate);

	var totalMins = getMinutesBetween(firstDate, secondDate);
  
	var weeks = Math.floor(totalMins / MINUTES_PER_WEEK);
  	var weeksRemainder = totalMins % MINUTES_PER_WEEK;
  
  	var days = Math.floor(weeksRemainder / MINUTES_PER_DAY);
  	var daysRemainder = weeksRemainder % MINUTES_PER_DAY;
  
	Ti.API.info('Days remainder: ' + daysRemainder);
	
  	var hours = Math.ceil(daysRemainder / MINUTES_PER_HOUR);
     
  	var ret = weeks + ' weeks';
  
  	if(days > 0 || hours > 0) {
  		ret += ', ' + days + ' days';
  	}
  
  	if(hours > 0 && showHours) {
  		ret += ', ' + hours + ' hours';
  	}
  
	return ret;
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
 * Returns a month name from January - December based on the provided index. See also: getIndexFromMonthName.
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

/**
 * Parses a date string and returs a localised date object.
 * @param {String} dateStr A date string
 */
function parseLocal(dateStr) {
	var obj = new Date(dateStr);
	return localise(obj);
}

/**
 * Returns a localised instance of the current date and time
 */
function today() {
	//return localise(new Date());
	return midnight();
}

function now() {
	return new Date();
}

/**
 * Returns a date instance set to midnight, today.
 * Eg: if today is 25/08/2021, it will return 25/08/2021 00:00:00.
 */
function midnight() {
	var now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); // hours, minutes, seconds, milliseconds = 0
}