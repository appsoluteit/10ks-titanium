// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

/*********************************** BUSINESS FUNCTIONS ***********************************/
var API = require("API");
	
function quit() {
	//close the root view
	args.quit();
}

function doLogout() {
	Ti.App.Properties.removeProperty("AuthKey");
	Alloy.Globals.IsLoggedIn = false;	
}

function doLogin(username, password) {
	var api = new API();
	
	function onSuccess(response) {
		//Store the auth key. This doesn't change?
		Ti.App.Properties.setString("AuthKey", response.key);	
		Alloy.Globals.IsLoggedIn = true;
		Alloy.Globals.AuthKey = response.key;
			
		//goHome();	
		
		getUser();	
	}
	
	function onFail(response) {	
		Ti.API.info(response);
		
		if(response.password) {
			$.loginView.lblError.text = "Password: " + response.password;
		}
		else if(response.non_field_errors) {
			$.loginView.lblError.text = response.non_field_errors[0];
		}
	}
	
	var data = {
		username: username,
		password: password
	};
	
	api.post({
		message:    'Logging in...',
		url: 		'http://steps10000.webfactional.com/api/auth/login/',
		data: 		data,
		success: 	onSuccess,
		fail:		onFail
	});
}

/**
 * Gets the user object from the server (mainly for the URL)
 */
function getUser() {
	var api = new API();
	
	function onSuccess(response) {	
		Ti.App.Properties.setString("UserURL", response.url);
		Alloy.Globals.UserURL = response.url;
		
		goHome();
	}
	
	function onFail(e) {
		Ti.API.info("Failed to get user: ", JSON.stringify(e));
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	api.get({
		message: 	"Fetching your account...",
		url: 		"http://steps10000.webfactional.com/api/auth/user/",
		headers: [{
					key: "Authorization",
					value: "Token " + Alloy.Globals.AuthKey
		}],
		
		success: 	onSuccess,
		fail: 		onFail
	});
}

function goHome() {
	var win = Alloy.createController('home/home', {
		logoutCallback: doLogout,
		quit: quit
	}).getView();
	
	win.open();
}

/*********************************** EVENT HANDLERS     ***********************************/
function window_open() {
	$.loginView.btnLogin.addEventListener('click', btnLogin_click);
	$.loginView.btnRegister.addEventListener('click', btnRegister_click);	
	
	if(Alloy.Globals.IsLoggedIn) {
		Ti.API.info("Already logged in. Going home...");
		goHome();	
	}
}

function btnLogin_click() {
	//On success, try a login
	doLogin($.loginView.txtUsername.value, $.loginView.txtPassword.value);
}

function btnRegister_click() {
	var win = Alloy.createController('auth/register').getView();
	win.open();
}
