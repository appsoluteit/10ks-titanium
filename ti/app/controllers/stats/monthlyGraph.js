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
	
	var goalSteps = Ti.App.Properties.getInt("goalSteps", 0);
	
	if(hasSteps()) {
		$.monthlyGraphView.monthlyGraphChart.loadChart({
			type: "column",
			name: "Monthly Steps for " + new Date().getFullYear(),
			data: args.data
		}, goalSteps);	
	}
	else {
		$.monthlyGraphView.monthlyGraphChart.showMessage("No steps logged for this year");
	}
}