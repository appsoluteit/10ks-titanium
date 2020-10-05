/**
 * @file Reminder Repeat Setting
 * @description Abstracts logic related to the reminder repeat setting. Use this class instead of manipulating the App Property directly.
 * @require helpers/FormatHelper
 * @exports ReminderRepeatSetting
 */

/*
 * Note: There is a 1 day difference between the dayOfWeek value saved in the ReminderRepeat
 * property and the result of calling getDay() on a JavaScript object. This difference is due to a one day
 * discrepency between the implementation of getDay() and Appcelerator's Calendar.
 * 
 * JS Dates have Sunday starting at 0, while Appcelerator has them start at 1.
 * 
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
 * http://docs.appcelerator.com/platform/latest/#!/api/daysOfTheWeekDictionary
 */

var DateTimeHelper = require('helpers/DateTimeHelper');
var FormatHelper = require("helpers/FormatHelper");

/**
 * @description Creates an instance of ReminderRepeatSetting and sets the App Property that it will use.
 * @class
 */
function ReminderRepeatSetting() { 
	this.PropertyName = 'ReminderRepeat';	
}

/**
 * Returns an array containing the defined reminder days.
 * @returns {Array.<Object>}
 */
ReminderRepeatSetting.prototype.get = function() {
	Ti.API.debug("Getting reminder days");
	
	var activeDays = [];

	if (this.isSet()) {
		var reminderRepeat = Ti.App.Properties.getString(this.PropertyName);
		
		Ti.API.debug("Repeat proprty: ", reminderRepeat);
		
		var objReminderRepeat = JSON.parse(reminderRepeat);

		if(!objReminderRepeat) {
			return activeDays;
		}
		
		activeDays = objReminderRepeat.filter(function(e) {
			return e.active;
		});
	}

	return activeDays;
};

/**
 * Sets the reminder days.
 * @param reminderDays An array containing name/active attributes.
 */
ReminderRepeatSetting.prototype.set = function(reminderDays) {
	Ti.App.Properties.setString(this.PropertyName, JSON.stringify(reminderDays));
};

/**
 * @returns {Boolean} Indicates whether or not reminder days are already saved.
 */
ReminderRepeatSetting.prototype.isSet = function() {
	return Ti.App.Properties.hasProperty(this.PropertyName);
};

/**
 * Returns a JS DateTime for the next reminder date at the specified reminder time.
 * @param startFrom Date The date to start calculations from. This will most likely be today.
 */
ReminderRepeatSetting.prototype.getNextReminderDateTime = function(startFrom) {
	/*	There are four different cases to handle when finding the next reminder (in order):
	 * 
	 * 	1. Today is the next active day and its before the cutoff time. 
	 * 		Eg: The next reminder time is Sunday at 9pm and its currently Sunday at 8pm.
	 * 
	 *	2. The next active day is after today. 
	 * 		Eg: the next reminder time is Tuesday and today is Monday.
	 * 
	 * 	3. The next active day is before today (next week)
	 * 		eG: The next reminder time is Tuesday and its wednesday, so we should remind NEXT tuesday.
	 * 
	 * 	4. The next active day is today and its after the cutoff time.
	 * 		Eg: The next reminder time is Sunday at 9pm and its currently Sunday at 10pm. So remind NEXT sunday.
	 */
	
	if(!startFrom) {
		throw "startFrom is a required parameter";	
	}
	
	function makeDate(dayObj, timeObj) {
		dayObj.setHours(timeObj.getHours());
		dayObj.setMinutes(timeObj.getMinutes());

		Ti.API.debug("Made date: ", dayObj.toString());
		return dayObj;
	}

	var now = startFrom;
	var curDayOfWeek = now.getDay() + 1;
	
	var activeDays = this.get();
	var reminderTime = FormatHelper.unformatTime(Ti.App.Properties.getString("ReminderTime"));

	//If checking today, make sure we haven't passed the time cutoff
	var isBeforeCutoffTime = (now.getHours() < reminderTime.getHours()) || 
							 (now.getHours() === reminderTime.getHours() && now.getMinutes() < reminderTime.getMinutes());

	Ti.API.debug("Now", now.toString());
	Ti.API.debug("Current day of week: " + curDayOfWeek);
	Ti.API.debug("Reminder time: ", reminderTime.toString());
	Ti.API.debug("Is before cutoff time today: " + isBeforeCutoffTime);
	Ti.API.debug("Active days: ", activeDays);

	var activeDayForToday = activeDays.filter(function(ele) {
		return ele.dayOfWeek === curDayOfWeek;	
	})[0];
	
	var activeDaysAfterToday = activeDays.filter(function(ele) {
		return ele.dayOfWeek > curDayOfWeek;
	})[0];
	
	var activeDaysBeforeToday = activeDays.filter(function(ele) {
		return ele.dayOfWeek < curDayOfWeek;
	})[0];
	
	if(activeDayForToday && isBeforeCutoffTime) {
		Ti.API.debug("Today is the next active reminder day and we are before the cutoff time");
		return makeDate(now, reminderTime);		
	}
	else if(activeDaysAfterToday) {
		var ele = activeDaysAfterToday;
		
		Ti.API.debug("The next active reminder today is after today:", ele);
		
		var nextDay = now;
		
		//Add days to the date object based on the difference between today and the day in settings
		nextDay.setDate(now.getDate() + (ele.dayOfWeek - curDayOfWeek));
		return makeDate(nextDay, reminderTime);		
	}
	else if(activeDaysBeforeToday) {
		var ele = activeDaysBeforeToday;
		
		Ti.API.debug("The next active reminder today is before today, next week:", ele);
		
		var nextDay = now;
		
		//Add days to the date object based on the difference between today and the day in settings plus one week
		nextDay.setDate(now.getDate() + (ele.dayOfWeek - curDayOfWeek) + 7);
		return makeDate(nextDay, reminderTime);	
	}
	else if(activeDayForToday && !isBeforeCutoffTime) {
		var ele = activeDayForToday;
		
		Ti.API.debug("The next active reminder day is today, next week:", ele);
		
		var nextDay = now;
		
		//Add days to the date object for today, next week
		nextDay.setDate(now.getDate() + 7);
		return makeDate(nextDay, reminderTime);	
	}
	else {
		Ti.API.error("Couldn't find active days");
		throw "Couldn't find active days";
	}
};

