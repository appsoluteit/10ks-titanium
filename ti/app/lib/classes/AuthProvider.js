var APIHelper = require('helpers/APIHelper');

function AuthProvider(container, errorContainer) {
	this.container = container;
	this.errorContainer = errorContainer;
}

AuthProvider.prototype.login = function(username, password) {	
	var self = this;
	
	function onSuccess(response) {
		//Store the auth key. Use it until it expires.
		Ti.App.Properties.setString("AuthKey", response.key);	
		Alloy.Globals.IsLoggedIn = true;
		Alloy.Globals.AuthKey = response.key;
		
		self.errorContainer.text = ""; 
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Logged in successfully",
			duration: 2000,
			view: self.container,
			theme: "success"
		});
		
		setTimeout(function() {
			self.getUser();
		}, 2000);	
	}
	
	function onFail(response) {	
		Ti.API.info(response);
		
		if(response.password) {
			self.errorContainer.text = "Password: " + response.password;
		}
		else if(response.non_field_errors) {
			self.errorContainer.text = response.non_field_errors[0];
		}
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Failed to login",
			duration: 2000,
			view: self.container,
			theme: "error"
		});
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
};

AuthProvider.prototype.getUser = function() {
	var self = this;
	
	function onSuccess(response) {	
		Ti.App.Properties.setString("UserURL", response.url);
		Alloy.Globals.UserURL = response.url;
		
		setTimeout(function() {
			self.container.close();
		}, 2000);
	}
	
	function onFail(response) {
		Ti.API.info("Failed to get user: ", JSON.stringify(response));
		
		if(response.detail) {
			self.errorContainer.text = response.detail;
		}
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Couldn't get user information",
			duration: 2000,
			view: self.container,
			theme: "error"
		});
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
};

AuthProvider.prototype.logout = function() {
	var self = this;
	
	function onSuccess(response) {
		Ti.App.Properties.removeProperty("AuthKey");
		Alloy.Globals.IsLoggedIn = false;
		Alloy.Globals.AuthKey = "";
		
		setTimeout(function() {
			self.container.close();
		}, 2000);		
	}
	
	function onFail(response) {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Unable to logout",
			duration: 2000,
			view: self.container,
			theme: "error"
		});		
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
};

AuthProvider.prototype.register = function(username, email, password, password2) {
	var self = this;
	
	function onSuccess(response) {
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
	
	function onFail(response) {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Registration failed",
			duration: 2000,
			view: self.container,
			theme: "error"
		});
		
		if(response.username) {
			self.errorContainer.text = "Username: " + response.username;
		}
		else if(response.email) {
			self.errorContainer.text = "Email: " + response.email;
		}
		else if(response.password1) {
			self.errorContainer.text = "Password: " + response.password1;
		}
		else if(response.password2) {
			self.errorContainer.text = "Retype Password: " + response.password2;
		}
		else if(response.non_field_errors) {
			self.errorContainer.text = response.non_field_errors[0];
		}
		else if(response.errorMessage) {
			self.errorContainer.text = response.errorMessage;
		}
	}
	
	var data = {
		username: username,
		email: email,
		password1: password,
		password2: password2
	};
	
	Ti.API.info("Sending: " + JSON.stringify(data));
	
	APIHelper.post({
		message:	"Registering your account...",
		url: 		"auth/registration/",
		data: 		data,
		success: 	onSuccess,
		fail: 		onFail	
	});	
};

module.exports = AuthProvider;