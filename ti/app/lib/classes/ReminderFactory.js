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

function AndroidReminder() { 
	//Android does not support the Ti.Calendar.RecurenceRule, so we should use the AlarmManager
	//available at: https://github.com/benbahrenburg/benCoding.AlarmManager
	this.alarmManager = require('com.bencoding.alarmmanager');
}

AndroidReminder.prototype.add = function() {
	alert("Adding alarm for Android");
	//TODO: Complete
};

AndroidReminder.prototype.remove = function() {
	alert("Removing alarm for Android");
};

function AppleReminder() { }

AppleReminder.prototype.add = function() {
	validate();
	
	var defCalendar = Ti.Calendar.defaultCalendar;
	
	var strReminderLabel = Ti.App.Properties.getString("ReminderLabel");
	
	var activeDays = reminderRepeatSetting.get();
	var nextReminder;
	
	try {
		nextReminder = reminderRepeatSetting.getNextReminderDateTime();
	}
	catch(e) {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Couldn't add reminder. Reason: " + e,
			duration: 2000,
			view: $.reminder,
			theme: "error"
		});	
		
		return;
	}
	
	var evReminder = defCalendar.createEvent({
		title:	strReminderLabel,
		description: "Don't forget to log your time!",
		begin:  nextReminder,
		end:    nextReminder
	});
	
	var evAlert = evReminder.createAlert({
			absoluteDate: nextReminder
	});
	
	evReminder.alerts = [evAlert];
	
	//Set the days of the week based on the settings
	var evRecurrenceRule = evReminder.createRecurrenceRule({
		frequency: Ti.Calendar.RECURRENCEFREQUENCY_WEEKLY,
		interval: 1,
		daysOfTheWeek: activeDays
	});
	
	evReminder.recurrenceRules = [evRecurrenceRule];
	if(evReminder.save(Ti.Calendar.SPAN_FUTUREEVENTS)) {
		Ti.App.Properties.setBool("HasReminder", true);
		Ti.App.Properties.setString("ReminderEventID", evReminder.getId());
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Reminder saved",
			duration: 2000,
			view: $.reminder,
			theme: "success"
		});
	}
	else {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Couldn't create reminder",
			duration: 2000,
			view: $.reminder,
			theme: "error"
		});
	}
};

AppleReminder.prototype.remove = function() {
	function removeReminderData() {
		Ti.App.Properties.removeProperty("HasReminder");
		Ti.App.Properties.removeProperty("ReminderEventID");			
	}
	
	var evReminderID = Ti.App.Properties.getString("ReminderEventID", "");
	console.log("Removing reminders. ID: ", evReminderID);
	
	if(evReminderID.length > 0) {
		var defCalendar = Ti.Calendar.defaultCalendar;
		
		var evt = defCalendar.getEventById(evReminderID);
		
		if(evt == null) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Event does not exist",
				duration: 2000,
				view: $.reminder,
				theme: "error"
			});
		
			removeReminderData();
		}
		else if(evt.remove(Ti.Calendar.SPAN_FUTUREEVENTS)) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Reminder removed",
				duration: 2000,
				view: $.reminder,
				theme: "success"
			});
		
			removeReminderData();
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't remove reminder",
				duration: 2000,
				view: $.reminder,
				theme: "error"
			});
			
			//Note: there may be a reason why remove is failing. We probably shouldn't
			//remove the reminder event ID.
		}
	}
	else {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "No reminder found",
			duration: 2000,
			view: $.reminder,
			theme: "error"
		});
		
		//Our data wasn't reset properly. Reset it now
		removeReminderData();
	}	
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