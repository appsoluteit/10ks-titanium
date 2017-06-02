/**
 * @file Challenges Controller
 * @description The controller for the challenges view.
 * @namespace Controllers.Challenges
 * @require helpers/APIHelper
 * @todo This controller is a stub
 */

var args = $.args;
var APIHelper = require('helpers/APIHelper');

/**
 * @description Event handler for `btnBack` which closes the window.
 * @memberOf Controllers.Challenges
 */
function btnBack_click() {
	$.challenges.close();
}

function fetchChallenges() {
	function onSuccess(response) {
		response.results.forEach(function(result) {
			Ti.API.info(JSON.stringify(result));
			
			var row = Ti.UI.createTableViewRow({ });
			
			Alloy.createWidget("com.10000steps.challengerow", null, {
				taskName: result.task.name,
				taskDescription: result.task.description,
				stepsWalked: result.steps_goal,
				percentComplete: result.percentage_complete,
				view: row
			});
			
			$.challengesView.tblChallenges.appendRow(row);				
		});
	}
	
	function onFail(reason) {
		if(response.detail) {
			//If the token expired, open the login window to login again
			if(response.detail === "Invalid token.") {
				Alloy.createWidget("com.mcongrove.toast", null, {
					text: "Session expired. Please log in again.",
					duration: 2000,
					view: $.challenges,
					theme: "error"
				});
				
				setTimeout(function() {
					var win = Alloy.createController("auth/login").getView();
					win.open();
					
					win.addEventListener("close", function() {
						fetchChallenges();
					});
				}, 2000);
			}
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't get challenges",
				duration: 2000,
				view: $.challenges,
				theme: "error"
			});	
		}
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	APIHelper.get({
		message:	"Fetching Challenges...",
		url:		"challenges/", 
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});	
}

/**
 * @description Event handler for the Window's `open` event. Calls `fetchChallenges()`.
 * @memberOf Controllers.Challenges
 */
function window_open() {
	fetchChallenges();
}
