var args = $.args;

function loginIfNeeded() {
	if(!Alloy.Globals.IsLoggedIn) {
		win = Alloy.createController('auth/login').getView();
		win.open();
	}	
	else if(Ti.Platform.osname === "android") {
		//TODO: If we need to set the reminders, have the user select a calender and do it.
		//(Only do this if the reminders are about to expire or it could get annoying)
		
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