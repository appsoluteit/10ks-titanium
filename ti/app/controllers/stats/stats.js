/**
 * @file Stats Controller
 * @description The controller for the stats view.
 * @require helpers/FormatHelper
 * @require helpers/DateTimeHelper
 * @require helpers/APIHelper
 * @namespace Controllers.Stats
 * @todo Possibly let the user choose for which month / year they want to run the graphs? Popup dialog?
 */

var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');
var APIHelper = require('helpers/APIHelper');
var StepsProvider = require('classes/StepsProvider');

var args = $.args;
var stepsProvider = new StepsProvider();

/**
 * @description Gets statistics from the /api/stats/ and populates the table with the results. Some statistics may come
 * from local storage as well.
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
	
		var lifeTimeSteps = Alloy.Globals.Steps.readLifeTimeSteps();
		$.statsView.lblLifeTimeSteps.text = FormatHelper.formatNumber(lifeTimeSteps);
		
		var monthlySteps = Alloy.Globals.Steps.readByMonthForYear(new Date().getFullYear());
		var yearlyTotal = 0;
		monthlySteps.forEach(function(item) {
			yearlyTotal += item;
		});
		
		$.statsView.lblYearlySteps.text = FormatHelper.formatNumber(yearlyTotal);
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
 */
function tblRowDailyGraph_click() {
	var dailyData = Alloy.Globals.Steps.readByDayForMonth(new Date().getMonth() + 1, new Date().getFullYear());

	Ti.API.info("Daily data:");
	Ti.API.info(dailyData);

	var chartData = [];
	var dayIndex = 1;
	
	dailyData.forEach(function(steps) {
		chartData.push({
			name: dayIndex + "/" + (new Date().getMonth() + 1),
			x: dayIndex,
			y: steps
		});
		
		dayIndex++;
	});

	var win = Alloy.createController("stats/dailyGraph", {
		data: chartData
	}).getView();
	win.open();
}

/**
 * @description Event handler for `tblRowMonthlyGraph`. Opens the monthly graph window.
 * @memberof Controllers.Stats
 */
function tblRowMonthlyGraph_click() {
	var monthData = Alloy.Globals.Steps.readByMonthForYear(new Date().getFullYear());
	var chartData = [];
	var monthIndex = 1;
	
	monthData.forEach(function(monthSteps) {
		chartData.push({
			name: DateTimeHelper.getMonthNameFromIndex(monthIndex - 1),
			x: monthIndex,
			y: monthSteps
		});
		
		monthIndex++;
	});
	
	var win = Alloy.createController("stats/monthlyGraph", {
		data: chartData
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

function load() {
	if(Alloy.Globals.Steps.models.length === 0) {
		var confirmDialog = Ti.UI.createAlertDialog({
			cancel: 0,
			buttonNames: ['Cancel', 'OK'],
			message: 'There are no saved steps on your device. You may need to perform a sync if you already have existing data. Do you want to sync now?',
			title: 'No saved steps'
		});
		
		confirmDialog.addEventListener('click', function(e) {
			if(e.index !== e.source.cancel) {
				try {
					stepsProvider.sync($.statsView, function() {
						Ti.API.info("sync complete. Calculating stats");
						calculateStatistics();
					});						
				}
				catch(e) {
					if(e==="InvalidToken") {
						setTimeout(function() {
							var win = Alloy.createController("auth/login").getView();
							win.open();
						
							win.addEventListener("close", function() {
								load();
							});
						}, 2000);
					}
				}
			}
			else {
				setTimeout(function() {
					calculateStatistics();
				}, 1000);				
			}
		});
		
		confirmDialog.show();
	}
	else {
		setTimeout(function() {
			calculateStatistics();
		}, 1000);	
	}
}

/**
 * @description Event handler for the Window's `open` event. Presets the row values and calls `calculateStatistics()` after a 1000ms timeout.
 * @memberof Controllers.Stats
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Statistics"
	});
	
	var goalSteps = Ti.App.Properties.getInt("GoalSteps", 0);
	
	$.statsView.lblAvgSteps.text = 0;
	$.statsView.lblBusiestDay.text = 0;	
	$.statsView.lblBusiestMonth.text = 0;
	$.statsView.lblGoalSteps.text = FormatHelper.formatNumber(goalSteps);
	$.statsView.lblLifeTimeSteps.text = 0;
	$.statsView.lblYearlySteps.text = 0;
	$.statsView.lblYearlyStepsTitle.text = new Date().getFullYear() + " steps:";
	
	$.statsView.tblRowDailyGraph.addEventListener('click', tblRowDailyGraph_click);
	$.statsView.tblRowMonthlyGraph.addEventListener('click', tblRowMonthlyGraph_click);
	
	load();
}
