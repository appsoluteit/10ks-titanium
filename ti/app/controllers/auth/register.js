// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var AuthProvider = require('classes/AuthProvider');

/*********************************** EVENT HANDLERS     ***********************************/
function window_open() {
	$.registerView.btnLogin.addEventListener('click', btnLogin_click);
	$.registerView.btnRegister.addEventListener('click', btnRegister_click);	
}

function btnLogin_click() {
	$.register.close();
}

function btnRegister_click() {
	var authProvider = new AuthProvider($.register, $.registerView.lblError);
	
	authProvider.register(
			 $.registerView.txtUsername.value, 
			 $.registerView.txtEmail.value, 
			 $.registerView.txtPassword.value,
			 $.registerView.txtPassword2.value
	);
}