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
function smallerOf(x, y) {
	if(x > y) {
		return y;
	}
	else {
		return x;
	}
}

function window_open() {	
	Ti.Gesture.addEventListener('orientationchange',function(e) {
		//e.source.isPortrait()
		
		Ti.API.info("Orientation change detected.");
		var platformHeight = smallerOf(
			Ti.Platform.displayCaps.platformHeight,
			Ti.Platform.displayCaps.platformWidth
		);
		
		var windowHeight = smallerOf(
			$.dailyGraphWindow.rect.height,
			$.dailyGraphWindow.rect.width
		);
		
		var navWindowHeight = smallerOf(
			$.dailyGraph.rect.height,
			$.dailyGraph.rect.width
		);
		
		Ti.API.info("Platform height:", platformHeight, "Window Height:", windowHeight, "Nav height:", navWindowHeight);	
	});
	
	var goalSteps = Ti.App.Properties.getInt("goalSteps", 0);
	
	Alloy.Globals.tracker.trackScreen({
		screenName: "Daily Graph"
	});
	
	var currentMonthLabel = DateTimeHelper.getCurrentMonthName();
		
	if(hasSteps()) {
		Ti.API.info("Has steps");
		
		var platformHeight = smallerOf(
			Ti.Platform.displayCaps.platformHeight,
			Ti.Platform.displayCaps.platformWidth
		);
		
		var windowHeight = smallerOf(
			$.dailyGraphWindow.rect.height,
			$.dailyGraphWindow.rect.width
		);
		
		var navWindowHeight = smallerOf(
			$.dailyGraph.rect.height,
			$.dailyGraph.rect.width
		);
		
		Ti.API.info("Platform height:", platformHeight, "Window Height:", windowHeight, "Nav height:", navWindowHeight);
		
		$.dailyGraphView.dailyGraphChart.loadChart({
			type: "column",
			name: "Daily Steps for " + currentMonthLabel,
			data: args.data,
			goalSteps: goalSteps,
			showGoalSteps: true,
			chartHeight: $.dailyGraphWindow.rect.height //pass in the height of the window
		});	
	}
	else {
		Ti.API.info("No steps");
		
		$.dailyGraphView.dailyGraphChart.showMessage("No steps logged for " + currentMonthLabel);	
	}
}