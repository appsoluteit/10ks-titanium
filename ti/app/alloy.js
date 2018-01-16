/**
 * @file Alloy.js
 * @description Container for application-wide constants and globals
 * @namespace Alloy.Globals
 */

//Alloy Globals
(function() {
	/**
	 * @instance
	 * @description Indicates whether or not the user is logged in, according to local data. The API may respond with 'Invalid token.' at any time, indicating that
	 * the user is not logged in (anymore). This setting is set by the existence of an `AuthKey` property in App Properties.
	 * @type {Boolean}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.IsLoggedIn = Ti.App.Properties.hasProperty("AuthKey");

	/**
	 * @instance
	 * @description Stores the user URL unique to the current user.
	 * @type {String}
	 * @memberof Alloy.Globals
	 * @todo Is this field still neccesary?
	 */
	Alloy.Globals.UserURL = Ti.App.Properties.getString("UserURL", "");

	/**
	 * @instance
	 * @description Stores the authentication token for the current user for use in future API requests. Set by the `AuthKey` property in App Properties.
	 * @type {String}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.AuthKey = Ti.App.Properties.getString("AuthKey", "");

	/**
	 * @instance
	 * @description Stores the URL to the 10000 steps website.
	 * @type {String}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.WebURL = 'https://www.10000steps.org.au/';

	/**
	 * @instance
	 * @description Stores the URL to the feedback form on the 10000 steps website.
	 * @type {String}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.FeedbackURL = "https://www.10000steps.org.au/contact/";

	/**
	 * @instance
	 * @description Stores the base URL for all API requests
	 * @type {String}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.BaseURL = 'https://www.10000steps.org.au/api/';

	/**
	 * @instance
	 * @description Stores the reminder end date which indicates how far in advance reminders should be saved on Android, since due to Titanium SDK restrictions,
	 * we are unable to save them indefinitely.
	 * @type {Date}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.ReminderEndDate = new Date();
	Alloy.Globals.ReminderEndDate.setMonth(Alloy.Globals.ReminderEndDate.getMonth() + 1); //one month in advance

	/**
	 * @instance
	 * @description Stores how many days before a reminder expiry the user should be prompted to save their reminders again (Android)
	 * @type {Number}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.ReminderExpiryBufferDays = 7; //how many days before the expiry should we ask the user to save reminders again

	/**
	 * @instance
	 * @description Stores a constant string used as a description for reminders (in addition to the label, which is set by the user)
	 * @type {String}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.AlarmDescription = "Don't forget to log your time!";

	/**
	 * @instance
	 * @description Stores whether or not the app should run in 'debug mode'. If on, the user is able to automatically log into the debug account by clicking login on the
	 * auth/login controller. In addition, when visiting settings, there is an additional row for running app unit tests.
	 * @type {Boolean}
	 * @memberof Alloy.Globals
	 */
	Alloy.Globals.IsDebug = Ti.App.Properties.getBool("is-debug");
	//Alloy.Globals.IsLoggedIn = false; //uncomment this line to force the user to login
})();

//iOS custom button styling
(function() {
	var styles = require('nl.fokkezb.button/styles');
	styles.set('steps-default', {
		backgroundColor: "#52B3FA",
		color: "white",
		borderRadius: "5dp",
		font: {
			fontFamily: 'Arial',
			fontSize: '18sp',
			fontWeight: 'bold'
		},
		activeStyle: {
			backgroundColor: '#397CAD',
			color: 'white'
		},
		//height: "30dp",
		//width: "125dp"

		//These are the highest values usable on an iPhone 5 / iPhone SE that will allow two buttons to be
		//stacked horizontally without any overlap
		height: "50dp",
		width: "135dp"
	});
})();

//Google Analytics Tracking
(function() {
	var GoogleAnalyticsTrackerID = Ti.App.Properties.getString("google-analytics-id");
	var GA = require("analytics.google");
	if(Ti.Platform.osname == 'android') {
	    GA.dispatchInterval = 2; // in minutes
	}
	else if(Ti.Platform.name == 'iPhone OS') {
	    GA.dispatchInterval = 120; // in seconds
	}
	Alloy.Globals.tracker = GA.getTracker(GoogleAnalyticsTrackerID);
})();

//Steps Singleton
(function() {
	var StepsDataProvider = require('classes/StepsDataProvider');
	Alloy.Globals.Steps = new StepsDataProvider();	//this global instance should be used application-wide
})();

//Facebook SDK Integration
//https://github.com/appcelerator-modules/ti.facebook
(function() {
   var fb = require('facebook');
   fb.initialize();
   // Only need Pixel support, not login
})();

//ACS
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