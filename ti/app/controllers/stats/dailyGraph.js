var DateTimeHelper = require('helpers/DateTimeHelper');
var MathHelper = require('helpers/MathHelper');
var NavBarButton = require('classes/NavBarButton');

var currentYear = -1; //keep track of the current year so that we can re-use it when the screen orientation changes.
var currentMonth = -1;

function window_open() {	
	var monthsAndYears = Alloy.Globals.Steps.readMonthsAndYears();
	var years = Alloy.Globals.Steps.readYears();
	var mostRecentYear = MathHelper.highestOf(years);
	var months = Alloy.Globals.Steps.readMonthsForYear(mostRecentYear);	
	var mostRecentMonth = MathHelper.highestOf(months);
	
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
	
	var values = {};
	monthYears.forEach(function(item) {
		var tmp = (item.month + 1) + "/" + item.year;
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
			var selectedMonth = e.data[0].value.split('/')[0] - 1; //Convert to number (JSDate style month, 0 indexed)
			var selectedYear = e.data[0].value.split('/')[1] * 1;  //Convert to number
			
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