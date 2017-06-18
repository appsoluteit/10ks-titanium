/**
 * @file About Controller
 * @description The controller for the about view.
 * @namespace Controllers.Settings.About
 */

var args = $.args;

/**
 * @description Event handler for the Window's `open` event. Sets `lblVersion` to `Ti.App.version` and adds event listeners to the two buttons.
 * @memberof Controllers.Settings.About
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "About"
	});
	
	$.aboutView.lblVersion.text = "Version " + Ti.App.version;
	
	$.aboutView.btnWebsite.addEventListener('click', btnWebsite_click);
	$.aboutView.btnSendFeedback.addEventListener('click', btnSendFeedback_click);
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Settings.About
 */
function btnBack_click() {
	$.about.close();
}

/**
 * @description Opens `Alloy.Globals.WebURL` in the device browser.
 * @memberof Controllers.Settings.About
 */
function btnWebsite_click() {
	Ti.Platform.openURL(Alloy.Globals.WebURL);
}

/**
 * @description Opens `Alloy.Globals.FeedbackURL` in the device browser.
 * @memberof Controllers.Settings.About
 */
function btnSendFeedback_click() {
	Ti.Platform.openURL(Alloy.Globals.FeedbackURL);
}
