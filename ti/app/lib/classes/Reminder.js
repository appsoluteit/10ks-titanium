var FormatHelper = require("helpers/FormatHelper");

function Reminder() { }

/**
 * Returns an array containing the defined reminder days.
 * @returns {Array[Object]}
 */
Reminder.prototype.getReminderDays = function() {
	var activeDays = [];

	if (Ti.App.Properties.hasProperty("ReminderRepeat")) {
		var reminderRepeat = Ti.App.Properties.getString("ReminderRepeat");
		var objReminderRepeat = JSON.parse(reminderRepeat);

		activeDays = objReminderRepeat.filter(function(e) {
			return e.active;
		});
	}

	return activeDays;
};

/**
 * Returns a JS DateTime for the next reminder date at the specified reminder time.
 */
Reminder.prototype.getNextReminderDateTime = function() {
	/*	There are four different cases to handle when finding the next reminder (in order):
	 * 
	 * 	1. Today is the next active day and its before the cutoff time. 
	 * 		Eg: The next reminder time is Sunday at 9pm and its currently Sunday at 8pm.
	 * 
	 *	2. The next active day is after today. 
	 * 		Eg: the next reminder time is Tuesday and today is Monday.
	 * 
	 * 	3. The next active day is before today.
	 * 		eG: The next reminder time is Tuesday and its wednesday, so we should remind NEXT tuesday.
	 * 
	 * 	4. The next active day is today and its after the cutoff time.
	 * 		Eg: The next reminder time is Sunday at 9pm and its currently Sunday at 10pm. So remind NEXT sunday.
	 */
	
	function makeDate(dayObj, timeObj) {
		dayObj.setHours(timeObj.getHours());
		dayObj.setMinutes(timeObj.getMinutes());

		Ti.API.info("Made date: ", dayObj.toString());
		return dayObj;
	}

	var now = new Date();
	var curDayOfWeek = now.getDay() + 1;
	
	var activeDays = this.getReminderDays();
	var reminderTime = FormatHelper.unformatTime(Ti.App.Properties.getString("ReminderTime"));

	//If checking today, make sure we haven't passed the time cutoff
	var isBeforeCutoffTime = (now.getHours() < reminderTime.getHours()) || (now.getHours() === reminderTime.getHours() && now.getMinutes() < reminderTime.getMinutes());

	console.log("Current day of week: " + curDayOfWeek);
	console.log("Reminder time: ", reminderTime.toString());
	console.log("Is before cutoff time today: " + isBeforeCutoffTime);
	console.log("Active days: ", activeDays);

	var activeDayForToday = activeDays.filter(function(ele) {
		return ele.dayOfWeek === curDayOfWeek;	
	})[0];
	
	var activeDaysAfterToday = activeDays.filter(function(ele) {
		return ele.dayOfWeek > curDayOfWeek;
	});
	
	var activeDaysBeforeToday = activeDays.filter(function(ele) {
		return ele.dayOfWeek < curDayOfWeek;
	});
	
	if(activeDayForToday && isBeforeCutoffTime) {
		console.log("Today is the next active reminder day and we are before the cutoff time");
		return makeDate(now, reminderTime);		
	}
	else if(activeDaysAfterToday.length > 0) {
		console.log("The next active reminder today is after today");
		
		var ele = activeDaysAfterToday[0];
		var nextDay = new Date();
		//Add days to the date object based on the difference between today and the day in settings
		nextDay.setDate(now.getDate() + (ele.dayOfWeek - curDayOfWeek));
		return makeDate(nextDay, reminderTime);		
	}
	else if(activeDaysBeforeToday.length > 0) {
		console.log("The next active reminder today is before today, next week");
		
		var ele = activeDaysBeforeToday[0];
		var nextDay = new Date();
		//Add days to the date object based on the difference between today and the day in settings
		nextDay.setDate(now.getDate() + (ele.dayOfWeek + 7));
		return makeDate(nextDay, reminderTime);	
	}
	else if(activeDayForToday && !isBeforeCutoffTime) {
		console.log("The next active reminder day is today, next week");
		
		var nextDay = new Date();
		//Add days to the date object based on the difference between today and the day in settings
		nextDay.setDate(now.getDate() + (curDayOfWeek + 6));
		return makeDate(nextDay, reminderTime);	
	}
	else {
		console.error("Couldn't find active days");
		throw "Couldn't find active days";
	}
	
	/*
	for (var i = 0; i < activeDays.length; i++) {
		var ele = activeDays[i];
		console.log("Active day day of week: " + ele.dayOfWeek);

		if (ele.dayOfWeek === curDayOfWeek && isBeforeCutoffTime) {
			console.log("Today is the next active reminder day");
			return makeDate(now, reminderTime);
		} else if (ele.dayOfWeek > curDayOfWeek) {
			var nextDay = new Date();

			//Add days to the date object based on the difference between today and the day in settings
			nextDay.setDate(now.getDate() + (ele.dayOfWeek - curDayOfWeek));

			return makeDate(nextDay, reminderTime);
		} else if (ele.dayOfWeek === curDayOfWeek && !isBeforeCutoffTime) {

		}
	}
	*/
};

module.exports = Reminder;