/**
 * @file Challenges Controller
 * @description The controller for the challenges view. Note: only the first page of results is displayed.
 * @namespace Controllers.Challenges
 * @require helpers/APIHelper
 */

var ChallengesProvider = require('classes/ChallengesProvider');
var FormatHelper = require('helpers/FormatHelper');
var SessionHelper = require('helpers/SessionHelper');
var NavBarButton = require('classes/NavBarButton');

/**
 * @description Event handler for `btnBack` which closes the window.
 * @memberOf Controllers.Challenges
 */
function btnBack_click() {
	$.challenges.close();
}

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
	
	win.addEventListener("close", function() {
		fetchChallenges();
	});
}

function fetchChallenges() {
	var spinner = Alloy.createWidget('nl.fokkezb.loading');
	spinner.show("Fetching challenges...");
	
	var challengesProvider = new ChallengesProvider();
	
	function onSuccess(response) {
		response.results.forEach(function(result) {
			Ti.API.info(JSON.stringify(result));
			
			var row = Ti.UI.createTableViewRow({ });
			
			Alloy.createWidget("com.10000steps.challengerow", null, {
				taskName: result.task.name,
				taskDescription: result.task.description,
				goalSteps: FormatHelper.formatNumber(result.steps_goal) + ' steps',
				percentComplete: result.percentage_complete + '%',
				image:  "/common/challenge_badge_small.png",
				view: row
			});
			
			row.addEventListener('click', function() {
				var detailWindow = Alloy.createController('challenges/challengesDetail', result).getView();
				detailWindow.open();
			});
			
			$.challengesView.tblChallenges.appendRow(row);				
		});
		
		var webLink = Ti.UI.createLabel({
			text: "To view a list of all available challenges or to join a challenge, please visit the 10,000 steps website",
			color: "#0645AD",
			font: {
				fontSize: 9
			},
			textAlign: "center"
		});
		webLink.addEventListener('click', function() {
			Ti.Platform.openURL('https://www.10000steps.org.au/dashboard/challenges/');
		});
		var linkRow = Ti.UI.createTableViewRow();
		linkRow.add(webLink);
		
		$.challengesView.tblChallenges.appendRow(linkRow);
		
		spinner.hide();	
	}
	
	function onFail(reason) {
		Ti.API.error(reason);
			
		spinner.hide();
		if(SessionHelper.isTokenInvalid(reason)) {
			SessionHelper.showInvalidTokenToast($.challenges);
			
			setTimeout(function() {
				showLogin();
			}, 2000);
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't get challenges",
				duration: 2000,
				view: $.stats,
				theme: "error"
			});	
		}		
	}
	
	challengesProvider.fetch().then(onSuccess, onFail);
}

/**
 * @description Event handler for the Window's `open` event. Calls `fetchChallenges()`.
 * @memberOf Controllers.Challenges
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Challenges"
	});
	
	if(Ti.Platform.osname !== "android") {
		$.window.leftNavButton = NavBarButton.createLeftNavButton({
			text: "Home",
			onClick: btnBack_click
		});
	}
	
	fetchChallenges();
}
