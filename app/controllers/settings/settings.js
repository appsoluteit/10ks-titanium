// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnBack_click() {
	$.settings.close();
}

function window_open() {
	//Set child view event handlers
	$.settingsView.tblRowReminder.addEventListener('click', tblRowReminder_click);
	$.settingsView.tblRowGoalSteps.addEventListener('click', tblRowGoalSteps_click);
	$.settingsView.tblRowAbout.addEventListener('click', tblRowAbout_click);
	$.settingsView.tblRowLogout.addEventListener('click', tblRowLogout_click);
	
	//Pre-load the goal steps
	var goalSteps = Ti.App.Properties.getInt("GoalSteps", -1);
	
	if(goalSteps > -1) {
		$.settingsView.lblGoalSteps.text = Alloy.Globals.FormatNumber(goalSteps);
	}
}

function tblRowReminder_click() {
	var win = Alloy.createController('settings/reminder/reminder').getView();
	win.open();
}

function tblRowGoalSteps_click() {
	var win = Alloy.createController('settings/goalSteps', {
		callback: function(goalSteps) {
			var formatted = Alloy.Globals.FormatNumber(goalSteps);
			$.settingsView.lblGoalSteps.text = formatted;
		}		
	}).getView();
	
	win.open();
}

function tblRowAbout_click() {
	var win = Alloy.createController('settings/about').getView();
	win.open();
}

function tblRowLogout_click() {
	var confirmDialog = Ti.UI.createAlertDialog({
		cancel: 0,
		buttonNames: ['Cancel', 'OK'],
		message: 'Are you sure you want to logout?',
		title: 'Logout?'
	});
	
	confirmDialog.addEventListener('click', function(e) {
		if(e.index !== e.source.cancel) {
			$.settings.close();
			args.logoutCallback();
		}	
	});
	
	confirmDialog.show();
}
