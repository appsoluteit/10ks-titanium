//Use the login view as the root window
/*
var win = Alloy.createController('auth/login', {
	quit: quit
}).getView();			
win.open();

function quit() {
	Ti.API.info("Root quit called");
	win.close();
	
	Alloy.Globals.Quit();
}
*/

//Note: I used to think that conditionally opening a window on top of the index might cause the Android app to not
//resume. Tried changin it, no effect.
//Dev over-ride
//Alloy.Globals.IsLoggedIn = false;
(function loadRootView() {
	Ti.API.info("Loading root view");
	
	var win = null;
	var preventClose = false;
	
	//Called when the user selects logout from settings. All windows are closed, the appropriate
	//app properties are reset and the main child window is reloaded
	function logoutCallback() {
		Ti.App.Properties.removeProperty("AuthKey");
		Alloy.Globals.IsLoggedIn = false;
		
		reload();
	}
	
	//Close the root window, null it out for GC and reload
	function reload() {
		preventClose = true;
		win.close();
		win = null;
		
		loadRootView();
	}
	
	function goToLogin() {
		win = Alloy.createController('auth/login', {
			logoutCallback: logoutCallback,
			loginCallback: reload
		}).getView();			
		win.open();
	}
	
	function goHome() {
		win = Alloy.createController('home/home', {
			logoutCallback: logoutCallback
		}).getView();
		win.open();
	}
	
	if(Alloy.Globals.IsLoggedIn) {
		goHome();
	}
	else {
		goToLogin();
	}
	
	//If either the login or main window is closed by the user, close the application
	win.addEventListener('close', function() {
		if(!preventClose) {
			Ti.API.info("Main closed");
			$.index.close();	
		}
	});
})();