/**
 * Returns an array of scheduled reminders from now until the endDate.
 */
ReminderRepeatSetting.prototype.getScheduledRemindersBetween = function(startDate, endDate) {
	Ti.API.debug("Getting reminders between " + startDate.toString() + " and " + endDate.toString());
	
	function isReminderDay(needle, haystack) {
		return haystack.filter(function(e) { return e.dayOfWeek === needle; }).length > 0;
	}
	
	function isBeforeCutoffTime(time, cutoff) {
		//If checking today, make sure we haven't passed the time cutoff
		var isBeforeCutoffTime = (time.getHours() < cutoff.getHours()) || 
								 (time.getHours() === cutoff.getHours() && time.getMinutes() < cutoff.getMinutes());	
								 
		return isBeforeCutoffTime;		
	}
	
	function makeScheduledTime(day, reminderTime) {
		var reminder = DateTimeHelper.localise(new Date(day.getTime()));
		
		reminder.setHours(reminderTime.getHours());
		reminder.setMinutes(reminderTime.getMinutes());
		
		return reminder;
	}
	
	var now = startDate;
	var currentDay = DateTimeHelper.localise(new Date(now.getTime()));
	var reminders = [];
	var activeDays = this.get();
	var reminderTime = FormatHelper.unformatTime(Ti.App.Properties.getString("ReminderTime"));
	//Ti.API.debug("Reminder time: ", reminderTime.toString());	
	
	do {
		//Ti.API.debug("Checking " + now.toString());
		var curDayOfWeek = now.getDay() + 1;
			
		if(currentDay.getTime() === now.getTime() && isBeforeCutoffTime(now, reminderTime)) {
			if(isReminderDay(curDayOfWeek, activeDays)) {
				Ti.API.debug("Today (" + now.toString() + ") is a reminder day and its before the cutoff");
				reminders.push(makeScheduledTime(now, reminderTime));
			}
		}
		else if(isReminderDay(curDayOfWeek, activeDays)) {
			Ti.API.debug(now.toString() + " is a reminder day");
			reminders.push(makeScheduledTime(now, reminderTime));
		}
		
		now.setDate(now.getDate() + 1); //add a day
	}
	while(now <= endDate);
	
	return reminders;
};

/**
 * Returns true if the reminders are due to expire before the cutoff. Only applicable on Android, since 
 * the reminders don't recur indefinitely.
 */
ReminderRepeatSetting.prototype.willExpire = function(now) {
	if(!Ti.App.Properties.hasProperty("ReminderExpiryDate")) {
		return false;	
	}
	
	var reminderExpiry = Ti.App.Properties.getString("ReminderExpiryDate");
		
	if(reminderExpiry) {
		Ti.API.debug("Reminder expiry: " + reminderExpiry);
		
		reminderExpiry = DateTimeHelper.parseLocal(reminderExpiry); //yyyy-mm-dd should work in the constructor
		var today = DateTimeHeler.localise(new Date(now.getTime()));
		today.setDate(Alloy.Globals.ReminderExpiryBufferDays); //Add days to today based on the config setting
		
		Ti.API.debug("Buffer days: " + Alloy.Globals.ReminderExpiryBufferDays);
		Ti.API.debug("Today plus buffer days: " + today.toString());
		
		return today.getTime() >= reminderExpiry.getTime();
	}
	else {
		return false;
	}
};

module.exports = ReminderRepeatSetting;