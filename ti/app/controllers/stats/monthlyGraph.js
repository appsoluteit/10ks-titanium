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
		$.monthlyGraph.rect.height,
		$.monthlyGraph.rect.width	
	];
	
	if(Ti.Platform.osname !== "android") {
		options.push($.monthlyGraphWindow.rect.height);
		options.push($.monthlyGraphWindow.rect.width);
	}
	
	var viewHeight = smallerOf(options);
	
	if(hasSteps()) {
		$.monthlyGraphView.monthlyGraphChart.loadChart({
			type: "column",
			name: "Monthly Steps for " + new Date().getFullYear(),
			data: args.data,
			showGoalSteps: false,
			chartHeight: viewHeight
		});	
	}
	else {
		$.monthlyGraphView.monthlyGraphChart.showMessage("No steps logged for this year");
	}
}

function window_open() {
	//Redraw the chart after an orientation change to use the right dimensions
	Ti.Gesture.addEventListener('orientationchange',function(e) {		
		Ti.API.info("Orientation change detected.");
		showChart();
	});
	
	Alloy.Globals.tracker.trackScreen({
		screenName: "Monthly Graph"
	});
	
	showChart();
}