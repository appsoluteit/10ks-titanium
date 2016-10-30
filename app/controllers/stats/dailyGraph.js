// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnBack_click() {
	$.dailyGraph.close();
}

function window_open() {
	$.dailyGraphView.dailyGraphChart.loadChart({
		type: "column",
		name: "My faviourite fruit",
		data: [
			{ name: "Apples", x: 0, y: 1 },
			{ name: "Oranges", x: 1, y: 5 },
			{ name: "Bananas", x: 2, y: 9 }
		]
	});
}