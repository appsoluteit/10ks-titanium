var ReminderFactory = require("classes/ReminderFactory");
var reminderProvider = ReminderFactory.create();

var ReminderRepeatSetting = require("classes/ReminderRepeatSetting");
var reminderRepeatSetting = new ReminderRepeatSetting();

var args = $.args;

/*********************************** BUSINESS FUNCTIONS ***********************************/

function addReminder() {
	reminderProvider.add();
	enableDisableReminderButtons();
}

function removeReminder() {
	reminderProvider.remove();
	enableDisableReminderButtons();	
}

/*********************************** UI ***********************************/

function disableAddReminderButton() {
	$.reminderView.lblAddReminder.opacity = 0.5;
	$.reminderView.tblRowAddReminder.disabled = true;
}

function disableRemoveReminderButton() {
	$.reminderView.lblRemoveReminder.opacity = 0.5;
	$.reminderView.tblRowRemoveReminder.disabled = true;
}

function enableAddReminderButton() {
	$.reminderView.lblAddReminder.opacity = 1.0;
	$.reminderView.tblRowAddReminder.disabled = false;
}

function enableRemoveReminderButton() {
	$.reminderView.lblRemoveReminder.opacity = 1.0;
	$.reminderView.tblRowRemoveReminder.disabled = false;
}

function enableDisableReminderButtons() {
	console.log("Enabling / disabling buttons");
	
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
		 		
		 	var activeDays = reminderRepeatSetting.get();
			
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
		var activeDays = reminderRepeatSetting.get();
		
		if(activeDays.length === 1) {
			$.reminderView.lblRepeat.text = activeDays[0].name;
		}
		else {
			$.reminderView.lblRepeat.text = activeDays.length + " days";	
		}
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
	if($.reminderView.tblRowAddReminder.disabled) {
		return;
	}
	
	if(Ti.Calendar.hasCalendarPermissions()) {
		addReminder();
	}
	else {
		Ti.Calendar.requestCalendarPermissions(function(e) {
			if(e.success) {
				addReminder();
			}
			else {
				alert("Access to Calendar denied. Message = " + e.error);
			}
		});
	}
}

function tblRowRemoveReminder_click() {
	if($.reminderView.tblRowRemoveReminder.disabled) {
		return;
	}
		
	reminderProvider.remove();
}
