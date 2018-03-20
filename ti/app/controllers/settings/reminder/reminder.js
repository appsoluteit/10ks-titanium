/**
 * @file Reminder Controller
 * @requires classes/CalendarFactory
 * @requires classes/ReminderRepeatSetting
 * @description The controller for the reminder view.
 * @namespace Controllers.Settings.Reminder
 */

var CalendarFactory = require("classes/CalendarFactory");
var ReminderRepeatSetting = require("classes/ReminderRepeatSetting");

var reminderProvider = CalendarFactory.create();
var reminderRepeatSetting = new ReminderRepeatSetting();

var args = $.args;

/*********************************** BUSINESS FUNCTIONS ***********************************/

/**
 * @description Interacts with the CalendarFactory. Requests permissions, then selects a Calendar, then writes reminders to the Calendar.
 * After completion, `enableDisableReminderButtons()` is called to refresh the UI.
 * @memberOf Controllers.Settings.Reminder
 */
function addReminder() {	
	reminderProvider.requestPermission()
					.then(function success() {
						return reminderProvider.getCalendar();
					}, function fail(reason) {
						alert("Permission to Calendar denied. Reason: " + reason);
					})
					.then(function success(selectedCalendar) {
						Ti.API.debug("Calendar selected: ", selectedCalendar);
						
						//Note: iOS doesn't like passing the default calendar via the promise argument. Do it here.
						if(Ti.Platform.osname !== "android") {
							selectedCalendar = Ti.Calendar.defaultCalendar;	
						}
						
						return reminderProvider.add(selectedCalendar);
					}, function fail(reason) {
						alert("Couldn't select calendar. Reason: " + reason);
					})
					.then(function success() {						
						Alloy.createWidget("com.mcongrove.toast", null, {
							text: "Reminder saved",
							duration: 2000,
							view: $.reminder,
							theme: "success"
						});
						
						if(Ti.Platform.osname === "android") {
							$.reminder.close();
						}
						else {
							enableDisableReminderButtons();	
						}
					}, function fail(reason) {
						alert("Couldn't add reminder. Reason: " + reason);
					});
}

/**
 * @description Interacts with the CalendarFactory. Requests permissions, then selects a Calendar, then removes reminders from the Calendar.
 * After completion, `enableDisableReminderButtons()` is called to refresh the UI.
 * @memberOf Controllers.Settings.Reminder
 */
function removeReminder() {
	reminderProvider.requestPermission()
					.then(function success() {
						return reminderProvider.getCalendar();
					}, function fail(reason) {
						alert("Permission to Calendar denied. Reason: " + reason);
					})
					.then(function success(selectedCalendar) {
						if(Ti.Platform.osname !== "android") {
							selectedCalendar = Ti.Calendar.defaultCalendar;	
						}
						
						return reminderProvider.remove(selectedCalendar);
					}, function fail(reason) {
						alert("Couldn't select calendar. Reason: " + reason);
					})
					.then(function success() {
						Alloy.createWidget("com.mcongrove.toast", null, {
							text: "Reminder removed",
							duration: 2000,
							view: $.reminder,
							theme: "success"
						});	
						
						if(Ti.Platform.osname === "android") {
							//Ti doesn't support removing events from a calendar on Android. Inform the user.
							alert("Reminders still exist in your selected Calendar. They must be manually removed");
							$.reminder.close();
						}
						else {
							enableDisableReminderButtons();	
						}
					}, function fail(reason) {
						alert("Couldn't remove reminder. Reason: " + reason);
					});
}

/*********************************** UI ***********************************/

/**
 * @description Disables the add reminder button.
 * @memberof Controllers.Settings.Reminder
 */
function disableAddReminderButton() {
	$.reminderView.lblAddReminder.opacity = 0.5;
	$.reminderView.tblRowAddReminder.disabled = true;
}

/**
 * @description Disables the remove reminder button.
 * @memberof Controllers.Settings.Reminder
 */
