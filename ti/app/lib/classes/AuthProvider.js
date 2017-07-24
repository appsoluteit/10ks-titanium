/**
 * @file Authentication Provider
 * @description Provides access to the authentication API
 * @require helpers/APIHelper
 * @require q
 * @require widgets/com.mcongrove.toast
 * @exports AuthProvider
 */

var APIHelper = require('helpers/APIHelper');
var q = require('q');

/**
 * @description Creates a new instance of AuthProvider
 * @class
 */
function AuthProvider() { }

/**
 * @description Attempt to login with the provided credentials.
 * @param {String} username 
 * @param {String} password
 */
AuthProvider.prototype.login = function(username, password) {	
	var self = this;
	var defer = q.defer();
	
	function onSuccess(response) {
		//Store the auth key. Use it until it expires.
		Ti.App.Properties.setString("AuthKey", response.key);	
		Alloy.Globals.IsLoggedIn = true;
		Alloy.Globals.AuthKey = response.key;
		
		defer.resolve();
	}
	
	function onFail(response) {	
		Ti.API.info(response);
		
		var reason = "";
		
		if(response.password && self.errorContainer) {
			reason = "Password: " + response.password;
		}
		else if(response.non_field_errors && self.errorContainer) {
			reason = response.non_field_errors[0];
		}
		
		defer.reject(reason);
	}
	
	var data = {
		username: username,
		password: password
	};
	
	APIHelper.post({
		message:    'Logging in...',
		url: 		'auth/login/',
		data: 		data,
		success: 	onSuccess,
		fail:		onFail
	});
	
	return defer.promise;
};

/**
 * @description Get the user object. This provides useful metrics used in both settings and statistics.
 */
AuthProvider.prototype.getUser = function() {
	var self = this;
	var defer = q.defer();
	
	function onSuccess(response) {	
		Ti.API.info("Got user: ", response);
		
		Ti.App.Properties.setString("UserURL", response.url);
		Alloy.Globals.UserURL = response.url;
		
		//Set some attributes required by settings, statistics, etc
		if(response.walker) {
			Ti.App.Properties.setInt("total_steps", response.walker.total_steps);	
			Ti.App.Properties.setInt("average_daily_steps", response.walker.average_daily_steps);
			Ti.App.Properties.setInt("goal_steps", response.walker.goal);		
		}
		
		defer.resolve();
	}
	
	function onFail(response) {
		Ti.API.info("Failed to get user: ", JSON.stringify(response));
		
		defer.reject(response.detail);
	}
	
	APIHelper.get({
		message: 	"Fetching your account...",
		url: 		"auth/user/",
		headers: [{
					key: "Authorization",
					value: "Token " + Alloy.Globals.AuthKey
		}],
		
		success: 	onSuccess,
		fail: 		onFail
	});	
	
	return defer.promise;
};

AuthProvider.prototype.setGoalSteps = function(goalSteps) {
	var defer = q.defer();
	
	function onSuccess(response) {
		defer.resolve();	
	}
	
	function onFail(reason) {
		defer.reject(reason);
	}
	
	var email = Ti.App.Properties.getString("email", "");
	var data = {
		username: email,
		walker: {
			goal: goalSteps
		}
	};
	
	//TODO: Rework this to use POST after Nick implements a server-side fix
	APIHelper.put({
		message: 	"Updating goal steps...",
		url: 		"auth/user/",
		headers: [{
					key: "Authorization",
					value: "Token " + Alloy.Globals.AuthKey
		}],
		data: data,
		
		success: 	onSuccess,
		fail: 		onFail
	});	
	
	return defer.promise;
};

/**
 * @description Call logout on the API, causing the access token to invalidate. This also removes all app properties, sets `Alloy.Globals` to an
 * empty object and removes all steps data stored locally.
 */
AuthProvider.prototype.logout = function() {
	var self = this;
	var defer = q.defer();
	
	function onSuccess(response) {
		Ti.API.debug("Logout success. Removing data...");
		
		Alloy.Globals.Steps.removeAll();
		
		//Only unset the alloy globals related to authentication.
		Alloy.Globals.IsLoggedIn = false;
		Alloy.Globals.UserURL = "";
		Alloy.Globals.AuthKey = "";
		
		Ti.App.Properties.removeProperty("AuthKey");
		Ti.App.Properties.removeProperty("UserURL");	
		
		defer.resolve();
	}
	
	APIHelper.post({
		message: 'Logging out...',
		url:	 'auth/logout/',
		headers: [{
					key: "Authorization",
					value: "Token " + Alloy.Globals.AuthKey
		}],
		success: onSuccess,
		fail:	 onSuccess	//even if the request failed for whatever reason, still logout client side
	});
	
	return defer.promise;
};

/**
 * @description Call register on the API, closing the container on success.
 * @param {String} username 
 * @param {String} email
 * @param {String} password
 * @param {String} password2
 */
AuthProvider.prototype.register = function(username, email, password, password2) {
	var self = this;
	var defer = q.defer();
	
	function onSuccess(response) {		
		defer.resolve();
	}
	
	function onFail(response) {
		var error = "";
		if(response.username) {
			error = "Username: " + response.username;
		}
		else if(response.email) {
			error = "Email: " + response.email;
		}
		else if(response.password1) {
			error = "Password: " + response.password1;
		}
		else if(response.password2) {
			error = "Retype Password: " + response.password2;
		}
		else if(response.non_field_errors) {
			error = response.non_field_errors[0];	
		}
		else if(response.errorMessage) {
			error = response.errorMessage;
		}
		
		defer.reject(error);
	}
	
	var data = {
		username: username,
		email: email,
		password1: password,
		password2: password2
	};
	
	Ti.API.debug("Sending: " + JSON.stringify(data));
	
	APIHelper.post({
		message:	"Registering your account...",
		url: 		"auth/registration/",
		data: 		data,
		success: 	onSuccess,
		fail: 		onFail	
	});	
	
	return defer.promise;
};

module.exports = AuthProvider;