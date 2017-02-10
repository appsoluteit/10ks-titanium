// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnBack_click() {
	$.dailyGraph.close();
}

function window_open() {
	var currentMonthLabel = Alloy.Globals.GetCurrentMonthName();
	
	$.dailyGraphView.dailyGraphChart.loadChart({
		type: "column",
		name: "Daily Steps for " + currentMonthLabel,
		data: args.data
	});
}