// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

/*********************************** BUSINESS FUNCTIONS ***********************************/

function tryLogin(username, password) {
	var API = require("API");
	var api = new API();
	
	function onSuccess(response) {
		//Store the auth key. This doesn't change?
		Ti.App.Properties.setString("AuthKey", response.key);		
		goHome();		
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
	
	api.post('http://steps10000.webfactional.com/api/auth/login/', data, onSuccess, onFail);
}

function goHome() {
	var win = Alloy.createController('home', {
		logoutCallback: args.logoutCallback
	}).getView();
	
	setTimeout(function() {
		$.login.close();
	}, 1000);
	
	win.open();
}

/*********************************** EVENT HANDLERS     ***********************************/
function window_open() {
	$.loginView.btnLogin.addEventListener('click', btnLogin_click);
	$.loginView.btnRegister.addEventListener('click', btnRegister_click);	
}

function btnLogin_click() {
	//On success, try a login
	tryLogin($.loginView.txtUsername.value, $.loginView.txtPassword.value);
}

function btnRegister_click() {
	var win = Alloy.createController('auth/register').getView();
	win.open();
}
