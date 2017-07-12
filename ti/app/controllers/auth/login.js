/**
 * @file Login Controller
 * @requires classes/AuthProvider
 * @description The controller for the login view containing a link to the register view. Closes itself after a successful login.
 * @namespace Controllers.Auth.Login
 */

var args = $.args;
var AuthProvider = require('classes/AuthProvider');

/**
 * @description Event handler for the window's `open` event. Adds `click` event listeners for `btnLogin` and `btnRegister` in the view.
 * @memberOf Controllers.Auth.Login
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Login"
	});
	
	$.loginView.lblForgotPassword.addEventListener('click', lblForgotPassword_click);
	$.loginView.lblSignUp.addEventListener('click', lblSignUp_click);
	$.loginView.btnLogin.addEventListener('click', btnLogin_click);	
}

/**
 * @description Event handler for `btnLogin` on the view. If `Alloy.Globals.IsDebug` is turned on, this will automatically add the default
 * account information in `txtUsername` and `txtPassword`. In either case, it will call `login` on the `AuthProvider`, then call `getUser`.
 * @memberOf Controllers.Auth.Login
 */
function btnLogin_click() {	
	var authProvider = new AuthProvider($.login, $.loginView.lblError);
	
	if(Alloy.Globals.IsDebug) {
		if($.loginView.txtUsername.value === "") {
			$.loginView.txtUsername.value = "ichimansteps@gmail.com";
		}	
		
		if($.loginView.txtPassword.value === "") {
			$.loginView.txtPassword.value = "12345678";
		}
	}
	
	authProvider.login(
		$.loginView.txtUsername.value, 
		$.loginView.txtPassword.value
	).then(function() {
		authProvider.getUser();
	});
}

/**
 * @description Event handler for `lblSignUp` on the view. Opens the register window on top of this window.
 * @memberOf Controllers.Auth.Login
 */
function lblSignUp_click() {
	var win = Alloy.createController('auth/register').getView();
	win.open();
}

function lblForgotPassword_click() {
	Ti.Platform.openURL('https://www.10000steps.org.au/accounts/password/reset/');
}

/**
 * @description Event handler for the `back` event on Android devices. Shows an alert informing them that the login window cannot be closed.
 * @memberOf Controllers.Auth.Login
 */
function androidBack_click() {
	alert("You cannot close the login screen");
}