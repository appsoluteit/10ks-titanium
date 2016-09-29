Alloy.Globals.IsLoggedIn = Ti.App.Properties.hasProperty("AuthKey");
Alloy.Globals.AuthKey = Ti.App.Properties.getString("AuthKey", "");

if(Alloy.Globals.IsLoggedIn)
	Ti.API.info("Logged in already. Key: " + Alloy.Globals.AuthKey);

Alloy.Globals.Loading = Alloy.createWidget("nl.fokkezb.loading");

Alloy.Globals.GetDateString = function(dateObj) {
	var y = dateObj.getFullYear();
	var m = dateObj.getMonth() + 1;
	var d = dateObj.getDate();
	
	if(m < 10)
		m = "0" + m;
		
	if(d < 10)
		d = "0" + d;
		
	return y + "-" + m + "-" + d;	
};

Alloy.Globals.FormatNumber = function(input) {
	//More reliable than String.formatDecimal, which isn't documented in many places.
	return input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function(){
	var ACS = require('ti.cloud'),
	    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
	    username = Ti.App.Properties.getString('acs-username-'+env),
	    password = Ti.App.Properties.getString('acs-password-'+env);
	
	// if not configured, just return
	if (!env || !username || !password) { return; }
	/**
	 * Appcelerator Cloud (ACS) Admin User Login Logic
	 *
	 * fires login.success with the user as argument on success
	 * fires login.failed with the result as argument on error
	 */
	ACS.Users.login({
		login:username,
		password:password,
	}, function(result){
		if (env==='development') {
			Ti.API.info('ACS Login Results for environment `'+env+'`:');
			Ti.API.info(result);
		}
		if (result && result.success && result.users && result.users.length){
			Ti.App.fireEvent('login.success',result.users[0],env);
		} else {
			Ti.App.fireEvent('login.failed',result,env);
		}
	});
})();