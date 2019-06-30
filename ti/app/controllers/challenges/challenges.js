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
	Alloy.Globals.Spinner.show("Loading challenge...");
	
	$.challengesView.tblChallengeTasks.data = []; //Clear the table
	
	var challengesProvider = new ChallengesProvider();
	
	function onSuccess(response) {
		Ti.API.info("Fetch current challenge success.");
		Ti.API.info(JSON.stringify(response));

		// Set the content
		var taskDescription = ui.createLabel({
			top: "10dp",
			left: "10dp",
			right: "10dp",
			html: response.description + "<br/>",
			color: 'black'
		});
		$.challengesView.descriptionContainer.add(taskDescription);
			
		response.challenge_tasks.forEach(function(task) {
			Ti.API.info('loading task: ' + task);

			challengesProvider
				.getTask(task)
				.then(function(taskContent) {
					var row = Ti.UI.createTableViewRow({
						height: '60dp',
					});
					row.addEventListener('click', function(e) {
						var win = Alloy.createController('challenges/joinChallenge', {
							challenge: taskContent,
							parent: $.challenges
						}).getView();	

						win.open();
					});

					// Add the text
					var view = Ti.UI.createView({
						left: '10dp',
						orientation: 'vertical'
					});
					var title = Ti.UI.createLabel({
						text: taskContent.name,
						font: {
							fontWeight: 'bold'
						},
						width: Ti.UI.SIZE,
						textAlign: 'left',
						left: 0,
						top: '5dp'
					})
					var subtitle = Ti.UI.createLabel({
						textAlign: 'left',
						color: 'black',
						text: 'Avg Steps: ' + FormatHelper.formatNumber(taskContent.steps_goal),
						width: Ti.UI.SIZE,
						left: 0,
						bottom: '5dp'
					});
					view.add(title);
					view.add(subtitle);
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
				})
				.catch(function(err) {
					Ti.API.error(err);

					Alloy.createWidget("com.mcongrove.toast", null, {
						text: "Couldn't get challenge tasks",
						duration: 2000,
						view: $.stats,
						theme: "error"
					});	
				});
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
				text: "Couldn't load current challenge",
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
		$.stats.activity.invalidateOptionsMenu();	
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