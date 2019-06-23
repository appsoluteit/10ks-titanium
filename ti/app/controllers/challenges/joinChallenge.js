// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args.challenge;
var ui = require('xp.ui');

function window_open() {	
	Alloy.Globals.tracker.addScreenView('Join Challenge');
	
	var descriptionLabel = ui.createLabel({
		html: args.description.replace("\n", "<br/>"),
		color: 'black'
	});
	
	$.joinChallengeView.labelContainer.add(descriptionLabel);	
	
	$.joinChallengeView.btnJoin.addEventListener('click', btnJoin_click);
}

function btnBack_click() {
	$.joinChallenge.close();
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
			// TODO
		}
	});

	confirmDialog.show();
}