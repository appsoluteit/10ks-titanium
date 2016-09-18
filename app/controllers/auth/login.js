// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

/*********************************** BUSINESS FUNCTIONS ***********************************/

function tryLogin(username, password) {
	var API = require("API");
	var api = new API();
	
	function onSuccess() {
		//Store the auth key. This doesn't change?
		Ti.App.Properties.setString("authKey", this.responseText);		
		goHome();		
	}
	
	function onFail(e) {	
		if(e.code == 400) {
			$.lblError.text = 'Couldn\'t log in. Are your details right?';
		}		
	}
	
	var data = {
		username: username,
		password: password
	};
	
	api.post('http://steps10000.webfactional.com/api/auth/login/', data, onSuccess, onFail);
}

function goHome() {
	var win = Alloy.createController('home').getView();
	
	setTimeout(function() {
		$.login.close();
	}, 1000);
	
	win.open();
}

/*********************************** EVENT HANDLERS     ***********************************/
function btnLogin_click() {
	//On success, try a login
	tryLogin($.auth.txtUsername.value, $.auth.txtPassword.value);
}

function btnRegister_click() {
	var win = Alloy.createController('auth/register').getView();
	win.open();
}
