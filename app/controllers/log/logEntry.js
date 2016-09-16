var args = $.args;

function window_open() {
	if(Ti.Platform.osname === "ios") {
		$.window1.title = args.title;
	}	
	else if(Ti.Platform.osname === "android") {
		$.logEntry.activity.actionBar.title = args.title;
		
		Ti.API.info("Setting action bar title: " + args.title);
	}
}

function btnDone_click() {
	//Save value in local storage until Sync
	/*
	Alloy.createModel("log", {
		day: args.date,
		steps: $.logDetails.lblDailyTotal.total		
	});
	*/
	
	//Pass the formatted string back to the parent to display it in the table	
	args.callback($.logDetails.lblDailyTotal.text);
	
	$.logEntry.close();
}
