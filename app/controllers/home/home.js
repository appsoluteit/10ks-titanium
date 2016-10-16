// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnStepLog_click(e) {
	var win = Alloy.createController('log/log').getView();
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
	var win = Alloy.createController('settings/settings', {
		logoutCallback: function() {
			Ti.API.info("logging out...");
			
			$.home.close();
			args.logoutCallback();
		}	
	}).getView();
	
	win.open();
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
	$.homeView.btnChallenges.addEventListener('click', btnChallenges_click);
	$.homeView.btnSettings.addEventListener('click', btnSettings_click);
}