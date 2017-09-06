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

//Returns the smaller of two dimensions. Useful for trying to programatically toggle between the window height or width 
//under circumstances whereby the runtime hasn't responded to an orientation change yet.
function smallerOf(options) {
	var smallest = undefined;
	
	for(var i = 0; i < options.length; i++) {
		if(options[i] < smallest || smallest === undefined) {
			smallest = options[i];
		}
	}
	
	return smallest;
}

function showChart() {
	var options = [
		Ti.Platform.displayCaps.platformHeight,
		Ti.Platform.displayCaps.platformWidth,
		$.dailyGraph.rect.height,
		$.dailyGraph.rect.width	
	];
	
	if(Ti.Platform.osname !== "android") {
		options.push($.dailyGraphWindow.rect.height);
		options.push($.dailyGraphWindow.rect.width);
	}
	
	var viewHeight = smallerOf(options);
	
	Ti.API.info("Webview Height: ", viewHeight);
	
	var goalSteps = Ti.App.Properties.getInt("goalSteps", 0);
	
	var currentMonthLabel = DateTimeHelper.getCurrentMonthName();
		
	if(hasSteps()) {		
		$.dailyGraphView.dailyGraphChart.loadChart({
			type: "column",
			name: "Daily Steps for " + currentMonthLabel,
			data: args.data,
			goalSteps: goalSteps,
			showGoalSteps: true,
			chartHeight: viewHeight
		});	
	}
	else {		
		$.dailyGraphView.dailyGraphChart.showMessage("No steps logged for " + currentMonthLabel);	
	}
}

function window_open() {	
	//Redraw the chart after an orientation change to use the right dimensions
	Ti.Gesture.addEventListener('orientationchange',function(e) {		
		Ti.API.info("Orientation change detected.");
		showChart();
	});
	
	Alloy.Globals.tracker.trackScreen({
		screenName: "Daily Graph"
	});
	
	showChart();
}