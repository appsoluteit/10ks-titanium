/**
 * @file Tournaments Controller
 * @description The controller for the tournaments view, which simply allows the user to select between race timeouts or tournament timeouts.
 * @namespace Controllers.Tournaments
 */

var NavBarButton = require('classes/NavBarButton');

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
	// TODO
}