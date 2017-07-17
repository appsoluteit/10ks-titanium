/**
 * @file Goal Steps Controller
 * @description The controller for the goal steps view.
 * @require widgets/com.mcongrove.toast
 * @namespace Controllers.Settings.GoalSteps
 */

var args = $.args;
var AuthProvider = require('classes/AuthProvider');
var authProvider = new AuthProvider($.goalSteps, $.goalStepsView);
	
/**
 * @description Event handler for the Window's `open` event. Adds an event listener for `btnSave` and populates `txtGoalSteps` with the saved goal from app properties, if it 
 * exists.
 * @memberof Controllers.Settings.GoalSteps
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Goal Steps"
	});
	
	$.goalStepsView.btnSave.addEventListener('click', btnSave_click);
	
	loadGoalSteps();
}

function loadGoalSteps() {
	authProvider.getUser().then(function() {
		var goalSteps = Ti.App.Properties.getInt("goal_steps", -1);
		
		if(goalSteps > -1) {
			$.goalStepsView.txtGoalSteps.value = goalSteps;
		}	
	});
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Settings.GoalSteps
 */
function btnBack_click() {
	$.goalSteps.close();
}

/**
 * @description Event handler for `btnSave`. If no goal is entered, shows an alert and returns. Otherwise, saves it to app properties, shows a success toast, 
 * calls `args.callback()` with the newly saved value and then closes the window after 2000ms.
 * @memberof Controllers.Settings.GoalSteps
 */
function btnSave_click() {
	var goalSteps = $.goalStepsView.txtGoalSteps.value;
	
	if(!goalSteps) {
		var alertDialog = Ti.UI.createAlertDialog({
			buttonNames: ['OK'],
			message: 'Please enter goal steps and click save',
			title: 'Enter goal steps'
		});	
		
		alertDialog.show();
		return;
	}
	
	goalSteps = parseInt(goalSteps, 10);
	
	authProvider.setGoalSteps(goalSteps).then(function() {
		Ti.App.Properties.setInt('goal_steps', goalSteps);
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Goal steps saved",
			duration: 2000,
			view: $.goalSteps,
			theme: "success"
		});
		
		setTimeout(function() {
			args.callback(goalSteps);
			$.goalSteps.close();
		}, 2000);
	});
}
