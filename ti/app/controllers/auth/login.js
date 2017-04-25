var args = $.args;
var AuthProvider = require('classes/AuthProvider');

/*********************************** EVENT HANDLERS     ***********************************/
function window_open() {
	$.loginView.btnLogin.addEventListener('click', btnLogin_click);
	$.loginView.btnRegister.addEventListener('click', btnRegister_click);	
}

function btnLogin_click() {	
	var authProvider = new AuthProvider($.login, $.loginView.lblError);
	
	if(Alloy.Globals.IsDebug) {
		if($.loginView.txtUsername.value === "") {
			$.loginView.txtUsername.value = "admin@jasonsultana.com";
		}	
		
		if($.loginView.txtPassword.value === "") {
			$.loginView.txtPassword.value = "steps1990";
		}
	}
	
	authProvider.login(
		$.loginView.txtUsername.value, 
		$.loginView.txtPassword.value
	).then(function() {
		authProvider.getUser();
	});
}

function btnRegister_click() {
	var win = Alloy.createController('auth/register').getView();
	win.open();
}

function androidBack_click() {
	alert("You cannot close the login screen");
}