function disableRemoveReminderButton() {
	$.reminderView.lblRemoveReminder.opacity = 0.5;
	$.reminderView.tblRowRemoveReminder.disabled = true;
}

/**
 * @description Enables the add reminder button.
 * @memberof Controllers.Settings.Reminder
 */
function enableAddReminderButton() {
	$.reminderView.lblAddReminder.opacity = 1.0;
	$.reminderView.tblRowAddReminder.disabled = false;
}

/**
 * @description Enables the remove reminder button.
 * @memberOf Controllers.Settings.Reminder
 */
function enableRemoveReminderButton() {
	$.reminderView.lblRemoveReminder.opacity = 1.0;
	$.reminderView.tblRowRemoveReminder.disabled = false;
}

/**
 * @description Enables and disables the add/remove reminder buttons depending on saved settings.
 * @memberOf Controllers.Settings.Reminder
 */
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

/**
 * @description Populates the rows of the reminder view with their saved values.
 * @memberOf Controllers.Settings.Reminder
 */
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

/**
 * @description Event handler for `btnBack`. Closes the current window.
 * @memberof Controllers.Settings.Reminder
 */
function btnBack_click() {
	$.reminder.close();
}

/**
 * @description Event handler for the Window's `open` event. Adds event handlers for rows and calls `populateRows()`.
 * @memberof Controllers.Settings.Reminder
 */
function window_open() {
	Alloy.Globals.tracker.addScreenView('Reminder');
	
	$.reminderView.tblRowRepeat.addEventListener('click', tblRowRepeat_click);
	$.reminderView.tblRowLabel.addEventListener('click', tblRowLabel_click);
	$.reminderView.tblRowTime.addEventListener('click', tblRowTime_click);
	
	$.reminderView.tblRowRemoveReminder.addEventListener('click', tblRowRemoveReminder_click);
	$.reminderView.tblRowAddReminder.addEventListener('click', tblRowAddReminder_click);
	
	populateRows();
}

/**
 * @description Event handler for when a child window closes. On Android, this window is then closed in order to update the rows as the UI display doesn't update well on 
 * Android after a view has already been rendered. On iOS, it simply calls `populateRows()`. 
 * @memberof Controllers.Settings.Reminder
 */
function childWindow_close() {
	populateRows();
}

/**
 * @description Event handler for the `tblRowRepeat` row. Opens the reminder repeat view.
 * @memberof Controllers.Settings.Reminder
 */
function tblRowRepeat_click() {
	var win = Alloy.createController('settings/reminder/reminderRepeat').getView();
	win.open();
	
	win.addEventListener('close', childWindow_close);
}

/**
 * @description Event handler for the `tblRowLabel` row. Opens the reminder label view.
 * @memberof Controllers.Settings.Reminder
 */
function tblRowLabel_click() {
	var win = Alloy.createController('settings/reminder/reminderLabel').getView();
	win.open();
	
	win.addEventListener('close', childWindow_close);
}

/**
 * @description Event handler for the `tblRowTime` row. Opens the reminder time view.
 * @memberof Controllers.Settings.Reminder
 */
function tblRowTime_click() {
	var win = Alloy.createController('settings/reminder/reminderTime').getView();
	win.open();
	
	win.addEventListener('close', childWindow_close);
}

/**
 * @description Event handler for the `tblRowAddReminder` row. Calls `addReminder()`.
 * @memberof Controllers.Settings.Reminder
 */
function tblRowAddReminder_click() {
	if($.reminderView.tblRowAddReminder.disabled) {
		return;
	}
	
	addReminder();
}

/**
 * @description Event handler for the `tblRowRemoveReminder` row. Calls `removeReminder()`.
 * @memberof Controllers.Settings.Reminder
 */
function tblRowRemoveReminder_click() {
	if($.reminderView.tblRowRemoveReminder.disabled) {
		return;
	}
		
	removeReminder();
}
