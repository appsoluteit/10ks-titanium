/**
 * @file Authentication Provider
 * @description Provides access to the authentication API
 * @require helpers/APIHelper
 * @require classes/StepsDataProvider
 * @require q
 * @require widgets/com.mcongrove.toast
 * @exports AuthProvider
 */

var APIHelper = require('helpers/APIHelper');
var StepsDataProvider = require('classes/StepsDataProvider');
var q = require('q');

/**
 * @description Creates a new instance of AuthProvider
 * @class
 * @param {Ti.View} container The containing view. This will be closed on a successful login / register.
 * @param {Ti.Label} errorContainer A label to contain error text. 
 */
function AuthProvider(container, errorContainer) {
	this.container = container;
	this.errorContainer = errorContainer;
}

/**
 * @description Attempt to login with the provided credentials.
 * @param {String} username 
 * @param {String} password
 * @param {Boolean} closeOnComplete Whether or not the container should be closed on successful login.
 */
AuthProvider.prototype.login = function(username, password, closeOnComplete) {	
	var self = this;
	var defer = q.defer();
	
	function onSuccess(response) {
		//Store the auth key. Use it until it expires.
		Ti.App.Properties.setString("AuthKey", response.key);	
		Alloy.Globals.IsLoggedIn = true;
		Alloy.Globals.AuthKey = response.key;
		
		if(self.errorContainer) {
			self.errorContainer.text = ""; 	
		}
		
		if(self.container) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Logged in successfully",
				duration: 2000,
				view: self.container,
				theme: "success"
			});	
		}
		
		if(closeOnComplete && self.container) {
			self.container.close();
		}
		
		defer.resolve();
	}
	
	function onFail(response) {	
		Ti.API.info(response);
		
		if(response.password && self.errorContainer) {
			self.errorContainer.text = "Password: " + response.password;
		}
		else if(response.non_field_errors && self.errorContainer) {
			self.errorContainer.text = response.non_field_errors[0];
		}
		
		if(self.container) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Failed to login",
				duration: 2000,
				view: self.container,
				theme: "error"
			});	
		}
		
		defer.reject();
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
 * @description Get the user object
 * @todo Is this still necessary?
 */
AuthProvider.prototype.getUser = function() {
	var self = this;
	var defer = q.defer();
	
	function onSuccess(response) {	
		Ti.App.Properties.setString("UserURL", response.url);
		Alloy.Globals.UserURL = response.url;
		
		setTimeout(function() {
			if(self.container) {
				self.container.close();	
			}
		}, 2000);
		
		defer.resolve();
	}
	
	function onFail(response) {
		Ti.API.info("Failed to get user: ", JSON.stringify(response));
		
		if(response.detail && self.errorContainer) {
			self.errorContainer.text = response.detail;
		}
		
		defer.reject(response.detail);
		
		if(self.container) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Couldn't get user information",
				duration: 2000,
				view: self.container,
				theme: "error"
			});	
		}
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

/**
 * @description Call logout on the API, causing the access token to invalidate. This also removes all app properties, sets `Alloy.Globals` to an
 * empty object and removes all steps data stored locally.
 */
AuthProvider.prototype.logout = function() {
	var self = this;
	var defer = q.defer();
	
	var stepsDataProvider = new StepsDataProvider();
	
	function onSuccess(response) {
		Ti.App.Properties.removeAllProperties();
		Alloy.Globals = {};
		stepsDataProvider.removeAll();
		
		setTimeout(function() {
			if(self.container) {
				self.container.close();	
			}
		}, 2000);		
		
		defer.resolve();
	}
	
	function onFail(response) {
		if(self.container) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Unable to logout",
				duration: 2000,
				view: self.container,
				theme: "error"
			});		
		}	
		
		defer.reject();
	}
	
	APIHelper.post({
		message: 'Logging out...',
		url:	 'auth/logout/',
		headers: [{
					key: "Authorization",
					value: "Token " + Alloy.Globals.AuthKey
		}],
		success: onSuccess,
		fail:	 onFail
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
		if(self.container) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Account created. Please check your emails.",
				duration: 2000,
				view: self.container,
				theme: "success"
			});
			
			setTimeout(function (){
				self.container.close();
			}, 2000);	
		}
		
		defer.resolve();
	}
	
	function onFail(response) {
		if(self.container) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Registration failed",
				duration: 2000,
				view: self.container,
				theme: "error"
			});	
		}
		
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
		
		if(self.errorContainer) {
			self.errorContainer.text = error;
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