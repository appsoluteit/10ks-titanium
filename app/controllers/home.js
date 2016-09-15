// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnStepLog_click(e) {
	var win = Alloy.createController('log/log').getView();
	
	win.addEventListener('open', function() {
		var anim = Ti.UI.createAnimation({
			left: 0,
			duration: 1000
		});
		
		win.animate(anim);
		
		/*
		setTimeout(function() {
			$.login.close();
		}, 1000);
		*/
	});
	
	win.open();
}

function btnStatistics_click(e) {
	alert("Clicked stats");
}

function btnChallenges_click(e) {
	alert("Clicked challenges");
}

function btnTournaments_click(e) {
	alert("Clicked tournaments");
}

function btnSettings_click(e) {
	alert("Clicked settings");
}
