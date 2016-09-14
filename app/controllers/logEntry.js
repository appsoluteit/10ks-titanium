var args = $.args;

function window_open() {
	$.window1.title = args.title;	
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
