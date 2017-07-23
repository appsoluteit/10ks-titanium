/**
 * @file Register Controller
 * @requires classes/AuthProvider
 * @description The controller for the register view containing a link to the login view. Closes itself after a successful register.
 * @namespace Controllers.Auth.Register
 */

var args = $.args;
var AuthProvider = require('classes/AuthProvider');

/**
 * @description Event handler for the window's `open` event. Adds `click` event listeners for `btnLogin` and `btnRegister` in the view.
 * @memberOf Controllers.Auth.Register
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Register"
	});
	
	$.registerView.lblLogin.addEventListener('click', lblLogin_click);
	$.registerView.btnRegister.addEventListener('click', btnRegister_click);	
}

/**
 * @description Event handler for `lblLogin`. Closes this window, showing the login window behind it.
 * @memberOf Controllers.Auth.Register
 */
function lblLogin_click() {
	$.register.close();
}

/**
 * @description Calls `register` on the `AuthProvider`, which closes this window on success.
 * @memberOf Controllers.Auth.Register
 */
function btnRegister_click() {
	$.registerView.lblError.text = "";
	var authProvider = new AuthProvider();
	
	authProvider.register(
			 $.registerView.txtUsername.value, 
			 $.registerView.txtEmail.value, 
			 $.registerView.txtPassword.value,
			 $.registerView.txtPassword2.value
	).then(function onSuccess() {
		Ti.API.log("registration success");
		
		var dialog = Ti.UI.createAlertDialog({
			message: 'We have sent an email to you for verification. Follow the link provided to finalse the signup process.',
			ok: 'Okay',
			title: 'Verify your email address'
		});
		dialog.addEventListener('click', function() {
			$.register.close();	
		});	
		dialog.show();
	}, function onFail(reason) {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Registration failed",
			duration: 2000,
			view: $.register,
			theme: "error"
		});	
		
		$.registerView.lblError.text = reason;
	});
}