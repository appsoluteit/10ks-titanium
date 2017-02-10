// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function window_open() {
	$.aboutView.lblVersion.text = "Version " + Ti.App.version;
	
	$.aboutView.btnWebsite.addEventListener('click', btnWebsite_click);
	$.aboutView.btnSendFeedback.addEventListener('click', btnSendFeedback_click);
}

function btnBack_click() {
	$.about.close();
}

function btnWebsite_click() {
	Ti.Platform.openURL("http://10000steps.org.au");
}

function btnSendFeedback_click() {
	Ti.Platform.openURL("http://10000steps.org.au/help/contact-us/");
}
