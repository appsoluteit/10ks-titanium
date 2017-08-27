var DateTimeHelper = require("helpers/DateTimeHelper");
var args = $.args;

function btnBack_click() {
	$.dailyGraph.close();
}

function hasSteps() {
	return args.data.filter(function(item) {
		return item.y > 0;
	}).length > 0;
}

function window_open() {
	if(Ti.Platform.osname !== "android") {
		$.dailyGraphWindow.setOrientationModes([
			Ti.UI.LANDSCAPE_LEFT
		]);
	}
	
	var goalSteps = Ti.App.Properties.getInt("goalSteps", 0);
	
	Alloy.Globals.tracker.trackScreen({
		screenName: "Daily Graph"
	});
	
	var currentMonthLabel = DateTimeHelper.getCurrentMonthName();
		
	if(hasSteps()) {
		Ti.API.info("Has steps");
		
		$.dailyGraphView.dailyGraphChart.loadChart({
			type: "column",
			name: "Daily Steps for " + currentMonthLabel,
			data: args.data
		}, goalSteps);	
	}
	else {
		Ti.API.info("No steps");
		
		$.dailyGraphView.dailyGraphChart.showMessage("No steps logged for " + currentMonthLabel);	
	}
}