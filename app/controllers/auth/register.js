// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function register(username, email, password) {
	var API = require("API");
	var api = new API();
	
	function onSuccess(response) {
		//TODO: Add a success notification
		$.register.close();
	}
	
	function onFail(response) {
		if(response.username) {
			$.registerView.lblError.text = "Username: " + response.username;
		}
		else if(response.password1) {
			$.registerView.lblError.text = "Password: " + response.password1;
		}
		else if(response.email) {
			$.registerView.lblError.text = "Username: " + response.email;
		}
	}
	
	var data = {
		username: username,
		email: email,
		password1: password,
		password2: password
	};
	
	Ti.API.info("Sending: " + JSON.stringify(data));
	
	api.post("http://steps10000.webfactional.com/api/auth/registration/", data, onSuccess, onFail);
}

/*********************************** EVENT HANDLERS     ***********************************/
function window_open() {
	$.registerView.btnLogin.addEventListener('click', btnLogin_click);
	$.registerView.btnRegister.addEventListener('click', btnRegister_click);	
}

function btnLogin_click() {
	$.register.close();
}

function btnRegister_click() {
	register($.registerView.txtUsername.value, 
			 $.registerView.txtUsername.value, 
			 $.registerView.txtPassword.value
	);
}


