/**
 * @file Tournaments Controller
 * @description The controller for the tournaments view, which simply allows the user to select between race timeouts or tournament timeouts.
 * @namespace Controllers.Tournaments
 */

var args = $.args;

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments
 */
function btnBack_click() {
	$.tournaments.close();
}

/**
 * @description Event handler for the Window's open event. Adds event handlers for the races and timeout rows.
 * @memberof Controllers.Tournaments
 */
function window_open() {
	$.tournamentsView.vwRaceTournaments.addEventListener('click', raceTournaments_click);
	$.tournamentsView.vwTimeoutTournaments.addEventListener('click', timeoutTournaments_click);
}

/**
 * @descrption Event handler for the race tournaments row.
 * @memberof Controllers.Tournaments
 */
function raceTournaments_click() {
	var win = Alloy.createController('tournaments/races/races').getView();
	win.open();
}

/**
 * @description Event handler for the timeout tournaments row.
 * @memberof Controllers.Tournaments
 */
function timeoutTournaments_click() {
	var win = Alloy.createController('tournaments/timeouts/timeouts').getView();
	win.open();
}