/**
 * @file Race tournaments Controller
 * @description The controller for the race tournaments.
 * @namespace Controllers.Tournaments.Races.
 */

var args = $.args;
var APIHelper = require('helpers/APIHelper');
var FormatHelper = require('helpers/FormatHelper');

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments.Races
 */
function btnBack_click() {
	$.races.close();
}

function fetchRaces() {
	function onSuccess(response) {
		Ti.API.info("Races success handler. Response: ", response);
		
		response.results.forEach(function(result) {
			Ti.API.info(JSON.stringify(result));
			
			var row = Ti.UI.createTableViewRow({ });
			
			Alloy.createWidget("com.10000steps.challengerow", null, {
				taskName: '',
				taskDescription: result.team.tournament.tournament.description,
				goalSteps: FormatHelper.formatNumber(result.team.tournament.tournament.total_steps) + ' steps',
				percentComplete: FormatHelper.formatNumber(result.team.tournament.tournament.distance_metres) + 'm',
				image:  "/common/race_badge_small.png",
				view: row
			});
			
			row.addEventListener('click', function() {
				var detailWindow = Alloy.createController('tournaments/races/racesDetail', result).getView();
				detailWindow.open();
			});
			
			$.racesView.tblRaces.appendRow(row);				
		});
		
		var webLink = Ti.UI.createLabel({
			text: "To view a list of all available tournaments or to join a tournament, please visit the 10,000 steps website",
			color: "#0645AD",
			font: {
				fontSize: 9
			},
			textAlign: "center"
		});
		webLink.addEventListener('click', function() {
			Ti.Platform.openURL('https://www.10000steps.org.au/dashboard/tournaments/tournament-races/');
		});
		var linkRow = Ti.UI.createTableViewRow();
		linkRow.add(webLink);
		
		$.racesView.tblRaces.appendRow(linkRow);
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
						fetchRaces();
					});
				}, 2000);
			}
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't get races",
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
		message:	"Fetching Races...",
		url:		"tournament_races/", 
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});	
}

/**
 * @description Event handler for the Window's open event.
 * @memberof Controllers.Tournaments.Races
 */
function window_open() {
	fetchRaces();
}