var DateTimeHelper = require('helpers/DateTimeHelper');
var MathHelper = require('helpers/MathHelper');
var NavBarButton = require('classes/NavBarButton');

var currentYear = -1; //keep track of the current year so that we can re-use it when the screen orientation changes.
var currentMonth = -1;

function window_open() {	
	var monthsAndYears = Alloy.Globals.Steps.readMonthsAndYears();
	var years = Alloy.Globals.Steps.readYears();
	
	Ti.API.info("Years logged", years);
	
	var mostRecentYear = MathHelper.highestOf(years);
	
	Ti.API.info("Highest year", mostRecentYear);
	
	var months = Alloy.Globals.Steps.readMonthsForYear(mostRecentYear);
	
	Ti.API.info("Months logged", months);
	
	var mostRecentMonth = MathHelper.highestOf(months);
	
	Ti.API.info("Highest month", mostRecentMonth);
	
	//Redraw the chart after an orientation change to use the right dimensions
	Ti.Gesture.addEventListener('orientationchange',function(e) {		
		Ti.API.info("Orientation change detected.");

		if(currentYear > 0 && currentMonth > 0) {
			showChartForMonthAndYear(currentYear, currentMonth);
		}
	});
	
	Alloy.Globals.tracker.trackScreen({
		screenName: "Daily Graph"
	});
	
	setiOSNavButtons(monthsAndYears, mostRecentYear, mostRecentMonth);
	showChartForMonthAndYear(mostRecentYear, mostRecentMonth);
}

function showChartForMonthAndYear(year, month) {
	Ti.API.info("Showing chart for month and year: " + month + ", " + year);
	
	currentYear = year;
	currentMonth = month;
	
	var dailyData = Alloy.Globals.Steps.readByDayForMonth(month + 1, year);

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
	
	showChart(chartData, year, month);
}

function showChart(args, year, month) {
	Ti.API.info("Showing chart for month " + month + ", year " + year);
	
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
	Ti.API.info("Goal steps", goalSteps);
	
	var currentMonthLabel = DateTimeHelper.getMonthNameFromIndex(month);
		
	if(hasSteps(args)) {		
		$.dailyGraphView.dailyGraphChart.loadChart({
			type: "column",
			name: "Daily Steps for " + currentMonthLabel + ", " + year,
			data: args,
			goalSteps: goalSteps,
			showGoalSteps: true,
			chartHeight: viewHeight
		});	
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
		$.dailyGraphWindow.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click	
		});
		
		$.dailyGraphWindow.rightNavButton = NavBarButton.createRightNavButton({
			text: DateTimeHelper.getMonthNameFromIndex(mostRecentMonth) + ", " + mostRecentYear,
			onClick: function() {
				showMonthYearPicker(monthYears, mostRecentYear, mostRecentMonth);
			}
		});
	}	
}

function setAndroidMenuItems(monthYears, mostRecentYear, mostRecentMonth) {
	if(!monthYears) {
		monthYears = Alloy.Globals.Steps.readMonthsAndYears();
	}
	
	if(!mostRecentYear) {
		var years = Alloy.Globals.Steps.readYears();
		mostRecentYear = MathHelper.highestOf(years);
	}
	
	var activity = $.dailyGraph.activity;
	
	activity.onCreateOptionsMenu = function(e) {
		Ti.API.debug("Creating options menu [Android]");
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
	var selectedValue = currentMonth + "/" + currentYear;
	Ti.API.info("Selected value:", selectedValue);
	
	var values = {};
	monthYears.forEach(function(item) {
		var tmp = (item.month + 1) + "/" + item.year;
		values[tmp] = tmp;	
	});
	
	Ti.API.info("Picker values", values);
	
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
			var selectedMonth = e.data[0].value.split('/')[0] - 1;
			var selectedYear = e.data[0].value.split('/')[1];
			
			if(Ti.Platform.osname === "android") {
				setAndroidMenuItems(monthYears, selectedMonth, selectedYear);
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