/**
 * @file Home Controller
 * @requires classes/CalendarFactory
 * @requires classes/ReminderRepeatSetting
 * @requires analytics.google
 * @description The controller for the home view. This is the first view shown to the user.
 * @namespace Controllers.Home
 */

var CalendarFactory = require('classes/CalendarFactory');
var ReminderRepeatSetting = require('classes/ReminderRepeatSetting');
var StepsProvider = require('classes/StepsProvider');
var spinner = Alloy.createWidget('nl.fokkezb.loading');

var stepsProvider = new StepsProvider();

/**
 * @description If the user is not logged in (based off the last known state, stored locally) then the login window is shown. Otherwise, on Android, this function
 * also checks whether or not the reminders are about to expire and prompts the user to renew them.
 * @memberOf Controllers.Home
 */
function loginIfNeeded() {
	if(!Alloy.Globals.IsLoggedIn) {
		var win = Alloy.createController('auth/login').getView();
		win.addEventListener('close', function() {
			//After a login, sync steps if required
			var confirmDialog = Ti.UI.createAlertDialog({
				cancel: 0,
				buttonNames: ['Cancel', 'OK'],
				message: 'Do you want to sync your steps now?',
				title: 'Perform first sync?'
			});
			
			confirmDialog.addEventListener('click', function(e) {
				if(e.index !== e.source.cancel) {
					spinner.show("Syncing...");
					
					//This may throw an InvalidToken exception, but since the user had "just" logged in,
					//that should never happen.
					stepsProvider.sync($.home, function() {
						setTimeout(function() {
							//Showing a toast here seems problematic (perhaps due to the window not having loaded yet).
							Ti.UI.createAlertDialog({
								buttonNames: ['OK'],
								message: 'Sync complete',
								title: 'Done!'	
							}).show();
							
						}, 1000);
						
						spinner.hide();
					});						
				}
			});
			
			confirmDialog.show();
		});
		
		win.open();
	}	
	else if(Ti.Platform.osname === "android") {		
		var repeatSetting = new ReminderRepeatSetting();
		var reminderExpiry = Ti.App.Properties.getString("ReminderExpiryDate");
		
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

/**
 * @description Event handler for the `btnStepLog` button. Opens the steps view.
 * @memberOf Controllers.Home
 */
function btnStepLog_click() {
	var win = Alloy.createController('steps/steps').getView();
	if(Ti.Platform.osname === "android") {
		win.setAndroidMenuItems();
	}
	win.open();
	
	win.addEventListener('close', function() {
		window_load();		
	});
}

/**
 * @description Event handler for the `btnStatistics` button. Opens the stats view.
 * @memberOf Controllers.Home
 */
function btnStatistics_click() {
	var win = Alloy.createController('stats/stats').getView();
	if(Ti.Platform.osname === "android") {
		win.setAndroidMenuItems();
	}
	win.open();
	
	win.addEventListener('close', function() {
		window_load();		
	});
}

/**
 * @description Event handler for the `btnChallenges` button. Opens the challenges view.
 * @memberOf Controllers.Home
 */
function btnChallenges_click() {
	var win = Alloy.createController('challenges/challenges').getView();
	win.open();
	
	win.addEventListener('close', function() {
		window_load();		
	});
}

/**
 * @description Event handler for the `btnTournaments` button. Opens the tournaments view.
 * @memberOf Controllers.Home
 */
function btnTournaments_click() {
	var win = Alloy.createController('tournaments/tournaments').getView();
	win.open();
	
	win.addEventListener('close', function() {
		window_load();		
	});
}

/**
 * @description Event handler for the `btnSettings` button. Opens the settings view.
 * After the settings view closes, `loginIfNeeded()` is called as the user may have logged out from the settings screen.
 * @memberOf Controllers.Home
 */
function btnSettings_click() {
	var win = Alloy.createController('settings/settings').getView();
	win.open();
	
	win.addEventListener('close', function() {
		window_load();
	});
}

/**
 * @description Event handler for the `back` button on Android devices. Confirms with the user whether or not they want to exit the app and closes this window
 * on confirmation.
 * @memberOf Controllers.Home
 */
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
		}	
	});
	
	confirmDialog.show();
}

/**
 * @description Event handler for the window's `open` event. Adds event listeners for the buttons and calls `loginIfNeeded()`.
 * Also tracks the screen in Google Analytics.
 * @memberOf Controllers.Home
 */
function window_open() {	
	$.homeView.btnStepLog.addEventListener('click', btnStepLog_click);
	$.homeView.btnStatistics.addEventListener('click', btnStatistics_click);
	$.homeView.btnSettings.addEventListener('click', btnSettings_click);
	
	window_load();
}

/**
 * description 'loads' the window. Tracks the screen, calls login if necessary and refreshes the 
 * steps log badge.
 */
function window_load() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Home"
	});
	
	loginIfNeeded();
	
	var numSteps = Alloy.Globals.Steps.readWhereNeedsSyncing().length;
	
	Ti.API.info("Number of unsynced steps: " + numSteps);
	$.homeView.btnStepLog.setBadge(numSteps);
}
