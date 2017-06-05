/**
 * @file Calendar Factory
 * @description Provides an abstraction of setting reminders between iOS (using Ti.Calendar.Event and Ti.Calendar.RecurrenceRule) and Android (using multiple event instances)
 * module.
 * @summary A factory for creating different instances of a calendar object depending on the running OS.
 * @require classes/ReminderRepeatSetting
 * @require q
 * @exports create
 * @example You should request permission before adding / removing a reminder, like:
 * 
 * reminderInstance.requestPermission()
 * 				   .then(function success() {
 * 						return reminderInstance.getCalendar();
 * 				    }, function fail(reason) {
 * 						//error handling
 * 					})
 * 					.then(...)
 */

var q = require('q');
var ReminderRepeatSetting = require("classes/ReminderRepeatSetting");
var reminderRepeatSetting = new ReminderRepeatSetting();

function validate() {
	if(!reminderRepeatSetting.isSet()) {
		throw "Reminder Repeat Setting not set. Cannot add reminder.";	
	}
	
	if(!Ti.App.Properties.hasProperty("ReminderLabel")) {
		throw "Reminder label not set. Cannot add reminder";
	}	
}

function requestPermission() {
	var	defer = q.defer();
	
	if(Ti.Calendar.hasCalendarPermissions()) {
		defer.resolve();
	}
	else {
		Ti.Calendar.requestCalendarPermissions(function(e) {
			if(e.success) {
				defer.resolve();
			}
			else {
				defer.reject(e.error);
			}
		});
	}
	
	return defer.promise;
}

function removeReminderData() {
	Ti.App.Properties.removeProperty("HasReminder");
	Ti.App.Properties.removeProperty("ReminderEventID");		
	
	if(Ti.Platform.osname === "android") {
		Ti.App.Properties.removeProperty("ReminderExpiryDate");		
	}
}

/**
 * @class AndroidReminder
 * @summary The Android Reminder 
 * @description Until Titanium implements the setRecurrence method of Android's Calendar.Event object, we will need to create multiple events; one for each reminder.
 * We also can't remove created events until the `event.remove()` method is supported.
 * @see https://developers.google.com/resources/api-libraries/documentation/calendar/v3/java/latest/com/google/api/services/calendar/model/Event.html
 * @see http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Calendar.Event
 * @see http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Calendar.Event-method-remove
 */
function AndroidReminder() { }

/**
 * @description Adds reminders to the calendar from now until one month in the future. When approaching this time, the app will prompt the user to re-save 
 * their reminders from the home controller. 
 * @param {Ti.Calendar} calendar The calendar to add the event to. Call `getCalendar()` to obtain this.
 * @returns Promise
 */
AndroidReminder.prototype.add = function(calendar) {
	function createEvent(calendar, time) {
		Ti.API.debug("Creating event. Calender:", calendar, "Time:", time);
		
		var strReminderLabel = Ti.App.Properties.getString("ReminderLabel");
		
		var event = calendar.createEvent({
			title:	strReminderLabel,
			description: Alloy.Globals.AlarmDescription,
			begin:  time,
			end:    time
		});
		
		event.createReminder({
			minutes: 5,
			method: Ti.Calendar.METHOD_ALERT
		});
		
		return event;
	}
	
	var defer = q.defer();
	
	try {
		validate();
	}
	catch(e) {
		defer.reject(e);
		return;
	}
	
	var scheduledReminders;
	try {
		//calculate the next reminders until 1 month from now
		scheduledReminders = reminderRepeatSetting.getScheduledRemindersBetween(new Date(), Alloy.Globals.ReminderEndDate);
	}
	catch(e) {
		defer.reject(e);
		return;
	}
	
	var eventIDs = [];
	scheduledReminders.forEach(function(reminderTime) {
		var event = createEvent(calendar, reminderTime);	//create the next event
		eventIDs.push(event.getId());
	});
	
	Ti.App.Properties.setBool("HasReminder", true);
	Ti.App.Properties.setString("ReminderEventID", JSON.stringify(eventIDs));
	Ti.App.Properties.setString("ReminderExpiryDate", FormatHelper.formatDate(Alloy.Globals.ReminderEndDate));
	
	defer.resolve();
	
	return defer.promise;
};

/**
 * @description Removes reminder data from App Properties. This does not actually remove any reminders from the Calendar, since `event.remove()` is not yet supported on 
 * Android. 
 * @param {Ti.Calendar} calendar The calendar to remove the event from. Call `getCalendar()` to obtain this.
 * @see http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Calendar.Event
 * @returns Promise
 */
AndroidReminder.prototype.remove = function(calendar) {
	//Note: Titanium currently does not support removing / updating events in Android. So the best we can do right now is clear our data.
	var defer = q.defer();
	removeReminderData();
	defer.resolve();
	
	return defer.promise;
};

/**
 * @description Gets a list of selectable calendars and shows them in an option dialog. Once the user has selected one, the promise is resolved and the selected calendar
 * is passed as an argument.
 * @returns Promise
 */
