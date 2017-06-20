/**
 * @file Reminder Repeat Controller
 * @requires classes/ReminderRepeatSetting
 * @description The controller for the reminder repeat view.
 * @namespace Controllers.Settings.ReminderRepeat
 */

var ReminderRepeatSetting = require('classes/ReminderRepeatSetting');
var setting = new ReminderRepeatSetting();

var args = $.args;

/**
 * @description Event handler for the Window's `open` event. If on iOS, adds event listeners to the rows to toggle the radio buttons (on Android this is buggy so we 
 * don't do it). Also presets the switch values based on saved app properties.
 * @memberof Controllers.Settings.ReminderRepeat
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Reminder Repeat"
	});
	
	//This causes a bug on Android where switch values are always off by 1
	if(Ti.Platform.osname != "android") {
		$.reminderRepeatView.tblRowSunday.addEventListener('click', tblRow_click);
		$.reminderRepeatView.tblRowMonday.addEventListener('click', tblRow_click);
		$.reminderRepeatView.tblRowTuesday.addEventListener('click', tblRow_click);
		$.reminderRepeatView.tblRowWednesday.addEventListener('click', tblRow_click);
		$.reminderRepeatView.tblRowThursday.addEventListener('click', tblRow_click);
		$.reminderRepeatView.tblRowFriday.addEventListener('click', tblRow_click);
		$.reminderRepeatView.tblRowSaturday.addEventListener('click', tblRow_click);
	}
	
	//Preset the switches if there is existing data
	if(setting.isSet()) {
		var activeDays = setting.get();
		
		for(var i = 0; i < activeDays.length; i++) {
			switch(activeDays[i].name) {
				case 'Sunday':
					$.reminderRepeatView.swSunday.value = true;
					break;
					
				case 'Monday':
					$.reminderRepeatView.swMonday.value = true;
					break;
					
				case 'Tuesday':
					$.reminderRepeatView.swTuesday.value = true;
					break;
					
				case 'Wednesday':
					$.reminderRepeatView.swWednesday.value = true;
					break;
					
				case 'Thursday':
					$.reminderRepeatView.swThursday.value = true;
					break;
					
				case 'Friday':
					$.reminderRepeatView.swFriday.value = true;
					break;
					
				case 'Saturday':
					$.reminderRepeatView.swSaturday.value = true;
					break;	
			}
		}
	}
}

/**
 * @description Event handler for each `tblRow` containing a switch. This only runs on iOS.
 * @see window_open()
 * @memberof Controllers.Settings.ReminderRepeat
 * @param {Object} e The `click` event.
 */
function tblRow_click(e) {	
	switch(e.row.id) {
		case 'tblRowSunday':
			$.reminderRepeatView.swSunday.value = !$.reminderRepeatView.swSunday.value;
			break;
			
		case 'tblRowMonday':
			$.reminderRepeatView.swMonday.value = !$.reminderRepeatView.swMonday.value;
			break;
			
		case 'tblRowTuesday':
			$.reminderRepeatView.swTuesday.value = !$.reminderRepeatView.swTuesday.value;
			break;
			
		case 'tblRowWednesday':
			$.reminderRepeatView.swWednesday.value = !$.reminderRepeatView.swWednesday.value;
			break;
			
		case 'tblRowThursday':
			$.reminderRepeatView.swThursday.value = !$.reminderRepeatView.swThursday.value;
			break;
			
		case 'tblRowFriday':
			$.reminderRepeatView.swFriday.value = !$.reminderRepeatView.swFriday.value;
			break;
			
		case 'tblRowSaturday':
			$.reminderRepeatView.swSaturday.value = !$.reminderRepeatView.swSaturday.value;
			break;
	}
}

/**
 * @description Event handler for `btnBack`. Saves the settings to app properties and then closes the window.
 * @memberof Controllers.Settings.ReminderRepeat
 */
function btnBack_click() {
	var obj = [
		{ name: 'Sunday', active: $.reminderRepeatView.swSunday.value, dayOfWeek: 1 },
		{ name: 'Monday', active: $.reminderRepeatView.swMonday.value, dayOfWeek: 2 },
		{ name: 'Tuesday', active: $.reminderRepeatView.swTuesday.value, dayOfWeek: 3 },
		{ name: 'Wednesday', active: $.reminderRepeatView.swWednesday.value, dayOfWeek: 4 },
		{ name: 'Thursday', active: $.reminderRepeatView.swThursday.value, dayOfWeek: 5 },
		{ name: 'Friday', active: $.reminderRepeatView.swFriday.value, dayOfWeek: 6 },
		{ name: 'Saturday', active: $.reminderRepeatView.swSaturday.value, dayOfWeek: 7 }
	];
	
	setting.set(obj);
	$.reminderRepeat.close();
}