/**
 * @file Timeout tournaments Controller
 * @description The controller for the timeout tournaments.
 * @namespace Controllers.Tournaments.Timeouts
 */

var args = $.args;

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments.Timeouts
 */
function btnBack_click() {
	$.timeouts.close();
}

/**
 * @description Event handler for the Window's open event.
 * @memberof Controllers.Tournaments.Timeouts
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Timeout Tournaments"
	});
}