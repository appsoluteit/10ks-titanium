var args = $.args;
var ui = require('xp.ui');
var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');

console.log("Opening details window", args);

function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Race Tournament Details"
	});
	
	if(Ti.Platform.osname === "android") {
		$.racesDetail.activity.actionBar.title = "Race";
	}
	else {
		$.window.title = "Race";
	}	
	
	var descriptionLabel = ui.createLabel({
		html: args.team.tournament.tournament.description.replace("\n", "<br/>")
	});
	
	$.racesDetailView.labelContainer.add(descriptionLabel);
	
	var startDate = new Date(args.date_started);
	
	//Populate the metrics
	var data = [
		{ title: "Race Start:", value: DateTimeHelper.getShortDateLabel(startDate) },
		{ title: "Distance (m):", value: FormatHelper.formatNumber(args.team.tournament.tournament.distance_metres) },
		{ title: "Total Steps:", value: FormatHelper.formatNumber(args.team.tournament.tournament.total_steps) },
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
		
		$.racesDetailView.tblMetrics.appendRow(row);
	});							
}

function btnBack_click() {
	$.racesDetail.close();
}
