/**
 * @file Steps Form Controller
 * @description The controller for the form to enter steps
 * @require helpers/FormatHelper
 * @require classes/StepsDataProvider
 * @namespace Controllers.Steps.Form
 */

var FormatHelper = require('helpers/FormatHelper');
var StepsDataProvider = require('classes/StepsDataProvider');
var args = $.args;

var stepsWalked = 0;
var moderateMins = 0;
var vigorousMins = 0;
var total = 0;

/**
 * @description Event handler for `btnDone`. Adds the entered data to the Alloy `log` models, calls `args.callback(total)` and closes the window.
 * @memberof Controllers.Steps.Form
 */
function btnDone_click() {
	var dataProvider = new StepsDataProvider();
	
	if(total > 0) {	
		var stepsStr = FormatHelper.formatDate(args.date);
		
		var logInstance = Alloy.createModel('log', {
			steps_date: 	 stepsStr, 
		    steps_total: 	 total,
		    steps_walked:  	 stepsWalked,
		    activity_part: 	 total - stepsWalked,
		    moderate:      	 moderateMins,
		    vigorous:     	 vigorousMins,
		    last_synced_on: '',
		    last_updated_on: ''
		});
		
		if(logInstance.isValid()) {
			Ti.API.info("Model valid. Saving");
			logInstance.save();
		}
		else {
			Ti.API.error("Model not valid. Destroying");
			logInstance.destroy();
		}
		
		/*
		dataProvider.writeSingle({
		    steps_date: 	 args.date, 
		    steps_total: 	 total,
		    steps_walked:  	 stepsWalked,
		    activity_part: 	 total - stepsWalked,
		    moderate:      	 moderateMins,
		    vigorous:     	 vigorousMins,
		    last_synced_on: '',
		    last_updated_on: ''
		});
		*/
	}
	
	//Pass the formatted string back to the parent to display it in the table	
	args.callback(total);
	
	$.logEntry.close();
}

/**
 * @description Event handler for the Window's `open` event. Sets the value of the title bar to reflect the date and adds event listeners to the text fields.
 * @memberof Controllers.Steps.Form
 */
function window_open() {
	if(Ti.Platform.osname === "android") {
		$.logEntry.activity.actionBar.title = args.title;
		
		Ti.API.info("Setting action bar title: " + args.title);
	}
	else {
		$.window.title = args.title;
	}	
	
	//Custom event listeners for nested view elements
	$.logEntryView.txtStepsWalked.addEventListener('change', txtStepsWalked_change);
	$.logEntryView.txtModerateMins.addEventListener('change', txtModerateMins_change);
	$.logEntryView.txtVigorousMins.addEventListener('change', txtVigorousMins_change);
}

/**
 * @description Event handler for `txtStepsWalked`. Calls `calculateTotal()`.
 * @listens change
 * @memberof Controllers.Steps.Form
 */
function txtStepsWalked_change() {
	calculateTotal();
}

/**
 * @description Event handler for `txtModerateMins`. Calls `calculateTotal()`.
 * @listens change
 * @memberof Controllers.Steps.Form
 */
function txtModerateMins_change() {
	calculateTotal();
}

/**
 * @description Event handler for `txtVigorousMins`. Calls `calculateTotal()`.
 * @listens change
 * @memberof Controllers.Steps.Form
 */
function txtVigorousMins_change() {
	calculateTotal();
}

/**
 * @description Calculates the total steps value and inserts it into `lblDailyTotal`. 
 * @memberof Controllers.Steps.Form
 */
function calculateTotal() {
	//total = steps walked + (moderate x 100) + (vigorous x 200)
	stepsWalked = $.logEntryView.txtStepsWalked.value;
	moderateMins = $.logEntryView.txtModerateMins.value;
	vigorousMins = $.logEntryView.txtVigorousMins.value;
	
	if(stepsWalked == '') {
		stepsWalked = 0;
	}
	else {
		stepsWalked = parseInt(stepsWalked, 10);
	}
	
	if(moderateMins == '') {
		moderateMins = 0;
	}
	else {
		moderateMins = parseInt(moderateMins, 10);
	}
		
	if(vigorousMins == '') {
		vigorousMins = 0;
	}
	else {
		vigorousMins = parseInt(vigorousMins, 10);
	}
	
	total = stepsWalked + (moderateMins * 100) + (vigorousMins * 200);
	
	$.logEntryView.lblDailyTotal.text = FormatHelper.formatNumber(total);
}