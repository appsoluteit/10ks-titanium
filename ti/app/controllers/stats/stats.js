/**
 * @file Stats Controller
 * @description The controller for the stats view.
 * @require helpers/FormatHelper
 * @require helpers/DateTimeHelper
 * @require helpers/APIHelper
 * @namespace Controllers.Stats
 * @todo This controller is incomplete
 */

var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');
var APIHelper = require('helpers/APIHelper');

var args = $.args;

/**
 * @description Gets statistics from the /api/stats/ and populates the table with the results.
 * @memberof Controllers.Stats
 */
function calculateStatistics() {
	function onSuccess(response) {
		Ti.API.info("Get steps success", JSON.stringify(response));

		if(response.max_month) {
			if(response.max_month.month) {
				var busiestMonth = new Date(response.max_month.month);
				$.statsView.lblBusiestMonth.text = DateTimeHelper.getMonthLabel(busiestMonth);	
			}	
			
			if(response.max_month.total) {
				$.statsView.lblBusiestMonthSteps.text = "(" + FormatHelper.formatNumber(response.max_month.total) + " steps)";
			}
		}
		
		if(response.max_day) {
			if(response.max_day.steps_date) {
				var busiestDay = new Date(response.max_day.steps_date);
				$.statsView.lblBusiestDay.text = DateTimeHelper.getDateLabel(busiestDay, true);	
			}
			
			if(response.max_day.steps_total) {
				$.statsView.lblBusiestDaySteps.text = "(" + FormatHelper.formatNumber(response.max_day.steps_total) + " steps)";
			}
		}
		
		if(response.average_steps) {
			$.statsView.lblAvgSteps.text = FormatHelper.formatNumber(response.average_steps);
		}
	}
	
	function onFail(response) {
		Ti.API.info("Get stats fail", JSON.stringify(response));
		
		if(response.detail) {
			//If the token expired, open the login window to login again
			if(response.detail === "Invalid token.") {
				Alloy.createWidget("com.mcongrove.toast", null, {
					text: "Session expired. Please log in again.",
					duration: 2000,
					view: $.stats,
					theme: "error"
				});
				
				setTimeout(function() {
					var win = Alloy.createController("auth/login").getView();
					win.open();
					
					win.addEventListener("close", function() {
						calculateStatistics();
					});
				}, 2000);
			}
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't get statistics",
				duration: 2000,
				view: $.stats,
				theme: "error"
			});	
		}
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	APIHelper.get({
		message:	"Calculating statistics...",
		url:		"stats/", 
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
}

/**
 * @description Event handler for `tblRowDailyGraph`. Opens the daily graph window.
 * @memberof Controllers.Stats
 * @todo `tblRowDailyGraph` is currently hidden from the view pending aggregation logic to generate the graph.
 */
function tblRowDailyGraph_click() {
	var data = [];
	
	//TODO: pass in real values
	for(var i = 1; i < 31; i++) {
		data.push({
			name: i + "/10/2016",
			x: i,
			y: Math.floor((Math.random() * 10000) + 1)
		});
	}

	var win = Alloy.createController("stats/dailyGraph", {
		data: data
	}).getView();
	win.open();
}

/**
 * @description Event handler for `tblRowMonthlyGraph`. Opens the monthly graph window.
 * @memberof Controllers.Stats
 * @todo `tblRowMonthlyGraph` is currently hidden from the view pending aggregation logic to generate the graph.
 */
function tblRowMonthlyGraph_click() {
	var data = [];
	
	//TODO: Pass in real values
	for(var i = 1; i < 13; i++) {
		data.push({
			name: DateTimeHelper.getMonthNameFromIndex(i - 1),
			x: i,
			y: Math.floor((Math.random() * 10000) + 1) * 30
		});
	}
	
	var win = Alloy.createController("stats/monthlyGraph", {
		data: data
	}).getView();
	win.open();
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Stats
 */
function btnBack_click() {
	$.stats.close();
}

/**
 * @description Event handler for the Window's `open` event. Presets the row values and calls `calculateStatistics()` after a 1000ms timeout.
 * @memberof Controllers.Stats
 * @todo Enable click events for `tblRowDailyGraph` and `tblRowMonthlyGraph` after the necessary aggregation logic is done.
 */
function window_open() {
	var goalSteps = Ti.App.Properties.getInt("GoalSteps", 0);
	
	$.statsView.lblGoalSteps.text = FormatHelper.formatNumber(goalSteps);
	$.statsView.lblAvgSteps.text = 0;
	$.statsView.lblBusiestMonth.text = 0;
	$.statsView.lblBusiestDay.text = 0;
	
	//$.statsView.tblRowDailyGraph.addEventListener('click', tblRowDailyGraph_click);
	//$.statsView.tblRowMonthlyGraph.addEventListener('click', tblRowMonthlyGraph_click);
	
	setTimeout(function() {
		calculateStatistics();
	}, 1000);
}
