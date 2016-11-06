// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function calculateStatistics() {
	function onSuccess(response) {
		Ti.API.info("Get steps success", JSON.stringify(response));
		
		//TODO: Correct these
		$.statsView.lblAvgSteps.text = Alloy.Globals.FormatNumber(5558);
		$.statsView.lblBusiestMonth.text = "August";
		$.statsView.lblBusiestDay.text = "09/08/2016";
		$.statsView.lblAnnualSteps.text = Alloy.Globals.FormatNumber(27789);
	}
	
	function onFail(response) {
		if(response.detail) {
			//If the token expired, open the login window to login again
			if(response.detail == "Token has expired") {
				var win = Alloy.createController("auth/login").getView();
				win.open();
				
				win.addEventListener("close", function() {
					calculateStatistics();
				});
			}
		}
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Couldn't get statistics",
			duration: 2000,
			view: $.stats,
			theme: "error"
		});
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	Alloy.Globals.API.get({
		message:	"Calculating statistics...",
		url:		"http://steps10000.webfactional.com/api/steps/", //TODO: Change this
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
}

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
			name: Alloy.Globals.GetMonthNameFromIndex(i - 1),
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
	var currentYear = new Date().getFullYear();
	
	$.statsView.lblGoalSteps.text = Alloy.Globals.FormatNumber(goalSteps);
	$.statsView.lblAvgSteps.text = 0;
	$.statsView.lblBusiestMonthLabel.text = "Busiest Month (" + currentYear + "):";
	$.statsView.lblBusiestMonth.text = 0;
	$.statsView.lblBusiestDayLabel.text = "Busiest Day (" + currentYear + "):";
	$.statsView.lblBusiestDay.text = 0;
	$.statsView.lblAnnualSteps.text = 0;
	
	$.statsView.tblRowDailyGraph.addEventListener('click', tblRowDailyGraph_click);
	$.statsView.tblRowMonthlyGraph.addEventListener('click', tblRowMonthlyGraph_click);
	
	setTimeout(function() {
		calculateStatistics();
	}, 1000);
}
