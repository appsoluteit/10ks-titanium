// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var ui = require('xp.ui');

console.log("Opening details window", args);

function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Challenge Detail"
	});
	
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
}

function btnBack_click() {
	$.challengesDetail.close();
}
