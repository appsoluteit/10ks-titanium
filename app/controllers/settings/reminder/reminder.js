// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

/*********************************** BUSINESS FUNCTIONS ***********************************/

function addReminder() {
	var defCalendar = Ti.Calendar.defaultCalendar;
	
	var strReminderTime = Ti.App.Properties.getString("ReminderTime");
	var dtReminderTime = Alloy.Globals.UnformatTime(strReminderTime);
	
	var strReminderLabel = Ti.App.Properties.getString("ReminderLabel");
	
	//TODO: dtReminderTime needs to point to the next set repeat day.
	//TODO: we need to store a list of event IDs so that we can call
	//		Calendar.getEventById(id).remove(Ti.Calendar.SPAN_FUTUREEVENTS)
	//		when the user clicks remove reminder.
	var evReminder = defCalendar.createEvent({
		title:	strReminderLabel,
		begin:  dtReminderTime,
		end:    dtReminderTime,
		allDay: false,
		availability: Ti.Calendar.AVAILABILITY_FREE,
        notes: 'Don\t forget to log your steps!',
        location: 'Home',
	});
	
	var evAlert = evReminder.createAlert({
		absoluteDate: dtReminderTime
	});
	
	evReminder.alerts = [evAlert];
	
	//TODO: Set the days of the week based on the settings
	var evRecurrenceRule = evReminder.createRecurrenceRule({
		frequency: Ti.Calendar.RECURRENCEFREQUENCY_WEEKLY,
		interval: 1,
		daysOfTheWeek: [{
			dayOfWeek: 1	
		}],
		end: {occurenceCount: 10}
	});
	
	evReminder.recurrenceRules = [evRecurrenceRule];
	if(evReminder.save(Ti.Calendar.SPAN_FUTUREEVENTS)) {
		alert("Reminder saved!");
		Ti.App.Properties.setBool("HasProperty", true);
		
		enableDisableReminderButtons();
	}
	else {
		alert("Couldn't save reminder");
	}
}

function removeReminder() {
	enableDisableReminderButtons();
}

function disableAddReminderButton() {
	$.reminderView.lblAddReminder.opacity = 0.5;
	$.reminderView.tblRowAddReminder.removeEventListener('click', tblRowAddReminder_click);
}

function disableRemoveReminderButton() {
	$.reminderView.lblRemoveReminder.opacity = 0.5;
	$.reminderView.tblRowRemoveReminder.removeEventListener('click', tblRowRemoveReminder_click);
}

function enableAddReminderButton() {
	$.reminderView.lblAddReminder.opacity = 1.0;
	$.reminderView.tblRowAddReminder.addEventListener('click', tblRowAddReminder_click);
}

function enableRemoveReminderButton() {
	$.reminderView.lblRemoveReminder.opacity = 1.0;
	$.reminderView.tblRowRemoveReminder.addEventListener('click', tblRowRemoveReminder_click);
}

function enableDisableReminderButtons() {
	//Disable both buttons first
	disableAddReminderButton();
	disableRemoveReminderButton();
	
	if(Ti.App.Properties.hasProperty("HasReminder")) {
		enableRemoveReminderButton();
	}
	else {
		if(Ti.App.Properties.hasProperty("ReminderRepeat") &&
		   Ti.App.Properties.hasProperty("ReminderLabel") &&
		   Ti.App.Properties.hasProperty("ReminderTime") ) {
		 
		 	Ti.API.info("Required reminder properties exist. Checking...");
		 	
		 	var reminderLabel = Ti.App.Properties.getString("ReminderLabel");
		 	if(reminderLabel.trim().length === 0) {
		 		Ti.API.info("Reminder label is empty. Can't enable add reminder");
		 		return;
		 	}
		 		
		 	var reminderRepeat = Ti.App.Properties.getString("ReminderRepeat");
			var objReminderRepeat = JSON.parse(reminderRepeat);
		
			var activeDays = objReminderRepeat.filter(function(e) { return e.active; });
			
			if(activeDays.length === 0) {
				return;
			}
		 	
		 	enableAddReminderButton();  	
		}
	}
}

function populateRows() {
	//Pre-populate the row values
	if(Ti.App.Properties.hasProperty("ReminderRepeat")) {
		var strReminderRepeat = Ti.App.Properties.getString("ReminderRepeat");
		var objReminderRepeat = JSON.parse(strReminderRepeat);
	
		var activeDays = objReminderRepeat.filter(function(e) { return e.active; });
		
		if(activeDays.length === 1)
			$.reminderView.lblRepeat.text = activeDays[0].name;
		else
			$.reminderView.lblRepeat.text = activeDays.length + " days";	
	}
	
	if(Ti.App.Properties.hasProperty("ReminderLabel")) {
		var strReminderLabel = Ti.App.Properties.getString("ReminderLabel");
		$.reminderView.lblLabel.text = strReminderLabel;
	}
	
	if(Ti.App.Properties.hasProperty("ReminderTime")) {
		var strReminderTime = Ti.App.Properties.getString("ReminderTime");
		$.reminderView.lblTime.text = strReminderTime;
	}
	
	enableDisableReminderButtons();
}
/*********************************** EVENT HANDLERS ***********************************/

function btnBack_click() {
	$.reminder.close();
}

function window_open() {
	$.reminderView.tblRowRepeat.addEventListener('click', tblRowRepeat_click);
	$.reminderView.tblRowLabel.addEventListener('click', tblRowLabel_click);
	$.reminderView.tblRowTime.addEventListener('click', tblRowTime_click);
	
	$.reminderView.tblRowRemoveReminder.addEventListener('click', tblRowRemoveReminder_click);
	$.reminderView.tblRowAddReminder.addEventListener('click', tblRowAddReminder_click);
	
	populateRows();
}

function childWindow_close() {
	if(Ti.Platform.osname == "android") {
		$.reminder.close();	//go back to settings to refresh the view
	}
	else {
		populateRows();
	}
}

function tblRowRepeat_click() {
	var win = Alloy.createController('settings/reminder/reminderRepeat').getView();
	win.open();
	
	win.addEventListener('close', childWindow_close);
}

function tblRowLabel_click() {
	var win = Alloy.createController('settings/reminder/reminderLabel').getView();
	win.open();
	
	win.addEventListener('close', childWindow_close);
}

function tblRowTime_click() {
	var win = Alloy.createController('settings/reminder/reminderTime').getView();
	win.open();
	
	win.addEventListener('close', childWindow_close);
}

function tblRowAddReminder_click() {
	//alert("Reminder row clicked!");	
	if(Ti.Calendar.hasCalendarPermissions()) {
		addReminder();
		//performCalendarWriteFunctions();
	}
	else {
		Ti.Calendar.requestCalendarPermissions(function(e) {
			if(e.success) {
				addReminder();
				//performCalendarWriteFunctions();
			}
			else {
				alert("Access to Calendar denied. Message = " + e.error);
			}
		});
	}
}

function tblRowRemoveReminder_click() {
	alert("Remove reminder row clicked!");
}
