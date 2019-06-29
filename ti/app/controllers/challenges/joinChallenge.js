// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var challenge = $.args.challenge;
var parent = $.args.parent;
var ui = require('xp.ui');
var ChallengesProvider = require('classes/ChallengesProvider');
var SessionHelper = require('helpers/SessionHelper');

function window_open() {	
	Alloy.Globals.tracker.addScreenView('Join Challenge');
	
	var descriptionLabel = ui.createLabel({
		html: challenge.description.replace("\n", "<br/>"),
		color: 'black'
	});
	
	$.joinChallengeView.labelContainer.add(descriptionLabel);	
	
	$.joinChallengeView.btnJoin.addEventListener('click', btnJoin_click);
}

function btnBack_click() {
	$.joinChallenge.close();
}

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
}

function btnJoin_click(e) {
	var confirmDialog = Ti.UI.createAlertDialog({
		cancel: 0,
		buttonNames: ['Cancel', 'OK'],
		message: 'Do you want to join this challenge?',
		title: 'Join challenge'
	});

	confirmDialog.addEventListener('click', function(e) {
		if(e.index !== e.source.cancel) {
			new ChallengesProvider()
				.join(challenge.id)
				.then(function(e) {
					Alloy.createWidget("com.mcongrove.toast", null, {
						text: "Joined challenge successfully",
						duration: 2000,
						view: $.joinChallenge,
						theme: "success"
					});	

					setTimeout(function() {
						// close the join window and the challenge window.
						$.joinChallenge.close();
						parent.close();
					}, 2000);
				})
				.catch(function(reason) {
					if(SessionHelper.isTokenInvalid(reason)) {
						SessionHelper.showInvalidTokenToast($.joinChallenge);
						
						setTimeout(function() {
							showLogin();
						}, 2000);
					}
					else {
						Alloy.createWidget("com.mcongrove.toast", null, {
							text: "Couldn't join challenge",
							duration: 2000,
							view: $.joinChallenge,
							theme: "error"
						});	
					}	
				});
		}
	});

	confirmDialog.show();
}