// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnBack_click() {
	$.settings.close();
}

function window_open() {
	//Set child view event handlers
	$.settingsView.btnLogout.addEventListener('click', btnLogout_click);
}

function btnLogout_click() {
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
