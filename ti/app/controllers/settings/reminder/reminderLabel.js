/**
 * @file Reminder Label Controller
 * @description The controller for the reminder label view.
 * @namespace Controllers.Settings.ReminderLabel
 * @requires widgets/com.mcongrove.toast
 */

var args = $.args;

/**
 * @description Event handler for the Window's `open` event. Adds an event listener to `btnSave` and populates the label with
 * the saved setting value, if it exists.
 * @memberof Controllers.Settings.ReminderLabel
 */
function window_open() {
	$.reminderLabelView.btnSave.addEventListener('click', btnSave_click);
	
	var strReminderLabel = Ti.App.Properties.getString("ReminderLabel", "");
	$.reminderLabelView.txtReminderLabel.value = strReminderLabel;
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Settings.ReminderLabel
 */
function btnBack_click() {
	$.reminderLabel.close();
}

/**
 * @description Event handler for `btnSave`. Saves the value in `txtReminderLabel` to application properties, shows a success toast and
 * closes the window after 2000ms.
 * @memberof Controllers.Settings.ReminderLabel
 */
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