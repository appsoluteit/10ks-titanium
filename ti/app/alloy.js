//Globals
Alloy.Globals.IsLoggedIn = Ti.App.Properties.hasProperty("AuthKey");
Alloy.Globals.UserURL = Ti.App.Properties.getString("UserURL", "");
Alloy.Globals.AuthKey = Ti.App.Properties.getString("AuthKey", "");
Alloy.Globals.RunTests = true;
Alloy.Globals.BaseURL = 'https://www.10000steps.org.au/api/';

//Global objects
Alloy.Globals.Loading = Alloy.createWidget("nl.fokkezb.loading");
Alloy.Globals.API = require("API");

//Global methods (soon to be moved to helper object)
Alloy.Globals.Logout = function() {
	console.warn("This function is deprecated and will soon be replaced by an API call to logout");
	
	Ti.App.Properties.removeProperty("AuthKey");
	Alloy.Globals.IsLoggedIn = false;
};

// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function() {
	var ACS = require('ti.cloud'),
	    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
	    username = Ti.App.Properties.getString('acs-username-' + env),
	    password = Ti.App.Properties.getString('acs-password-' + env);

	// if not configured, just return
	if (!env || !username || !password) {
		return;
	}
	/**
	 * Appcelerator Cloud (ACS) Admin User Login Logic
	 *
	 * fires login.success with the user as argument on success
	 * fires login.failed with the result as argument on error
	 */
	ACS.Users.login({
		login : username,
		password : password,
	}, function(result) {
		if (env === 'development') {
			Ti.API.info('ACS Login Results for environment `' + env + '`:');
			Ti.API.info(result);
		}
		if (result && result.success && result.users && result.users.length) {
			Ti.App.fireEvent('login.success', result.users[0], env);
		} else {
			Ti.App.fireEvent('login.failed', result, env);
		}
	});
})(); 