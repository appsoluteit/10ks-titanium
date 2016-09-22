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
}

function tblRowReminder_click() {
	alert("Clicked reminder");
}

function tblRowGoalSteps_click() {
	alert("Clicked goal steps");
}

function tblRowAbout_click() {
	alert("Clicked about");
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
