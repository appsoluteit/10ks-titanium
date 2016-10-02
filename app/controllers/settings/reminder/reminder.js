// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnBack_click() {
	$.reminder.close();
}

function window_open() {
	$.reminderView.tblRowRepeat.addEventListener('click', tblRowRepeat_click);
	$.reminderView.tblRowLabel.addEventListener('click', tblRowLabel_click);
	$.reminderView.tblRowTime.addEventListener('click', tblRowTime_click);
	$.reminderView.tblRowAddReminder.addEventListener('click', tblRowAddReminder_click);
	$.reminderView.tblRowRemoveReminder.addEventListener('click', tblRowRemoveReminder_click);
	
	if(Ti.App.Properties.hasProperty("ReminderTime")) {
		var strReminderTime = Ti.App.Properties.getString("ReminderTime");
		$.reminderView.lblTime.text = strReminderTime;
	}
	//TODO: Show the 'remove reminder' button if there is a reminder set
}

function tblRowRepeat_click() {
	alert("Repeat row clicked!");
}

function tblRowLabel_click() {
	alert("Label row clicked!");
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
	alert("Reminder row clicked!");	
}

function tblRowRemoveReminder_click() {
	alert("Remove reminder row clicked!");
}
