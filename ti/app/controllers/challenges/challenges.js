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

function btnRefresh_click() {
	fetchCurrentChallenge();	
}

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
	
	win.addEventListener("close", function() {
		fetchCurrentChallenge();
	});
}

function fetchCurrentChallenge() {
	Alloy.Globals.Spinner.show("Loading challenge...");
	
	$.challengesView.tblChallengeTasks.data = []; //Clear the table
	
	var challengesProvider = new ChallengesProvider();
	
	function onSuccess(response) {
		Ti.API.info("Fetch current challenge success.");
		Ti.API.info(JSON.stringify(response));
			
		Alloy.Globals.Spinner.hide();	
	}
	
	function onFail(reason) {
		Ti.API.error(reason);
			
		Alloy.Globals.Spinner.hide();
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
	
	challengesProvider.getCurrentChallenge().then(onSuccess, onFail);
}

function setNavButtons() {
	if(Ti.Platform.osname === "android") {
		//On Android, call this to ensure the correct actionbar menu is displayed
		$.stats.activity.invalidateOptionsMenu();	
	}
	else {
		$.window.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click	
		});
		
		$.window.rightNavButton = NavBarButton.createRightNavButton({
			image: '/common/icons/refresh-button.png',
			onClick: btnRefresh_click
		});
	}
}

/**
 * @description Event handler for the Window's `open` event. Calls `fetchCurrentChallenge()`.
 * @memberOf Controllers.Challenges
 */
function window_open() {	
	Alloy.Globals.tracker.addScreenView('Challenges');
	
	setNavButtons();
	fetchCurrentChallenge();
}
