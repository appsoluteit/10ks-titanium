var FormatHelper = require('helpers/FormatHelper');
var args = $.args;

function window_open() {
	var reminderTime = Ti.App.Properties.getString('ReminderTime', '');
	
	if(reminderTime) {
		var reminderTimeObj = FormatHelper.unformatTime(reminderTime);
		$.reminderTimeView.pkrReminderTime.value = reminderTimeObj;
	}	
}

function btnBack_click() {
	var rawTime = $.reminderTimeView.pkrReminderTime.value; //this will be GMT+0
	var timeStr = FormatHelper.formatTime(rawTime);
	
	Ti.App.Properties.setString('ReminderTime', timeStr);
	
	$.reminderTime.close();
}
