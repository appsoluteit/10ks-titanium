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

/**
 * Accepts a JS Date object and returns a formatted string in H:m. Includes am/pm postfix. 
 */
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

/**
 * Accepts an H:m am/pm string and returns a JS Date object.
 */
Alloy.Globals.UnformatTime = function(dateStr) {
	var timeparts = dateStr.split(":");
	
	var h = parseInt(timeparts[0], 10);
	var m = parseInt(timeparts[1].substr(0, 2), 10);
	var postfix = timeparts[1].substr(2,2); //get the am/pm postfix
	
	if(postfix === "pm") {
		h += 12;
	}
	
	var d = new Date();
	d.setHours(h, m);
	
	Ti.API.info("UnformatTime created new time: " + d.toString());
	
	return d;
};

/**
 * Accepts a double and returns a string in $123,45.67 format.
 */
Alloy.Globals.FormatNumber = function(input) {
	//More reliable than String.formatDecimal, which isn't documented in many places.
	return input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

/**
 * Returns an array containing the defined reminder days.
 * @returns {Array[Object]}
 */
Alloy.Globals.GetReminderDays = function() {
	var activeDays = [];
	
	if(Ti.App.Properties.hasProperty("ReminderRepeat")) {
 		var reminderRepeat = Ti.App.Properties.getString("ReminderRepeat");
		var objReminderRepeat = JSON.parse(reminderRepeat);

		activeDays = objReminderRepeat.filter(function(e) { return e.active; });		
	}
	
	return activeDays;
};

/**
 * Returns a JS DateTime for the next reminder date at the specified reminder time.
 */
Alloy.Globals.GetNextReminderDateTime = function() {
  function makeDate(dayObj, timeObj) {
		dayObj.setHours(timeObj.getHours());
      	dayObj.setMinutes(timeObj.getMinutes());
      
      	Ti.API.info("Made date: ", dayObj.toString());
      	return dayObj;
  }

  var now = new Date();
  var curDayOfWeek = now.getDay() + 1;

  var activeDays = Alloy.Globals.GetReminderDays();
  var reminderTime = Alloy.Globals.UnformatTime(Ti.App.Properties.getString("ReminderTime"));

  console.log("Current day of week: " + curDayOfWeek);
  console.log("Reminder time: ", reminderTime.toString());
  console.log("Active days: ", activeDays);
  
  for(var i = 0; i < activeDays.length; i++) {
    var ele = activeDays[i];
    console.log("Active day day of week: " + ele.dayOfWeek);
    
    if (ele.dayOfWeek === curDayOfWeek) {
      //If checking today, make sure we haven't passed the time cutoff
      var isBeforeCutoffTime = (now.getHours() < reminderTime.getHours()) ||
      						   (now.getHours() === reminderTime.getHours() &&
      						   now.getMinutes() < reminderTime.getMinutes());
      						   
      if (isBeforeCutoffTime) {
		console.log("Today is the next active reminder day");
        return makeDate(now, reminderTime);
      }
    } else if (ele.dayOfWeek > curDayOfWeek) {
      	
      	var nextDay = new Date();
      	
      	//Add days to the date object based on the difference between today and the day in settings
      	nextDay.setDate(now.getDate() + (ele.dayOfWeek - curDayOfWeek));

      	return makeDate(nextDay, reminderTime);
    }
  };
};

//Not used anymore
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