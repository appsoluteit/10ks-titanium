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
}

function tblRowRepeat_click() {
	alert("Repeat row clicked!");
}

function tblRowLabel_click() {
	alert("Label row clicked!");
}

function tblRowTime_click() {
	alert("Time row clicked!");
}

function tblRowAddReminder_click() {
	alert("Reminder row clicked!");	
}

function tblRowRemoveReminder_click() {
	alert("Remove reminder row clicked!");
}
