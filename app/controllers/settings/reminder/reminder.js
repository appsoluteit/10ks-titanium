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

function enableDisableReminderButtons() {
	//Remove both event handlers first
	$.reminderView.tblRowAddReminder.removeEventListener('click', tblRowAddReminder_click);
	$.reminderView.tblRowRemoveReminder.removeEventListener('click', tblRowRemoveReminder_click);
	
	if(Ti.App.Properties.hasProperty("HasReminder")) {
		$.reminderView.tblRowAddReminder.touchEnabled = false;
		$.reminderView.lblAddReminder.opacity = 0.5;
		
		$.reminderView.tblRowRemoveReminder.addEventListener('click', tblRowRemoveReminder_click);
	}
	else {
		$.reminderView.tblRowRemoveReminder.touchEnabled = false;
		$.reminderView.lblRemoveReminder.opacity = 0.5;
		
		$.reminderView.tblRowAddReminder.addEventListener('click', tblRowAddReminder_click);
	}
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

function tblRowRepeat_click() {
	var win = Alloy.createController('settings/reminder/reminderRepeat', {
		callback: function(repeatArr) {
			//Ti.API.info("Callback days:", JSON.stringify(repeatArr));
			
			setTimeout(function() {
				var activeDays = repeatArr.filter(function(e) { return e.active; });
				
				Ti.API.info("Active days: ", activeDays.length);
				
				if(activeDays.length === 1)
					$.reminderView.lblRepeat.text = activeDays[0].name;
				else
					$.reminderView.lblRepeat.text = activeDays.length + " days";
			}, 1000);
		}
	}).getView();
	
	win.open();
}

function tblRowLabel_click() {
	var win = Alloy.createController('settings/reminder/reminderLabel', {
		callback: function(labelStr) {
			Ti.API.info("Callback row label: ", labelStr);
			$.reminderView.lblLabel.text = labelStr;
		}
	}).getView();
	
	win.open();
}

function tblRowTime_click() {
	var win = Alloy.createController('settings/reminder/reminderTime', {
		callback: function(timeStr) {
			Ti.API.info("Callback raw time: ", timeStr);
			
			$.reminderView.lblTime.text = timeStr;
		}
	}).getView();
	win.open();
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
				alert("Access to Calendar denied");
			}
		});
	}
}

function tblRowRemoveReminder_click() {
	alert("Remove reminder row clicked!");
}
