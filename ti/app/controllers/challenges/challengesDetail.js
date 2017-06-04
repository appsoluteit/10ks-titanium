// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var ui = require('xp.ui');
var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');

console.log("Opening details window", args);

function window_open() {
	if(Ti.Platform.osname === "android") {
		$.challengesDetail.activity.actionBar.title = args.task.name;
	}
	else {
		$.window.title = args.task.name;
	}	
	
	var descriptionLabel = ui.createLabel({
		html: args.task.description.replace("\n", "<br/>")
	});
	
	$.challengesDetailView.labelContainer.add(descriptionLabel);
	
	var startDate = new Date(args.task.challenge.start_date);
	var endDate = new Date(args.task.challenge.end_date);
	var startedOn = new Date(args.start_date);
	
	//Populate the metrics
	var data = [
		{ title: "Challenge Start:", value: DateTimeHelper.getShortDateLabel(startDate) },
		{ title: "Challenge End:", value: DateTimeHelper.getShortDateLabel(endDate) },
		{ title: "Started On:", value: DateTimeHelper.getShortDateLabel(startedOn) },
		{ title: "Goal Steps:", value: FormatHelper.formatNumber(args.steps_goal) },
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
											 
	//$.challengesDetailView.startedOn.text = "Started On: ";
	//$.challengesDetailView.goalSteps.text = "Goal Steps: ";
	//$.challengesDetailView.stepsWalked.text = "Steps Walked: ";
	//$.challengesDetailView.percentComplete.text = "Percent Complete: ";	
	
	//Construct the bar (todo)								
}

function btnBack_click() {
	$.challengesDetail.close();
}
