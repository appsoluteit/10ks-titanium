/**
 * @file Settings Controller
 * @description The controller for the settings view.
 * @require helpers/FormatHelper
 * @require classes/AuthProvider
 * @require tests/bootstrap
 * @namespace Controllers.Settings
 */

var FormatHelper = require("helpers/FormatHelper");
var AuthProvider = require('classes/AuthProvider');
var Tests = require('tests/bootstrap');

var args = $.args;

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Settings.
 */
function btnBack_click() {
	$.settings.close();
}

/**
 * @description Event handler for the Window's `open` event. Sets the goal steps row label to the saved property, if it exists.
 * Adds event listeners for the table rows and, if if `Alloy.Globals.IsDebug` is on, adds an event listener for the 'run tests' row, otherwise
 * 'run tests' is removed.
 * @memberof Controllers.Settings
 */
function window_open() {
	//Pre-load the goal steps
	var goalSteps = Ti.App.Properties.getInt("GoalSteps", -1);
	
	if(goalSteps > -1) {
		$.settingsView.lblGoalSteps.text = FormatHelper.formatNumber(goalSteps);
	}
	
	if(Alloy.Globals.IsDebug) {
		$.settingsView.tblRowRunTests.addEventListener('click', tblRowTests_click);
	}
	else {
		$.settingsView.tblContainer.deleteRow($.settingsView.tblRowRunTests);
	}
	
	//Set child view event handlers
	$.settingsView.tblRowReminder.addEventListener('click', tblRowReminder_click);
	$.settingsView.tblRowGoalSteps.addEventListener('click', tblRowGoalSteps_click);
	$.settingsView.tblRowAbout.addEventListener('click', tblRowAbout_click);
	$.settingsView.tblRowLogout.addEventListener('click', tblRowLogout_click);
}

/**
 * @description Event handler for `tblRowReminder`. Opens the reminder view.
 * @memberof Controllers.Settings
 */
function tblRowReminder_click() {
	var win = Alloy.createController('settings/reminder/reminder').getView();
	win.open();
}

/**
 * @description Event handler for `tblRowGoalSteps`. Opens the goal steps view.
 * @memberof Controllers.Settings
 */
function tblRowGoalSteps_click() {
	var win = Alloy.createController('settings/goalSteps', {
		callback: function(goalSteps) {
			var formatted = FormatHelper.formatNumber(goalSteps);
			$.settingsView.lblGoalSteps.text = formatted;
		}		
	}).getView();
	
	win.open();
}

/**
 * @description Event handler for `tblRowAbout`. Opens the about view.
 * @memberof Controllers.Settings
 */
function tblRowAbout_click() {
	var win = Alloy.createController('settings/about').getView();
	win.open();
}

/**
 * @description Event handler for `tblRowLogout`. Prompts the user if they want to log out and, if confirmed, logs them out by calling
 * `logout()` on the AuthProvider, which if successful, will close this window.
 * @memberof Controllers.Settings
 */
function tblRowLogout_click() {
	var confirmDialog = Ti.UI.createAlertDialog({
		cancel: 0,
		buttonNames: ['Cancel', 'OK'],
		message: 'Are you sure you want to logout?',
		title: 'Logout?'
	});
	
	confirmDialog.addEventListener('click', function(e) {
		if(e.index !== e.source.cancel) {
			var authProvider = new AuthProvider($.settings, $.settings);
			authProvider.logout();
		}	
	});
	
	confirmDialog.show();
}

/**
 * @description Event handler for `tblRowTests`. This will only appear if `Alloy.Globals.IsDebug` is turned on. It runs each of the unit tests
 * for the application, the results of which will be displayed in the Studio Console.
 * @memberof Controllers.Settings
 */
function tblRowTests_click() {
	Tests.run();
}