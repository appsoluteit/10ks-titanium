var args = $.args;

function window_open() {
	$.window1.title = args.title;	
}

function btnDone_click() {
	//TODO: Save value in local storage until Sync
	Ti.API.info($.logDetails.lblDailyTotal.text);
	
	/*
	Alloy.createModel("log", {
			
	});
	*/
	
	$.logEntry.close();
}
