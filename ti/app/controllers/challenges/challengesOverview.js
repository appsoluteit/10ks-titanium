var args = $.args;
var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');

function btnBack_click() {
	$.challengesOverview.close();
}

function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Challenge Detail"
	});
	
	if(Ti.Platform.osname === "android") {
		$.challengesOverview.activity.actionBar.title = args.task.name;
	}
	else {
		$.window.title = args.task.name;
	}	
	
	var startDate = new Date(args.task.challenge.start_date);
	var endDate = new Date(args.task.challenge.end_date);
	var startedOn = new Date(args.start_date);
	
	$.challengesOverviewView.lblGoalSteps.text = FormatHelper.formatNumber(args.steps_goal);
	
	$.challengesOverviewView.btnDetails.addEventListener('click', btnDetails_click);
	$.challengesOverviewView.btnGraph.addEventListener('click', btnGraph_click);
}

function btnDetails_click() {
	var win = Alloy.createController('challenges/challengesDetail', args).getView();
	win.open();
}

function btnGraph_click() {
	alert("Coming soon!");
}