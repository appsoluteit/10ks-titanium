var args = $.args;

function window_open() {
	Ti.API.info("Opening window. Title: " + args.title);
	Ti.API.info("Default title: " + $.window1.title);
	
	$.window1.title = args.title;	
}

function btnDone_click() {
	$.logEntry.close();
}
