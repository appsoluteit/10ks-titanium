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
var ui = require('xp.ui');

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
	Alloy.Globals.Spinner.show("Loading Challenge...");
	
	$.challengesView.tblChallengeTasks.data = []; //Clear the table
	
	var challengesProvider = new ChallengesProvider();
	
	function onSuccess(response) {
		Ti.API.info("Fetch current challenge success.");
		//Ti.API.info(JSON.stringify(response));

		// Set the content
		var taskDescription = ui.createLabel({
			top: "10dp",
			left: "10dp",
			right: "10dp",
			html: response.description + "<br/>",
			color: 'black'
		});
		$.challengesView.descriptionContainer.add(taskDescription);

		response.challenge_tasks.forEach(function(task, index) {
			Ti.API.info('loading task: ' + JSON.stringify(task));

			var row = Ti.UI.createTableViewRow({
				height: Ti.UI.SIZE
			});
			row.addEventListener('click', function(e) {
				var win = Alloy.createController('challenges/joinChallenge', {
					challenge: task,
					parent: $.challenges
				}).getView();	

				win.open();
			});

			// Add the text
			var view = Ti.UI.createView({
				left: '10dp',
				height: Ti.UI.SIZE,
				layout: 'horizontal',
				horizontalWrap: false
			});

			// Just in case we get extra rows from the API, recycle the icons
			if(index > 3) {
				index = 0;
			}

			var badge = Ti.UI.createImageView({
				image: "/common/icons/challenges/challenge-" + (index + 1) + ".png",
				//backgroundColor: 'red',
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE
			});

			var text = ui.createLabel({
				//backgroundColor: 'blue',

				html: '<b>' + task.name + "</b><br/>" +
					  'Goal Steps: ' + FormatHelper.formatNumber(task.steps_goal),
				width: '75%',
				height: Ti.UI.SIZE,
				textAlign: 'left',
				left: '5dp',
				top: '5dp',
				bottom: '5dp'
			});

			view.add(badge);
			view.add(text);
			row.add(view);

			// Add the right chevron
			var chevron = null;
			if(Ti.Platform.osname === "android") {
				//On Android, create an ImageView instead of a button
				chevron = Ti.UI.createImageView({
					right: "5dp",
					image: "/common/chevrons/right-16.png"
				});
			}
			else {
				chevron = Ti.UI.createButton({
					right: "5dp",
					image: "/common/chevrons/right-16-g.png",
					tintColor: "gray",
					style: Ti.UI.iOS.SystemButtonStyle.PLAIN
				});
			}
			row.add(chevron);

			$.challengesView.tblChallengeTasks.appendRow(row);
		});
		
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
				text: "Couldn't load current Challenge",
				duration: 2000,
				view: $.challenges,
				theme: "error"
			});	
		}		
	}
	
	challengesProvider.getCurrentChallenge().then(onSuccess, onFail);
}

function setNavButtons() {
	if(Ti.Platform.osname === "android") {
		//On Android, call this to ensure the correct actionbar menu is displayed
		$.challenges.activity.invalidateOptionsMenu();	
	}
	else {
		$.window.leftNavButton = NavBarButton.createLeftNavButton({
			text: 'Home',
			onClick: btnBack_click	
		});
		
		$.window.rightNavButton = NavBarButton.createRightNavButton({
			image: '/common/icons/refresh-button-32.png',
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