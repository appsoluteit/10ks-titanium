var DateTimeHelper = require("helpers/DateTimeHelper");
var args = $.args;

function btnBack_click() {
	$.dailyGraph.close();
}

function window_open() {
	var currentMonthLabel = DateTimeHelper.getCurrentMonthName();
	
	$.dailyGraphView.dailyGraphChart.loadChart({
		type: "column",
		name: "Daily Steps for " + currentMonthLabel,
		data: args.data
	});
}