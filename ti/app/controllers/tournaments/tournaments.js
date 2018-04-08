/**
 * @file Tournaments Controller
 * @description The controller for the tournaments view, which simply allows the user to select between race timeouts or tournament timeouts.
 * @namespace Controllers.Tournaments
 */

var TournamentsProvider = require('classes/TournamentsProvider');
var tournamentsProvider = new TournamentsProvider();

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments
 */
function btnBack_click() {
	$.tournaments.close();
}

function btnRefresh_click() {
	loadTournaments();
}

/**
 * @description Event handler for the Window's open event. Adds event handlers for the races and timeout rows.
 * @memberof Controllers.Tournaments
 */
function window_open() {
	Alloy.Globals.tracker.addScreenView('Tournaments');
	loadTournaments();
}

function loadTournaments() {
	tournamentsProvider.fetch().then(function(results) {
		Ti.API.info('Finished loading tournaments');
		Ti.API.info(results);

		results.forEach(function(element) {
			Ti.API.info(element);
		});
	});
}