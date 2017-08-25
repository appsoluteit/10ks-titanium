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
	
	/*
	//Populate the metrics
	var data = [
		{ title: "Challenge Start:", value: DateTimeHelper.getShortDateLabel(startDate) },
		{ title: "Challenge End:", value: DateTimeHelper.getShortDateLabel(endDate) },
		{ title: "Started On:", value: DateTimeHelper.getShortDateLabel(startedOn) },
		{ title: "Steps Walked:", value: FormatHelper.formatNumber(args.steps_total) },
		{ title: "Percent Complete:", value: args.percentage_complete + "%" }
	];
	
	data.forEach(function(item) {
		console.log("Showing ", item);
		
		var row = Ti.UI.createTableViewRow({
			height: Ti.UI.SIZE
		});
		
		var left = Ti.UI.createLabel({
			left: '5dp',
			font: {
				fontWeight: 'bold'
			},
			text: item.title
		});
		
		var right = Ti.UI.createLabel({
			right: '5dp',
			text: item.value,
			height: Ti.UI.SIZE,
			wordWrap: true
		});
		
		row.add(left);
		row.add(right);
		
		$.challengesDetailView.tblMetrics.appendRow(row);
	});	
	*/
}

function btnDetails_click() {
	
}

function btnGraph_click() {
	
}