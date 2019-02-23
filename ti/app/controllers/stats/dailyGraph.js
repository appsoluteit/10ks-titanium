var DateTimeHelper = require('helpers/DateTimeHelper');
var MathHelper = require('helpers/MathHelper');
var NavBarButton = require('classes/NavBarButton');

var currentYear = -1; //keep track of the current year so that we can re-use it when the screen orientation changes.
var currentMonth = -1;

var monthsAndYears = Alloy.Globals.Steps.readMonthsAndYears();
var years = Alloy.Globals.Steps.readYears();
var mostRecentYear = MathHelper.highestOf(years);
var months = Alloy.Globals.Steps.readMonthsForYear(mostRecentYear);	
var mostRecentMonth = MathHelper.highestOf(months);
	
function window_open() {	
	//Redraw the chart after an orientation change to use the right dimensions
	Ti.Gesture.addEventListener('orientationchange',function(e) {		
		Ti.API.info("Orientation change detected.");

		if(currentYear > 0 && currentMonth > 0) {
			showChartForMonthAndYear(currentYear, currentMonth);
		}
	});
	
	Alloy.Globals.tracker.addScreenView('Daily Graph');
	
	setiOSNavButtons(monthsAndYears, mostRecentYear, mostRecentMonth);
}

function window_postlayout() {
	showChartForMonthAndYear(mostRecentYear, mostRecentMonth);	
}

function showChartForMonthAndYear(year, month) {	
	currentYear = year;
	currentMonth = month;
	
	var dailyData = Alloy.Globals.Steps.readByDayForMonth(month + 1, year);

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
	
	showChart(chartData, year, month);
}

function showChart(args, year, month) {	
	Ti.API.info('Showing daily chart for year ' + year + ', month ' + month);

	var options = [
		Ti.Platform.displayCaps.platformHeight,
		Ti.Platform.displayCaps.platformWidth,
		$.dailyGraph.rect.height,
		$.dailyGraph.rect.width	
	];
	
	if(Ti.Platform.osname !== "android") {
		options.push($.dailyGraphWindow.rect.height);
		options.push($.dailyGraphWindow.rect.width);
	}
	
	var viewHeight = MathHelper.smallestOf(options);
	var goalSteps = Ti.App.Properties.getInt("goalSteps", 0);	
	var currentMonthLabel = DateTimeHelper.getMonthNameFromIndex(month);
		
	Ti.API.info('Current month label ' + currentMonthLabel);

	if(hasSteps(args)) {	
		var chartOptions = {
			type: "column",
			name: "Daily Steps for " + currentMonthLabel + ", " + year,
			data: args		
		};
		
		var customOptions = {
			goalSteps: goalSteps,
			showGoalSteps: 1,
			chartHeight: viewHeight			
		};
		
		Ti.API.info('before loading chart. Custom options = ', JSON.stringify(customOptions));
		$.dailyGraphView.dailyGraphChart.loadChart(chartOptions, customOptions);	
	}
	else {		
		$.dailyGraphView.dailyGraphChart.showMessage("No steps logged for " + currentMonthLabel + ", " + year);	
	}
}

function hasSteps(args) {
	return args.filter(function(item) {
		return item.y > 0;
	}).length > 0;
}

function setiOSNavButtons(monthYears, mostRecentYear, mostRecentMonth) {
	if(Ti.Platform.osname !== "android") {
		/*
		$.dailyGraphWindow.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click	
		});
		*/
		
		$.dailyGraphWindow.rightNavButton = NavBarButton.createRightNavButton({
			text: DateTimeHelper.getMonthNameFromIndex(mostRecentMonth) + ", " + mostRecentYear,
			onClick: function() {
				showMonthYearPicker(monthYears, mostRecentYear, mostRecentMonth);
			}
		});
	}	
}

function setAndroidMenuItems(monthYears, mostRecentYear, mostRecentMonth) {
	Ti.API.info('Changing android menu items');

	if(!monthYears) {
		monthYears = Alloy.Globals.Steps.readMonthsAndYears();
	}
	
	if(!mostRecentYear) {
		var years = Alloy.Globals.Steps.readYears();
		mostRecentYear = MathHelper.highestOf(years);
	}
	
	// This may be 0 - January
	if(mostRecentMonth === undefined) {
		var months = Alloy.Globals.Steps.readMonthsForYear(mostRecentYear);	
		mostRecentMonth = MathHelper.highestOf(months);			
	}
	
	var activity = $.dailyGraph.activity;
	
	activity.onCreateOptionsMenu = function(e) {
		var menu = e.menu;
		  
		var menuItem = menu.add({
		  title: DateTimeHelper.getMonthNameFromIndex(mostRecentMonth) + ", " + mostRecentYear,
		  showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
		});
		  
		menuItem.addEventListener("click", function() {
		  showMonthYearPicker(monthYears, mostRecentYear, mostRecentMonth);
		});
	};	
}
$.dailyGraph.setAndroidMenuItems = setAndroidMenuItems;

function showMonthYearPicker(monthYears, currentYear, currentMonth) {	
	var selectedValue = DateTimeHelper.getMonthNameFromIndex(currentMonth) + ", " + currentYear;
	
	Ti.API.info(JSON.stringify(monthYears));

	var values = {};
	monthYears.forEach(function(item) {
		var tmp = DateTimeHelper.getMonthNameFromIndex(item.month) + ", " + item.year;
		values[tmp] = tmp;	
	});
	
	Alloy.createWidget('danielhanold.pickerWidget', {
	  id: 'mySingleColumn',
	  outerView: $.dailyGraph,
	  hideNavBar: false,
	  type: 'single-column',
	  selectedValues: [selectedValue],
	  pickerValues: [values],
	  onDone: function(e) {
	  	Ti.API.info(e);
	  	
		if(e.cancel == 0) {		
			var selectedMonthText = e.data[0].value.split(', ')[0];
			var selectedYear = e.data[0].value.split(', ')[1] * 1;  //Convert to number
			var selectedMonth = DateTimeHelper.getIndexFromMonthName(selectedMonthText);
			
			Ti.API.info("Selected month text: " + selectedMonthText);
			Ti.API.info("Selected month index: " + selectedMonth);
			Ti.API.info("Selected year: " + selectedYear);
			
			if(Ti.Platform.osname === "android") {
				setAndroidMenuItems(monthYears, selectedYear, selectedMonth);
				$.dailyGraph.activity.invalidateOptionsMenu();
			}
			else {
				setiOSNavButtons(monthYears, selectedYear, selectedMonth);
			}
			
			showChartForMonthAndYear(selectedYear, selectedMonth);
		}
	  },
	});	
}

function btnBack_click() {
	$.dailyGraph.close();
}