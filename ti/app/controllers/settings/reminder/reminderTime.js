/**
 * @file Reminder Time Controller
 * @requires helpers/FormatHelper
 * @description The controller for the reminder time view.
 * @namespace Controllers.Settings.ReminderTime
 */

var FormatHelper = require('helpers/FormatHelper');
var args = $.args;

/**
 * @description Event handler for Window's `open` event. If a reminder time has been set in the app properties, pre-load the time picker with it.
 * @memberof Controllers.Settings.ReminderTime
 */
function window_open() {
	var reminderTime = Ti.App.Properties.getString('ReminderTime', '');
	
	if(reminderTime) {
		var reminderTimeObj = FormatHelper.unformatTime(reminderTime);
		$.reminderTimeView.pkrReminderTime.value = reminderTimeObj;
	}	
}

/**
 * @description Event handler for `btnBack`. Saves the selected reminder time as a string to app properties then closes the window.
 * @memberof Controllers.Settings.ReminderTime
 */
function btnBack_click() {
	var rawTime = $.reminderTimeView.pkrReminderTime.value; //this will be GMT+0
	var timeStr = FormatHelper.formatTime(rawTime);
	
	Ti.App.Properties.setString('ReminderTime', timeStr);
	
	$.reminderTime.close();
}