AndroidReminder.prototype.getCalendar = function() {
	Ti.API.debug("Getting calendar for Android");
	
	var calendars = Ti.Calendar.selectableCalendars;
	var defer = q.defer();
	
    var names =[];
    for (var i = 0; i<calendars.length; i++) {
        names.push(calendars[i].name);
    }

    var calendarDialog = Titanium.UI.createOptionDialog({
        title: 'Select a Calendar',
        options: names,
        cancel:1
    });
    
    calendarDialog.addEventListener('click', function(e){
        var calendarIndex = e.index + 1;
        var selectedCalendar = Ti.Calendar.getCalendarById(calendarIndex);
		
		if(selectedCalendar) {
			defer.resolve(selectedCalendar);
		}
		else {
			defer.reject("Selected index is not a valid calendar");
		}
    });	
    calendarDialog.show();	
    						    
    return defer.promise;
};

/**
 * @description Requests calendar permissions from the OS. This should be called before anything else.
 * @returns Promise
 */
AndroidReminder.prototype.requestPermission = function() {
	return requestPermission();	
};

/**
 * @class AppleReminder
 * @summary The Apple (iOS) Reminder
 */
function AppleReminder() { }

/**
 * @description Adds reminders to the calendar. This should be `Ti.Calendar.defaultCalendar`.
 * @param {Object} calendar
 * @return Promise
 */
AppleReminder.prototype.add = function(calendar) {
	Ti.API.debug("Adding reminder on iOS");
	
	function createEvent(calendar, time) {
		Ti.API.debug("Creating event. Calender:", calendar, "Time:", time);
		
		var strReminderLabel = Ti.App.Properties.getString("ReminderLabel");
		
		var event = calendar.createEvent({
			title:	strReminderLabel,
			description: Alloy.Globals.AlarmDescription,
			begin:  time,
			end:    time
		});
		
		Ti.API.debug("Extended properties:", JSON.stringify(event.extendedProperties));
		
		var alert = event.createAlert({
			absoluteDate: time
		});
		
		event.alerts = [alert];
		
		return event;
	}
	
	var defer = q.defer();
	
	try {
		validate();	
	}
	catch(e) {
		defer.reject(e);
		return;
	}
	
	var nextReminder;
	try {
		//calculate the next reminder DT from now
		nextReminder = reminderRepeatSetting.getNextReminderDateTime(new Date()); 
	}
	catch(e) {
		defer.reject(e);
		return;
	}
	
	var event = createEvent(calendar, nextReminder);
	var activeDays = reminderRepeatSetting.get();
		
	//Set the days of the week based on the settings
	var recurrenceRule = event.createRecurrenceRule({
		frequency: Ti.Calendar.RECURRENCEFREQUENCY_WEEKLY,
		interval: 1,
		daysOfTheWeek: activeDays
	});
	
	event.recurrenceRules = [recurrenceRule];
	
	if(event.save(Ti.Calendar.SPAN_FUTUREEVENTS)) {
		Ti.App.Properties.setBool("HasReminder", true);
		Ti.App.Properties.setString("ReminderEventID", event.getId());
		
		defer.resolve();
	}
	else {
		defer.reject("Unknown reason");
	}
	
	return defer.promise;
};

/**
 * @description Removes reminders from the calendar and removes the reminder data from App Properties.
 * @param {Object} calendar The calendar to remove the events from. This should be `Ti.Calendar.defaultCalendar`.
 * @returns Promise
 */
AppleReminder.prototype.remove = function(calendar) {
	var defer = q.defer();
	
	var eventID = Ti.App.Properties.getString("ReminderEventID", "");
	Ti.API.debug("Removing reminders. ID: ", eventID);
	
	if(eventID.length > 0) {
		var event = calendar.getEventById(eventID);
		
		if(!event) {
			removeReminderData();	
			defer.reject("Event doesn't exist");
		}
		else if(event.remove(Ti.Calendar.SPAN_FUTUREEVENTS)) {		
			removeReminderData();		
			defer.resolve();
		}
		else {
			defer.reject("Unknown reason");
			
			//Note: there may be a reason why remove is failing. We probably shouldn't
			//remove the reminder event ID.
		}
	}
	else {
		defer.reject("Reminder doesn't exist");
		
		//Our data wasn't reset properly. Reset it now
		removeReminderData();
	}	
};

/**
 * @descripton On iOS, passing a `Ti.Calendar` via promise arguments was buggy. This function simply returns a promise to allow the calling code to 
 * pass `Ti.Calendar.defaultCalendar` to `AppleReminderInstance.add(...)`.
 * @returns Promise
 */
AppleReminder.prototype.getCalendar = function() {
	//Note: For some reason, the iOS engine doesn't like passing the default calendar as an argument to resolve. 
	//We handle it via the caller.	
	var defer = q.defer();
	defer.resolve();
	return defer.promise;
};

/**
 * @description Requests calendar permissions from the OS. This should be called before anything else.
 * @returns Promise
 */
AppleReminder.prototype.requestPermission = function() {
	return requestPermission();
};

function create() {	
	if(Ti.Platform.osname === "android") {
		return new AndroidReminder();
	}	
	else {
		return new AppleReminder();
	}
}

module.exports.create = create;