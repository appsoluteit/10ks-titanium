/**
 * @file Goal Steps Controller
 * @description The controller for the goal steps view.
 * @require widgets/com.mcongrove.toast
 * @namespace Controllers.Settings.GoalSteps
 */

var args = $.args;
var APIHelper = require('helpers/APIHelper');

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
}

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
	
	$.goalStepsView.txtGoalSteps.value = $.args.goalSteps;
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
	
	function onSuccess(response) {		
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
	}
	
	function onFail(response) {
		Ti.API.error(response);
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Unable save your goal setting",
			duration: 2000,
			view: $.goalSteps,
			theme: "error"
		});	
	}
	
	APIHelper.post({
		message: "Saving goal",
		url:		"goals/",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		data: {
			goal: goalSteps
		},
		success: 	onSuccess,
		fail: 		onFail		
	});
}
