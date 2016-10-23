// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function window_open() {
	$.reminderLabelView.btnSave.addEventListener('click', btnSave_click);
	
	var strReminderLabel = Ti.App.Properties.getString("ReminderLabel", "");
	$.reminderLabelView.txtReminderLabel.value = strReminderLabel;
}

function btnBack_click() {
	$.reminderLabel.close();
}

function btnSave_click() {
	var reminderLabel = $.reminderLabelView.txtReminderLabel.value;
	Ti.App.Properties.setString("ReminderLabel", reminderLabel);
	
	Alloy.createWidget("com.mcongrove.toast", null, {
		text: "Label saved",
		duration: 2000,
		view: $.reminderLabel,
		theme: "success"
	});
		
	setTimeout(function() {
		$.reminderLabel.close();
	}, 2000);
}