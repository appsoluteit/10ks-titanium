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
	
	var years = Alloy.Globals.Steps.readYears();
	Ti.API.debug("Years", years);
	
	var mostRecentYear = highestOf(years);
	Ti.API.debug("Highest year", mostRecentYear);
	
	Alloy.Globals.tracker.trackScreen({
		screenName: "Monthly Graph"
	});
	
	setiOSNavButtons(years, mostRecentYear);
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
		$.monthlyGraphView.monthlyGraphChart.showMessage("No steps logged for " + year);
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

function setiOSNavButtons(years, mostRecentYear) {
	if(Ti.Platform.osname !== "android") {
		$.monthlyGraphWindow.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click	
		});
		
		$.monthlyGraphWindow.rightNavButton = NavBarButton.createRightNavButton({
			text: mostRecentYear,
			onClick: function() {
				showYearPicker(years, mostRecentYear);
			}
		});
	}	
}

function setAndroidMenuItems() {
	var years = Alloy.Globals.Steps.readYears();	
	var mostRecentYear = highestOf(years);
	
	var activity = $.monthlyGraph.activity;
	
	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  
	  var menuItem = menu.add({
	    title: mostRecentYear,
	    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
	  });
	  
	  menuItem.addEventListener("click", function() {
		showYearPicker(years, mostRecentYear);
	  });
	};	
}
$.monthlyGraph.setAndroidMenuItems = setAndroidMenuItems;

function showYearPicker(years, currentYear) {
	Ti.API.debug("Showing picker. Current year ", currentYear, " Years: ", years);
	
	var values = {};
	years.forEach(function(year) {
		values[year] = year;	
	});
	
	Alloy.createWidget('danielhanold.pickerWidget', {
	  id: 'mySingleColumn',
	  outerView: $.monthlyGraph,
	  hideNavBar: false,
	  type: 'single-column',
	  selectedValues: [currentYear],
	  pickerValues: [values],
	  onDone: function(e) {
	  	Ti.API.info(e);
	  	
		if(e.cancel == 0) {
			//Note: this won't update the NavBar / Action Bar item
			//Need to review
			showChartForYear(e.data[0].value);
		}
	  },
	});	
}

function btnBack_click() {
	$.monthlyGraph.close();
}

