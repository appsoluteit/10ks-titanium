/**
 * @file Steps Form Controller
 * @description The controller for the form to enter steps
 * @require helpers/FormatHelper
 * @require classes/StepsDataProvider
 * @namespace Controllers.Steps.Form
 */

var FormatHelper = require('helpers/FormatHelper');
var StepsDataProvider = require('classes/StepsDataProvider');
var stepsDataProvider;
var item = {};	//a model to contain the data on the form. This gets written to local storage by the data provider.

var args = $.args;

/**
 * @description Event handler for `btnDone`. Writes the entered data via the steps data provider, 
 * calls `args.callback(total)` and closes the window.
 * @memberof Controllers.Steps.Form
 */
function btnDone_click() {
	if(item.stepsTotal > 0) {			
		item.lastUpdatedOn = new Date();
		stepsDataProvider.writeSingle(item);
	}
	
	//Pass the formatted string back to the parent to display it in the table	
	args.callback(item.stepsTotal);
	$.logEntry.close();
}

/**
 * @description Event handler for the Window's `open` event. Sets the value of the title bar to reflect the date and adds event listeners to 
 * the text fields. Also pre-populates the text field values with those from local storage, if they exist.
 * @memberof Controllers.Steps.Form
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Steps Form"
	});
	
	stepsDataProvider = new StepsDataProvider();
	
	if(Ti.Platform.osname === "android") {
		$.logEntry.activity.actionBar.title = args.title;
	}
	else {
		$.window.title = args.title;
	}	
	
	item = stepsDataProvider.readSingle(args.date);
	
	Ti.API.info("Found match:", JSON.stringify(item));
	
	if(item) {
		$.logEntryView.txtStepsWalked.value = item.stepsWalked;
		$.logEntryView.txtModerateMins.value = item.moderateMins;
		$.logEntryView.txtVigorousMins.value = item.vigorousMins;
		
		calculateTotal();
	}
	else {
		item = {};
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
	var stepsWalked = $.logEntryView.txtStepsWalked.value;
	var moderateMins = $.logEntryView.txtModerateMins.value;
	var vigorousMins = $.logEntryView.txtVigorousMins.value;
	
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
	
	var activityPart = (moderateMins * 100) + (vigorousMins * 200);
	var total = stepsWalked + activityPart;
	
	$.logEntryView.lblDailyTotal.text = FormatHelper.formatNumber(total);
	
	item.stepsWalked = stepsWalked;
	item.moderateMins = moderateMins;
	item.vigorousMins = vigorousMins;
	item.stepsTotal = total;
	item.activityPart = activityPart;
}