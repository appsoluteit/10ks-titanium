// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function window_open() {
	var reminderTime = Ti.App.Properties.getString('ReminderTime', '');
	
	if(reminderTime) {
		var reminderTimeObj = Alloy.Globals.UnformatTime(reminderTime);
		$.reminderTimeView.pkrReminderTime.value = reminderTimeObj;
	}	
}

function btnBack_click() {
	var rawTime = $.reminderTimeView.pkrReminderTime.value; //this will be GMT+0
	var timeStr = Alloy.Globals.FormatTime(rawTime);
	
	Ti.App.Properties.setString('ReminderTime', timeStr);
	args.callback(timeStr);
	
	$.reminderTime.close();
}
