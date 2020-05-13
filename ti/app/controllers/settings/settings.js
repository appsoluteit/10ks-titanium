/**
 * @file Settings Controller
 * @description The controller for the settings view.
 * @require helpers/FormatHelper
 * @require classes/AuthProvider
 * @require tests/bootstrap
 * @namespace Controllers.Settings
 */

var APIHelper = require('helpers/APIHelper');
var AuthProvider = require('classes/AuthProvider');
var FormatHelper = require('helpers/FormatHelper');
var NavBarButton = require('classes/NavBarButton');
var SessionHelper = require('helpers/SessionHelper');
var Tests = require('tests/bootstrap');

var args = $.args;
var goalSteps = null;
var hasLoaded = false;

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Settings.
 */
function btnBack_click() {
	$.settings.close();
}

//We need the ability to dynamically add a row to cater for non-debug cases. Sadly though, dynamically created UI objects don't have the alloy styles
//applied, so we have to manually add them here.
function makeRow(title) {
	var row = Ti.UI.createTableViewRow({
		height: "50dp"
	});
	
	row.add(Ti.UI.createLabel({
		text: title,
		left: "10dp",
		textAlign: "left",
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		color: '#000',
		
		font: {
			fontFamily: 'Arial',
			fontSize: '10',
			fontWeight: "bold"
		}
	}));
	
	return row;
}

/**
 * @description Event handler for the Window's `open` event. Sets the goal steps row label to the saved property, if it exists.
 * Adds event listeners for the table rows and, if if `Alloy.Globals.IsDebug` is on, adds an event listener for the 'run tests' row, otherwise
 * 'run tests' is removed.
 * @memberof Controllers.Settings
 */
function window_open() {	
	Ti.API.log('open');

	Alloy.Globals.tracker.addScreenView('Settings');
	
	if(Ti.Platform.osname !== "android") {
		$.window.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click
		});
	}
	
	if(Alloy.Globals.IsDebug) {
		var tblRowTests = makeRow("Run Tests");
		$.settingsView.tblContainer.appendRow(tblRowTests);
		tblRowTests.addEventListener('click', tblRowTests_click);
		
		var tblRowReset = makeRow("Reset");
		$.settingsView.tblContainer.appendRow(tblRowReset);
		tblRowReset.addEventListener('click', tblRowReset_click);

		// ios module tests
		var TestModule = require('ti.healthkit');
		var tblTestProperty = makeRow('Test module');
		$.settingsView.tblContainer.appendRow(tblTestProperty);
		tblTestProperty.addEventListener('click', function() {
			Ti.API.info('Test property: ' + TestModule.exampleProp);
			Ti.API.info('Test function: ' + TestModule.example());
		});
	}
	
	//Set child view event handlers
	$.settingsView.tblRowLogout.addEventListener('click', tblRowLogout_click);
	$.settingsView.tblRowGoalSteps.addEventListener('click', tblRowGoalSteps_click);
}

function window_focus() {
	Ti.API.log('focus');
	
	if(!hasLoaded) {
		hasLoaded = true;
		loadGoalSteps();
	}
}

function loadGoalSteps() {
	function onSuccess(response) {
		if(response.results && response.results.length) {
			//There may be multiple goals in the response. Just take the first (most recent)
			goalSteps = response.results[0].goal * 1;
			Ti.API.info("Saving goal steps:", goalSteps);
			
			if(goalSteps) {
				$.settingsView.lblGoalSteps.text = FormatHelper.formatNumber(goalSteps);
			}
		}
	}
	
	function onFail(reason) {
		Ti.API.error(reason);
		
		if(SessionHelper.isTokenInvalid(reason)) {
			SessionHelper.showInvalidTokenToast($.settings);
			
			setTimeout(showLogin, 2000);
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't fetch your goal setting",
				duration: 2000,
				view: $.settings,
				theme: "error"
			});	
		}
	}
	
	APIHelper.get({
		message: "Loading Goal Steps",
		url:		"goals/",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
}

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
	
	win.addEventListener("close", function() {
		loadGoalSteps();
	});
}

/**
 * @description Event handler for `tblRowReminder`. Opens the reminder view.
 * @memberof Controllers.Settings
 */
function tblRowReminder_click() {
	if(Alloy.Globals.IsDebug) {
		var win = Alloy.createController('settings/reminder/reminder').getView();
		win.open();	
	}
	else {
		Ti.Platform.openURL('https://www.10000steps.org.au/profile/subscriptions/');
	}
}

/**
 * @description Event handler for `tblRowGoalSteps`. Opens the goal steps view.
 * @memberof Controllers.Settings
 */
function tblRowGoalSteps_click() {
	var win = Alloy.createController('settings/goalSteps', {
		goalSteps: goalSteps,
		
		callback: function(goalSteps) {
			var formatted = FormatHelper.formatNumber(goalSteps);
			$.settingsView.lblGoalSteps.text = formatted;
		}		
	}).getView();
	
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
			var authProvider = new AuthProvider();
			
			authProvider.logout().then(function onSuccess() {
				Alloy.createWidget("com.mcongrove.toast", null, {
					text: "Logged out successfully",
					duration: 2000,
					view: $.settings,
					theme: "success"
				});	
				
				setTimeout(function() {
					$.settings.close();
				}, 2000);
			});
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

/**
 * @description Event handler for `tblRowReset`. This will only appear if `Alloy.Globals.IsDebug` is turned on. It removes all logged
 * steps from local storage.
 * @memberof Controllers.Settings
 */
function tblRowReset_click() {
	Alloy.Globals.Steps.removeAll();
	alert("Steps data removed");
}