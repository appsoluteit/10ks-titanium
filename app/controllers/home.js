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