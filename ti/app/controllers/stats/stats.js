/**
 * @file Stats Controller
 * @description The controller for the stats view.
 * @require helpers/FormatHelper
 * @require helpers/DateTimeHelper
 * @require helpers/APIHelper
 * @namespace Controllers.Stats
 * @todo Possibly let the user choose for which month / year they want to run the graphs? Popup dialog?
 */

var q = require('q');
var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');
var APIHelper = require('helpers/APIHelper');
var SessionHelper = require('helpers/SessionHelper');
var StepsProvider = require('classes/StepsProvider');
var AuthProvider = require('classes/AuthProvider');
var NavBarButton = require('classes/NavBarButton');

var args = $.args;
var stepsProvider = new StepsProvider();
var authProvider = new AuthProvider($.stats, $.statsView);
var spinner = Alloy.createWidget('nl.fokkezb.loading');

function showLogin() {
	setTimeout(function() {
		var win = Alloy.createController("auth/login").getView();
		win.open();
		
		win.addEventListener("close", function() {
			loadStatistics();
		});
	}, 2000);
}

/**
 * @description Gets statistics from the /api/stats/ and populates the table with the results.
 * @memberof Controllers.Stats
 */
function loadStatistics() {
	Ti.API.debug("loading statistics");
	var defer = q.defer();
	
	function onSuccess(response) {
		Ti.API.info("Get stats success", JSON.stringify(response));

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
		
		if(response.seven_day_average) {
			$.statsView.lblSevenDayAverage.text = FormatHelper.formatNumber(response.seven_day_average);
		}
		
		var monthlySteps = Alloy.Globals.Steps.readByMonthForYear(new Date().getFullYear());
		var yearlyTotal = 0;
		monthlySteps.forEach(function(item) {
			yearlyTotal += item;
		});
		
		$.statsView.lblYearlySteps.text = FormatHelper.formatNumber(yearlyTotal);
		
		defer.resolve();
	}
	
	function onFail(response) {
		Ti.API.info("Get stats fail", response);
		defer.reject(response);
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	APIHelper.get({
		url:		"stats/", 
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
	
	return defer.promise;
}

/**
 * @description Gets the total steps from /auth/user/ and populates the table with the results.
 * @memberof Controllers.Stats
 */
function loadLifetimeSteps() {
	var defer = q.defer();
	
	authProvider.getUser().then(function onSuccess() {
		Ti.API.debug("AuthProvider -> getUser resolved");
		
		//Lifetime steps come from /auth/user.
		var total_steps = Ti.App.Properties.getInt("total_steps", 0);
		$.statsView.lblLifeTimeSteps.text = FormatHelper.formatNumber(total_steps);
		
		defer.resolve();
	}, function onFail(reason) {
		Ti.API.debug("Loading user failed. Reason: ", reason);
		defer.reject(reason);
	});
	
	return defer.promise;
}

/**
 * @description Gets the goal steps from /goals/ and populates the table with the results.
 * @memberof Controllers.Stats
 */
function loadGoalSteps() {
	var defer = q.defer();
	
	function onSuccess(response) {
		if(response.results && response.results.length) {
			//There may be multiple goals in the response. Just take the first (most recent)
			var goalSteps = response.results[0].goal * 1;
			Ti.API.debug("Saving goal steps", goalSteps);
			
			if(goalSteps > 0) {
				$.statsView.lblGoalSteps.text = FormatHelper.formatNumber(goalSteps);
				Ti.App.Properties.setInt("goalSteps", goalSteps);
			}
		}
		
		defer.resolve();
	}
	
	function onFail(response) {
		Ti.API.debug("Get goal steps failed.", response);
		defer.reject(response);
	}
	
	APIHelper.get({
		url:		"goals/",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
	
	return defer.promise;
}

function loadPage() {
	//Show a single spinner for the both GET operations
	spinner.show("Loading statistics...");
	
	function onFail(reason) {
		Ti.API.error("Calculating stats failed. Reason = ", reason);
		
		if(SessionHelper.isTokenInvalid(reason)) {
			SessionHelper.showInvalidTokenToast($.stats);
			
			spinner.hide();	//hide the spinner for this attempt
			showLogin();
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't calculate statistics",
				duration: 2000,
				view: $.stats,
				theme: "error"
			});	
		}
	}
	
	loadGoalSteps().then(loadLifetimeSteps)
				   .then(loadStatistics)
				   .then(spinner.hide, onFail);
}

/**
 * @description Event handler for `btnDailyGraph`. Opens the daily graph window.
 * @memberof Controllers.Stats
 */
function btnDailyGraph_click() {
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

	//TODO: Try creating a window the classic way here to create it with a landscape orientation, specifically
	var win = Alloy.createController("stats/dailyGraph", {
		data: chartData
	}).getView();
	win.open();
}

/**
 * @description Event handler for `tblRowMonthlyGraph`. Opens the monthly graph window.
 * @memberof Controllers.Stats
 */
function btnMonthlyGraph_click() {
	var monthData = Alloy.Globals.Steps.readByMonthForYear(new Date().getFullYear());
	var chartData = [];
	var monthIndex = 1;
	
	monthData.forEach(function(monthSteps) {
		var monthName = DateTimeHelper.getMonthNameFromIndex(monthIndex - 1);
		
		chartData.push({
			name: monthName,
			x: monthIndex,
			y: monthSteps
		});
		
		monthIndex++;
	});
	
	//TODO: Try creating a window the classic way here to create it with a landscape orientation, specifically
	var win = Alloy.createController("stats/monthlyGraph", {
		data: chartData
	}).getView();
	win.open();
}

/**
 * @description Event handler for 'Refresh'. Calls load().
 * @memberof Controllers.Stats
 */
function btnRefresh_click() {
	load();
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
						loadPage();
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
					loadPage();
				}, 1000);				
			}
		});
		
		confirmDialog.show();
	}
	else {
		setTimeout(function() {
			loadPage();
		}, 1000);	
	}
}

function setNavButtons() {
	if(Ti.Platform.osname === "android") {
		//On Android, call this to ensure the correct actionbar menu is displayed
		$.stats.activity.invalidateOptionsMenu();	
	}
	else {
		$.window.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click	
		});
		
		$.window.rightNavButton = NavBarButton.createRightNavButton({
			image: '/common/icons/refresh-button.png',
			onClick: btnRefresh_click
		});
	}
}

/**
 * @description Event handler for the Window's `open` event. Presets the row values and calls `load()`
 * @memberof Controllers.Stats
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Statistics"
	});
	
	setNavButtons();
	
	$.statsView.lblAvgSteps.text = 0;
	$.statsView.lblBusiestDay.text = 0;	
	$.statsView.lblBusiestMonth.text = 0;
	$.statsView.lblGoalSteps.text = 0;
	$.statsView.lblLifeTimeSteps.text = 0;
	$.statsView.lblYearlySteps.text = 0;
	$.statsView.lblSevenDayAverage.text = 0;
	$.statsView.lblYearlyStepsTitle.text = new Date().getFullYear() + " steps:";
	
	$.statsView.btnDailyGraph.addEventListener('click', btnDailyGraph_click);
	$.statsView.btnMonthlyGraph.addEventListener('click', btnMonthlyGraph_click);
	
	load();
}
