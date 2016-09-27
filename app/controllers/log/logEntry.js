var args = $.args;

function btnDone_click() {
	//Save value in local storage until Sync
	
	var logInstance = Alloy.createModel('log', {
	    steps_date: 	'1990-01-01', 
	    steps_total: 	 1,
	    steps_walked:  	 2,
	    activity_part: 	 3,
	    moderate:      	 4,
	    vigorous:     	 5
	});
	
	if(logInstance.isValid()) {
		Ti.API.info("Model valid. Saving");
		logInstance.save();
	}
	else {
		Ti.API.error("Model not valid. Destroying");
		logInstance.destroy();
	}
	
	//Pass the formatted string back to the parent to display it in the table	
	args.callback($.logEntryView.lblDailyTotal.text);
	
	$.logEntry.close();
}

function window_open() {
	if(Ti.Platform.osname === "android") {
		$.logEntry.activity.actionBar.title = args.title;
		
		Ti.API.info("Setting action bar title: " + args.title);
	}
	else {
		$.window.title = args.title;
	}	
	
	//Custom event listeners for nested view elements
	$.logEntryView.txtStepsWalked.addEventListener('change', txtStepsWalked_change);
	$.logEntryView.txtModerateMins.addEventListener('change', txtModerateMins_change);
	$.logEntryView.txtVigorousMins.addEventListener('change', txtVigorousMins_change);
}

function txtStepsWalked_change() {
	calculateTotal();
}

function txtModerateMins_change() {
	calculateTotal();
}

function txtVigorousMins_change() {
	calculateTotal();
}

function calculateTotal() {
	//total = steps walked + (moderate x 100) + (vigorous x 200)
	var stepsWalked = $.logEntryView.txtStepsWalked.value;
	var moderateMins = $.logEntryView.txtModerateMins.value;
	var vigorousMins = $.logEntryView.txtVigorousMins.value;
	
	if(stepsWalked == '')
		stepsWalked = 0;
	else
		stepsWalked = parseInt(stepsWalked, 10);
		
	if(moderateMins == '')
		moderateMins = 0;
	else
		moderateMins = parseInt(moderateMins, 10);
		
	if(vigorousMins == '')
		vigorousMins = 0;
	else
		vigorousMins = parseInt(vigorousMins, 10);
	
	var total = stepsWalked + (moderateMins * 100) + (vigorousMins * 200);
	
	$.logEntryView.lblDailyTotal.total = total;	//store the total in a custom attribute
	$.logEntryView.lblDailyTotal.text = String.formatDecimal(total, 'en-US', '##,##0');
}