/**
 * @file Race tournaments Controller
 * @description The controller for the race tournaments.
 * @namespace Controllers.Tournaments.Races.
 */

var args = $.args;
var RaceTournamentsProvider = require('classes/RaceTournamentsProvider');
var FormatHelper = require('helpers/FormatHelper');
var SessionHelper = require('helpers/SessionHelper');

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
	
	win.addEventListener("close", function() {
		fetchRaces();
	});
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments.Races
 */
function btnBack_click() {
	$.races.close();
}

function fetchRaces() {
	Ti.API.info("Fetching races");
	
	var spinner = Alloy.createWidget('nl.fokkezb.loading');
	spinner.show("Fetching races...");
	
	var racesProvider = new RaceTournamentsProvider();
	
	function onSuccess(response) {
		Ti.API.info("Races response: ", response);
		
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
			text: "To join, create or view past Tournaments, go to your Dashboard on the 10,000 Steps website",
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
		
		spinner.hide();	
	}
	
	function onFail(reason) {
		Ti.API.error(reason);
		
		if(SessionHelper.isTokenInvalid(reason)) {
			SessionHelper.showInvalidTokenToast($.races);
			showLogin();
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't get races",
				duration: 2000,
				view: $.races,
				theme: "error"
			});	
		}		
	}
	
	racesProvider.fetch().then(onSuccess, onFail);
}

/**
 * @description Event handler for the Window's open event.
 * @memberof Controllers.Tournaments.Races
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Race Tournaments"
	});
	
	fetchRaces();
}