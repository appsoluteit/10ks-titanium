var args = $.args;
var APIHelper = require('helpers/APIHelper');

/*********************************** BUSINESS FUNCTIONS ***********************************/

function doLogin(username, password) {
	function onSuccess(response) {
		//Store the auth key. Use it until it expires.
		Ti.App.Properties.setString("AuthKey", response.key);	
		Alloy.Globals.IsLoggedIn = true;
		Alloy.Globals.AuthKey = response.key;
		
		$.loginView.lblError.text = ""; 
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Logged in successfully",
			duration: 2000,
			view: $.login,
			theme: "success"
		});
		
		setTimeout(function() {
			getUser();
		}, 2000);	
	}
	
	function onFail(response) {	
		Ti.API.info(response);
		
		if(response.password) {
			$.loginView.lblError.text = "Password: " + response.password;
		}
		else if(response.non_field_errors) {
			$.loginView.lblError.text = response.non_field_errors[0];
		}
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Failed to login",
			duration: 2000,
			view: $.login,
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
}

/**
 * Gets the user object from the server (mainly for the URL)
 */
function getUser() {
	function onSuccess(response) {	
		Ti.App.Properties.setString("UserURL", response.url);
		Alloy.Globals.UserURL = response.url;
		
		setTimeout(function() {
			$.login.close();
		}, 2000);
	}
	
	function onFail(response) {
		Ti.API.info("Failed to get user: ", JSON.stringify(response));
		
		if(response.detail) {
			$.loginView.lblError.text = response.detail;
		}
		
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Couldn't get user information",
			duration: 2000,
			view: $.login,
			theme: "error"
		});
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
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
}

/*********************************** EVENT HANDLERS     ***********************************/
function window_open() {
	$.loginView.btnLogin.addEventListener('click', btnLogin_click);
	$.loginView.btnRegister.addEventListener('click', btnRegister_click);	
}

function btnLogin_click() {
	//On success, try a login
	doLogin($.loginView.txtUsername.value, $.loginView.txtPassword.value);
}

function btnRegister_click() {
	var win = Alloy.createController('auth/register').getView();
	win.open();
}

function androidBack_click() {
	alert("You cannot close the login screen");
}