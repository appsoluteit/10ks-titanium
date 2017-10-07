var DateTimeHelper = require('helpers/DateTimeHelper');
var MathHelper = require('helpers/MathHelper');
var NavBarButton = require('classes/NavBarButton');

var currentYear = -1; //keep track of the current year so that we can re-use it when the screen orientation changes.

function window_open() {	
	var years = Alloy.Globals.Steps.readYears();
	Ti.API.debug("Years", years);
	
	var mostRecentYear = MathHelper.highestOf(years);
	Ti.API.debug("Highest year", mostRecentYear);
	
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
	
	setiOSNavButtons(years, mostRecentYear);
	showChartForYear(mostRecentYear);
}

function showChartForYear(year) {
	Ti.API.debug("Getting months for ", year);
	
	currentYear = year;
	
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
	
	showChart(chartData, year);
}

function showChart(args, year) {
	Ti.API.debug("showChart called for " + year);
	
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
	
	var viewHeight = MathHelper.smallestOf(options);
	
	if(hasSteps(args)) {		
		var chartOptions = {
			type: "column",
			name: "Monthly Steps for " + year,
			data: args		
		};
		
		var customOptions = {
			showGoalSteps: false,
			chartHeight: viewHeight,
			useMonthFormatter: 1	
		};
		
		$.monthlyGraphView.monthlyGraphChart.loadChart(chartOptions, customOptions);	
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

function setAndroidMenuItems(years, currentYear) {
	if(!years) {
		years = Alloy.Globals.Steps.readYears();
	}

	if(!currentYear) {
		currentYear = MathHelper.highestOf(years);	
	}
	
	var activity = $.monthlyGraph.activity;
	
	activity.onCreateOptionsMenu = function(e) {
		Ti.API.debug("Creating options menu [Android]");
		var menu = e.menu;
		  
		var menuItem = menu.add({
		  title: currentYear,
		  showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
		});
		  
		menuItem.addEventListener("click", function() {
		  showYearPicker(years, currentYear);
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
			if(Ti.Platform.osname === "android") {
				setAndroidMenuItems(years, e.data[0].value);
				$.monthlyGraph.activity.invalidateOptionsMenu();
			}
			else {
				setiOSNavButtons(years, e.data[0].value);
			}
			
			showChartForYear(e.data[0].value);
		}
	  },
	});	
}

function btnBack_click() {
	$.monthlyGraph.close();
}