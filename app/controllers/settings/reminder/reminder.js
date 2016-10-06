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
	
	//Pre-populate the row values
	if(Ti.App.Properties.hasProperty("ReminderRepeat")) {
		var strReminderRepeat = Ti.App.Properties.getString("ReminderRepeat");
		var objReminderRepeat = JSON.parse(strReminderRepeat);
	
		var activeDays = objReminderRepeat.filter(function(e) { return e.active; });
		
		if(activeDays.length === 1)
			$.reminderView.lblRepeat.text = activeDays[0].name;
		else
			$.reminderView.lblRepeat.text = activeDays.length + " days";	
	}
	
	if(Ti.App.Properties.hasProperty("ReminderLabel")) {
		var strReminderLabel = Ti.App.Properties.getString("ReminderLabel");
		$.reminderView.lblLabel.text = strReminderLabel;
	}
	
	if(Ti.App.Properties.hasProperty("ReminderTime")) {
		var strReminderTime = Ti.App.Properties.getString("ReminderTime");
		$.reminderView.lblTime.text = strReminderTime;
	}
	
	if(Ti.App.Properties.hasProperty("HasReminder")) {
		$.reminderView.tblRowRemoveReminder.visible = true;
	}
}

function tblRowRepeat_click() {
	var win = Alloy.createController('settings/reminder/reminderRepeat', {
		callback: function(repeatArr) {
			//Ti.API.info("Callback days:", JSON.stringify(repeatArr));
			
			setTimeout(function() {
				var activeDays = repeatArr.filter(function(e) { return e.active; });
				
				Ti.API.info("Active days: ", activeDays.length);
				
				if(activeDays.length === 1)
					$.reminderView.lblRepeat.text = activeDays[0].name;
				else
					$.reminderView.lblRepeat.text = activeDays.length + " days";
			}, 1000);
		}
	}).getView();
	
	//TODO: Android sometimes doesn't refresh the label, even when the returned data is correct.
	//		Try loading the data from the App Properties after the window closes and modifying it this way.
	win.addEventListener('close', function() {
		
	});
	
	win.open();
}

function tblRowLabel_click() {
	var win = Alloy.createController('settings/reminder/reminderLabel', {
		callback: function(labelStr) {
			Ti.API.info("Callback row label: ", labelStr);
			$.reminderView.lblLabel.text = labelStr;
		}
	}).getView();
	
	win.open();
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
