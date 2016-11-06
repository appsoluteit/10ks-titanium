// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnBack_click() {
	$.monthlyGraph.close();
}

function window_open() {
	$.monthlyGraphView.monthlyGraphChart.loadChart({
		type: "column",
		name: "Monthly Steps for " + new Date().getFullYear(),
		data: args.data
	});
}