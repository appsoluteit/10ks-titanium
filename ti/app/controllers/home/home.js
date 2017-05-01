var args = $.args;

var CalendarFactory = require('classes/CalendarFactory');
var ReminderRepeatSetting = require('classes/ReminderRepeatSetting');

function loginIfNeeded() {
	if(!Alloy.Globals.IsLoggedIn) {
		win = Alloy.createController('auth/login').getView();
		win.open();
	}	
	else if(Ti.Platform.osname === "android") {		
		var repeatSetting = new ReminderRepeatSetting();
		if(repeatSetting.willExpire(new Date())) {
			var confirmDialog = Ti.UI.createAlertDialog({
				cancel: 0,
				buttonNames: ['Cancel', 'OK'],
				message: 'The reminders on your phone will expire on ' + reminderExpiry.toString() + '. Do you want to update them?',
				title: 'Update reminders?'
			});
			
			confirmDialog.addEventListener('click', function(e) {
				if(e.index !== e.source.cancel) {
					var reminderProvider = CalendarFactory.create();
					
					reminderProvider.requestPermission()
									.then(function success() {
										return reminderProvider.getCalendar();
									}, function fail(reason) {
										alert("Permission denied for calendar. Reason = " + reason);
									})
									.then(function success(selectedCalendar) {
										return reminderProvider.add(selectedCalendar);
									}, function fail(reason) {
										alert("Couldn't select calendar. Reason = " + reason);
									})
									.then(function success() {
										Alloy.createWidget("com.mcongrove.toast", null, {
											text: "Reminder saved",
											duration: 2000,
											view: $.home,
											theme: "success"
										});
									}, function fail(reason) {
										alert("Couldn't save reminders. Reason = " + reason);
									});
				}	
			});
			
			confirmDialog.show();	
		}
	}
}

function btnStepLog_click(e) {
	var win = Alloy.createController('steps/steps').getView();
	win.open();
}

function btnStatistics_click(e) {
	var win = Alloy.createController('stats/stats').getView();
	win.open();
}

function btnChallenges_click(e) {
	var win = Alloy.createController('challenges/challenges').getView();
	win.open();
}

function btnTournaments_click(e) {
	var win = Alloy.createController('tournaments/tournaments').getView();
	win.open();
}

function btnSettings_click(e) {
	var win = Alloy.createController('settings/settings').getView();
	win.open();
	
	win.addEventListener('close', function() {
		loginIfNeeded();
	});
}
 
function androidBack_click() {
	var confirmDialog = Ti.UI.createAlertDialog({
		cancel: 0,
		buttonNames: ['Cancel', 'OK'],
		message: 'Are you sure you want to exit 10,000 steps?',
		title: 'Exit App?'
	});
	
	confirmDialog.addEventListener('click', function(e) {
		if(e.index !== e.source.cancel) {
			$.home.close();
			args.quit();
		}	
	});
	
	confirmDialog.show();
}

function window_open() {
	$.homeView.btnStepLog.addEventListener('click', btnStepLog_click);
	$.homeView.btnStatistics.addEventListener('click', btnStatistics_click);
	$.homeView.btnTournaments.addEventListener('click', btnTournaments_click);
	$.homeView.btnChallenges.addEventListener('click', btnChallenges_click);
	$.homeView.btnSettings.addEventListener('click', btnSettings_click);

	loginIfNeeded();
}