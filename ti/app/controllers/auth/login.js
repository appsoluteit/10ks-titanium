var args = $.args;
var AuthProvider = require('classes/AuthProvider');

/*********************************** EVENT HANDLERS     ***********************************/
function window_open() {
	$.loginView.btnLogin.addEventListener('click', btnLogin_click);
	$.loginView.btnRegister.addEventListener('click', btnRegister_click);	
}

function btnLogin_click() {	
	var authProvider = new AuthProvider($.login, $.loginView.lblError);
	
	authProvider.login(
		$.loginView.txtUsername.value, 
		$.loginView.txtPassword.value
	);
}

function btnRegister_click() {
	var win = Alloy.createController('auth/register').getView();
	win.open();
}

function androidBack_click() {
	alert("You cannot close the login screen");
}