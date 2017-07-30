/**
 * @file Challenges Controller
 * @description The controller for the challenges view. Note: only the first page of results is displayed.
 * @namespace Controllers.Challenges
 * @require helpers/APIHelper
 */

var ChallengesProvider = require('classes/ChallengesProvider');
var FormatHelper = require('helpers/FormatHelper');
var NavBarButton = require('classes/NavBarButton');

var challengesProvider = new ChallengesProvider();

/**
 * @description Event handler for `btnBack` which closes the window.
 * @memberOf Controllers.Challenges
 */
function btnBack_click() {
	$.challenges.close();
}

function fetchChallenges() {
	var spinner = Alloy.createWidget('nl.fokkezb.loading');
	spinner.show("Fetching challenges...");
	
	try {
		challengesProvider.fetch(function(response) {
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
		});	
	}
	catch(e) {
		if(e === "InvalidToken") {
			setTimeout(function() {
				var win = Alloy.createController("auth/login").getView();
				win.open();
				
				win.addEventListener("close", function() {
					sync();
				});
			}, 2000);
		}
	}
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
