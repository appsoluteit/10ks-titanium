// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnBack_click() {
	$.monthlyGraph.close();
}


function hasSteps() {
	return args.data.filter(function(item) {
		return item.y > 0;
	}).length > 0;
}

function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Monthly Graph"
	});
	
	var platformHeight = Ti.Platform.displayCaps.platformHeight;
	var platformWidth = Ti.Platform.displayCaps.platformWidth;
	
	if(platformHeight > platformWidth) {
		//The displayCaps object is still using portrait dimensions. Manually re-assign
		var tmp = platformHeight;
		platformHeight = platformWidth;
		platformWidth = tmp;	
	}
		
	if(hasSteps()) {
		$.monthlyGraphView.monthlyGraphChart.loadChart({
			type: "column",
			name: "Monthly Steps for " + new Date().getFullYear(),
			data: args.data,
			showGoalSteps: false,
			chartHeight: platformHeight
		});	
	}
	else {
		$.monthlyGraphView.monthlyGraphChart.showMessage("No steps logged for this year");
	}
}