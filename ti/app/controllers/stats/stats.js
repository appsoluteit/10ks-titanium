var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');
var APIHelper = require('helpers/APIHelper');

var args = $.args;

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

//Note: graphs are temporarily disabled
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

function btnBack_click() {
	$.stats.close();
}

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
