// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var ui = require('xp.ui');
var FormatHelper = require('helpers/FormatHelper');

console.log("Opening details window", args);

function window_open() {
	if(Ti.Platform.osname === "android") {
		$.challengesDetail.activity.actionBar.title = args.task.name;
	}
	else {
		$.window.title = args.task.name;
	}	
	
	var descriptionLabel = ui.createLabel({
		html: args.task.description.replace("\n", "<br/>")
	});
	
	$.challengesDetailView.labelContainer.add(descriptionLabel);
	
	$.challengesDetailView.challengeDate.text = "Challenge Date: " 
											  + args.task.challenge.start_date 
											  + " - "
											  + args.task.challenge.end_date;
											  
	
	$.challengesDetailView.startedOn.text = "Started On: ";
	$.challengesDetailView.goalSteps.text = "Goal Steps: ";
	$.challengesDetailView.stepsWalked.text = "Steps Walked: ";
	$.challengesDetailView.percentComplete.text = "Percent Complete: ";									
}

function btnBack_click() {
	$.challengesDetail.close();
}
