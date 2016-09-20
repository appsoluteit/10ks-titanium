//Dev over-ride
//Alloy.Globals.IsLoggedIn = false;

(function loadRootView() {
	function logoutCallback() {
		Ti.App.Properties.removeProperty("AuthKey");
		Alloy.Globals.IsLoggedIn = false;
		
		loadRootView();
	}
	
	var win = null;
	
	if(Alloy.Globals.IsLoggedIn) {
		win = Alloy.createController('home', {
			logoutCallback: logoutCallback
		}).getView();
	}
	else {
		win = Alloy.createController('auth/login', {
			logoutCallback: logoutCallback
		}).getView();
	}
	
	win.open();
})();