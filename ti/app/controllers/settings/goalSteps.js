/**
 * @file Goal Steps Controller
 * @description The controller for the goal steps view.
 * @require widgets/com.mcongrove.toast
 * @namespace Controllers.Settings.GoalSteps
 */

var args = $.args;
var APIHelper = require('helpers/APIHelper');
var SessionHelper = require('helpers/SessionHelper');

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
	
	win.addEventListener("close", function() {
		loadGoalSteps();
	});
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
	
	loadGoalSteps();
}

function loadGoalSteps() {
	function onSuccess(response) {
		if(response.results && response.results.length) {
			//There may be multiple goals in the response. Just take the first (most recent)
			var goalSteps = response.results[0].goal * 1;
			Ti.API.info("Saving goal steps:", goalSteps);
			
			if(goalSteps) {
				$.goalStepsView.txtGoalSteps.value = goalSteps;
				Ti.App.Properties.setInt("goalSteps", goalSteps);
			}
		}
	}
	
	function onFail(reason) {
		Ti.API.error(reason);
		
		if(SessionHelper.isTokenInvalid(reason)) {
			SessionHelper.showInvalidTokenToast($.goalSteps);
			
			setTimeout(showLogin, 2000);
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't fetch your goal setting",
				duration: 2000,
				view: $.goalSteps,
				theme: "error"
			});	
		}
	}
	
	APIHelper.get({
		message: "Fetching your goal setting",
		url:		"goals/",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
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
	
	function onSuccess(response) {
		Ti.App.Properties.setInt('goalSteps', goalSteps);
		
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
