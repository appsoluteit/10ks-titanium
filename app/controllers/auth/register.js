// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnLogin_click() {
	if(Ti.Platform.osname == "ios")
		$.navWinRegister.close();
	else
		$.register.close();
}

function btnRegister_click() {
	
}
