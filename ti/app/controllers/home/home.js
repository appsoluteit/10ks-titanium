/**
 * @file Home Controller
 * @requires classes/CalendarFactory
 * @requires classes/ReminderRepeatSetting
 * @requires analytics.google
 * @description The controller for the home view. This is the first view shown to the user.
 * @namespace Controllers.Home
 */


var StepsProvider = require('classes/StepsProvider');
var stepsProvider = new StepsProvider();
var ChallengesProvider = require('classes/ChallengesProvider');
var SessionHelper = require('helpers/SessionHelper');

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
					Alloy.Globals.Spinner.show("Syncing...");

					var onComplete = function(message) {
						setTimeout(function() {
							if(message) {
								Ti.UI.createAlertDialog({
									buttonNames: ['OK'],
									message: 'Sync completed with error: ' + message,
									title: 'Done!'
								}).show();
							}
							else {
								Ti.UI.createAlertDialog({
									buttonNames: ['OK'],
									message: 'Sync complete',
									title: 'Done!'
								}).show();
							}

						}, 1000);

						Alloy.Globals.Spinner.hide();
					};

					var onProgress = function(message) {
						Ti.API.info("On progress: " + message);
						Alloy.Globals.Spinner.show(message);
					};

					//This may throw an InvalidToken exception, but since the user had "just" logged in,
					//that should never happen.
					stepsProvider.sync($.home, {
						onComplete: onComplete,
						onProgress: onProgress
					});
				}
			});

			confirmDialog.show();
		});

		win.open();
	}
}

function btnAbout_click() {
	var win = Alloy.createController('about/about').getView();
	win.open();
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
	// Show the active challenge or show the active challenge option? First check if the user
	// has already joined a challenge task.

	fetchActiveTask();
}

function fetchActiveTask() {
	Alloy.Globals.Spinner.show("Loading Current Challenge ...");

	var challengesProvider = new ChallengesProvider();

	function onSuccess(result) {
		if(!result) {
			// no active task. Load the challenge.
			var win = Alloy.createController('challenges/challenges').getView();
			win.open();
		}
		else {
			// we have an active task. Go straight to the progress page.
			challengesProvider
				.getTask(result.task)
				.then(function(taskContent) {
					Alloy.Globals.Spinner.hide();
					
					var win = Alloy.createController('challenges/challengeProgress', {
						challenge: taskContent
					}).getView();	

					win.open();
				});
		}
	}

	function onFail(reason) {
		Ti.API.error(reason);
			
		Alloy.Globals.Spinner.hide();
		if(SessionHelper.isTokenInvalid(reason)) {
			SessionHelper.showInvalidTokenToast($.home);
			
			setTimeout(function() {
				showLogin();
			}, 2000);
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't load current Challenge",
				duration: 2000,
				view: $.home,
				theme: "error"
			});	
		}			
	}

	challengesProvider.getActiveTask().then(onSuccess, onFail);
}

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
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

function lblWebsiteLink_click() {
	Ti.Platform.openURL(Alloy.Globals.WebURL);
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
	$.homeView.btnTournaments.addEventListener('click', btnTournaments_click);
	$.homeView.btnChallenges.addEventListener('click', btnChallenges_click);
	$.homeView.btnSettings.addEventListener('click', btnSettings_click);
	$.homeView.btnAbout.addEventListener('click', btnAbout_click);
	$.homeView.lblWebsiteLink.addEventListener('click', lblWebsiteLink_click);

	window_load();
}

/**
 * description 'loads' the window. Tracks the screen, calls login if necessary and refreshes the
 * steps log badge.
 */
function window_load() {
	if(Alloy.Globals.Env === 'Development') {
		// If in development, we don't want to trigger false-positive stats
		// to send to Firebase Analytics. So we expose a constant with the same
		// interface and exit early.
	
		Alloy.Globals.tracker = {
			addScreenView: function(screenName) {
				Ti.API.info('Logging ' + screenName);
			}
		};
	}
	else {
		var FirebaseCore = require('firebase.core');	
		var FirebaseAnalytics = require('firebase.analytics');

		// Configure Firebase
		FirebaseCore.configure();
		
		if(Alloy.Globals.IsLoggedIn) {
			FirebaseAnalytics.userID = Alloy.Globals.AuthKey;
		}
		
		Alloy.Globals.tracker = {
			addScreenView: function(screenName) {
				FirebaseAnalytics.setScreenNameAndScreenClass({
					screenName: screenName,
					screenClass: screenName
				});	
			}
		};
	}

	Alloy.Globals.tracker.addScreenView('Home');

	loginIfNeeded();

	var numSteps = Alloy.Globals.Steps.readWhereNeedsSyncing().length;

	Ti.API.info("Number of unsynced steps: " + numSteps);
	if(Ti.Platform.osname === "android") {
		if(numSteps > 99) {
			numSteps = 99;
		}

		if(numSteps === 0) {
			$.homeView.btnStepLog.image = '/common/home/v2/steps@4x.png';
		}
		else {
			$.homeView.btnStepLog.image = '/steps/steps_' + numSteps + '.png';
		}
	}
	else {
		$.homeView.btnStepLog.setBadge(numSteps);
	}
}
