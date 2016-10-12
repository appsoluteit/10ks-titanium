Alloy.Globals.IsLoggedIn = Ti.App.Properties.hasProperty("AuthKey");
Alloy.Globals.AuthKey = Ti.App.Properties.getString("AuthKey", "");
Alloy.Globals.UserURL = Ti.App.Properties.getString("UserURL", "");

if(Alloy.Globals.IsLoggedIn) {
	Ti.API.info("Logged in already. Key: ", Alloy.Globals.AuthKey, " URL: ", Alloy.Globals.UserURL);
}
Alloy.Globals.Loading = Alloy.createWidget("nl.fokkezb.loading");

/**
 * Accepts a JS Date object and returns a formatted string in y-m-d. Used for storing dates consistently internally.
 */
Alloy.Globals.FormatDate = function(dateObj) {
	var y = dateObj.getFullYear();
	var m = dateObj.getMonth() + 1;
	var d = dateObj.getDate();
	
	if(m < 10)
		m = "0" + m;
		
	if(d < 10)
		d = "0" + d;
		
	return y + "-" + m + "-" + d;	
};

Alloy.Globals.FormatTime = function(dateObj) {
	var h = dateObj.getHours();
	var m = dateObj.getMinutes();
	var postfix = h < 12 ? "am" : "pm";
	
	if(h > 12)
		h -= 12;
	
	/*
	if(h < 10)
		h = "0" + h;
	*/
	
	if(m < 10)
		m = "0" + m;
	
	return h + ":" + m + postfix;
};
Alloy.Globals.UnformatTime = function(dateStr) {
	var timeparts = dateStr.split(":");
	
	var h = parseInt(timeparts[0], 10);
	var m = parseInt(timeparts[1].substr(0, 2), 10);
	var postfix = timeparts[1].substr(2,2); //get the am/pm postfix
	
	if(postfix === "pm") {
		h += 12;
	}
	
	Ti.API.info("UnformatTime created new time string: " + h + ":" + m);
	
	var d = new Date();
	d.setHours(h, m);
	
	return d;
};

Alloy.Globals.FormatNumber = function(input) {
	//More reliable than String.formatDecimal, which isn't documented in many places.
	return input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

Alloy.Globals.Quit = function() {
	Ti.API.info("Alloy Globals Quit");
	
    var activity = Titanium.Android.currentActivity;
    activity.finish(); 	
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