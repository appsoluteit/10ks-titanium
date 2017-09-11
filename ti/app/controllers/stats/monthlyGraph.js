var DateTimeHelper = require('helpers/DateTimeHelper');
var NavBarButton = require('classes/NavBarButton');

var currentYear = -1;

function window_open() {
	//Redraw the chart after an orientation change to use the right dimensions
	Ti.Gesture.addEventListener('orientationchange',function(e) {		
		Ti.API.info("Orientation change detected.");
		
		if(currentYear > 0) {
			showChartForYear(currentYear);	
		}
	});
	
	Alloy.Globals.tracker.trackScreen({
		screenName: "Monthly Graph"
	});
	
	setiOSNavButtons();
	
	var years = Alloy.Globals.Steps.readYears();
	Ti.API.debug("Years", years);
	
	var mostRecentYear = highestOf(years);
	Ti.API.debug("Highest year", mostRecentYear);
	
	showChartForYear(mostRecentYear);
}

function showChartForYear(year) {
	Ti.API.debug("Getting months for ", year);
	
	var monthData = Alloy.Globals.Steps.readByMonthForYear(year);
	var chartData = [];
	var monthIndex = 1;
	
	Ti.API.debug("Months", monthData);
	
	monthData.forEach(function(monthSteps) {
		var monthName = DateTimeHelper.getMonthNameFromIndex(monthIndex - 1);
		
		chartData.push({
			name: monthName,
			x: monthIndex,
			y: monthSteps
		});
		
		monthIndex++;
	});
	
	currentYear = year;
	showChart(chartData, year);
}

function showChart(args, year) {
	var options = [
		Ti.Platform.displayCaps.platformHeight,
		Ti.Platform.displayCaps.platformWidth,
		$.monthlyGraph.rect.height,
		$.monthlyGraph.rect.width	
	];
	
	if(Ti.Platform.osname !== "android") {
		options.push($.monthlyGraphWindow.rect.height);
		options.push($.monthlyGraphWindow.rect.width);
	}
	
	var viewHeight = smallestOf(options);
	
	if(hasSteps(args)) {
		$.monthlyGraphView.monthlyGraphChart.loadChart({
			type: "column",
			name: "Monthly Steps for " + year,
			data: args,
			showGoalSteps: false,
			chartHeight: viewHeight
		});	
	}
	else {
		$.monthlyGraphView.monthlyGraphChart.showMessage("No steps logged for this year");
	}
}

function hasSteps(args) {
	return args.filter(function(item) {
		return item.y > 0;
	}).length > 0;
}

function smallestOf(options) {
	var smallest = undefined;
	
	for(var i = 0; i < options.length; i++) {
		if(options[i] < smallest || smallest === undefined) {
			smallest = options[i];
		}
	}
	
	return smallest;
}

function highestOf(options) {
	var highest = undefined;
	
	for(var i = 0; i < options.length; i++) {
		if(options[i] > highest || highest === undefined) {
			highest = options[i];
		}
	}
	
	return highest;
}

function setiOSNavButtons() {
	if(Ti.Platform.osname !== "android") {
		$.monthlyGraphWindow.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click	
		});
		
		$.monthlyGraphWindow.rightNavButton = NavBarButton.createRightNavButton({
			text: "Coming soon",
			onClick: function() {
				console.log("todo");
			}
		});
	}	
}

function setAndroidMenuItems() {
	var years = Alloy.Globals.Steps.readYears();
	Ti.API.debug("Years with steps", years);
	
	var mostRecentYear = highestOf(years);
	
	var activity = $.monthlyGraph.activity;
	
	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  
	  var menuItem = menu.add({
	    title: mostRecentYear,
	    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
	  });
	  
	  menuItem.addEventListener("click", function() {
	  	console.log("todo");
	  	//TODO: Show a popup for a selection of each year
	  });
	};	
}
$.monthlyGraph.setAndroidMenuItems = setAndroidMenuItems;

function btnBack_click() {
	$.monthlyGraph.close();
}

