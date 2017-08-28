/**
 * @file Timeout tournaments Controller
 * @description The controller for the timeout tournaments.
 * @namespace Controllers.Tournaments.Timeouts
 */

var args = $.args;
var TimeoutTournamentsProvider = require('classes/TimeoutTournamentsProvider');
var DateTimeHelper = require('helpers/DateTimeHelper');

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
	
	win.addEventListener("close", function() {
		fetchTimeouts();
	});
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments.Timeouts
 */
function btnBack_click() {
	$.timeouts.close();
}

function fetchTimeouts() {
	var spinner = Alloy.createWidget('nl.fokkezb.loading');
	spinner.show("Fetching timeouts...");
	
	var timeoutsProvider = new TimeoutTournamentsProvider();
	
	function onSuccess(response) {
		Ti.API.info("Timeouts: ", response);
		
		var count = 0;
		response.results.forEach(function(result) {
			Ti.API.info("Result:", result);
			
			var row = Ti.UI.createTableViewRow({ });
			
			Alloy.createWidget("com.10000steps.challengerow", null, {
				taskName: result.team.tournament.weeks + ' weeks',
				taskDescription: '',
				goalSteps: '',
				percentComplete: DateTimeHelper.getShortDateLabel(new Date(result.team.tournament.date_started)),
				image:  "/common/timeout_badge_small.png",
				view: row
			});
			
			$.timeoutsView.tblTimeouts.appendRow(row);	
			count++;			
		});
		
		if(count === 0) {
			var row = Ti.UI.createTableViewRow({ title: 'There are no joined timeout tournaments.' });
			$.timeoutsView.tblTimeouts.appendRow(row);		
		}
		
		var webLink = Ti.UI.createLabel({
			text: "To join, create or view past Tournaments, go to your Dashboard on the 10,000 Steps website",
			color: "#0645AD",
			font: {
				fontSize: 9
			},
			textAlign: "center"
		});
		webLink.addEventListener('click', function() {
			Ti.Platform.openURL('https://www.10000steps.org.au/dashboard/tournaments/');
		});
		var linkRow = Ti.UI.createTableViewRow();
		linkRow.add(webLink);
		
		$.timeoutsView.tblTimeouts.appendRow(linkRow);
		
		spinner.hide();
	}
	
	function onFail(reason) {
		Ti.API.error(reason);
		
		if(SessionHelper.isTokenInvalid(reason)) {
			SessionHelper.showInvalidTokenToast($.timeouts);
			showLogin();
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't get races",
				duration: 2000,
				view: $.timeouts,
				theme: "error"
			});	
		}
	}
	
	timeoutsProvider.fetch().then(onSuccess, onFail);
}

/**
 * @description Event handler for the Window's open event.
 * @memberof Controllers.Tournaments.Timeouts
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Timeout Tournaments"
	});
	
	fetchTimeouts();
}