/**
 * @file Register Controller
 * @requires classes/AuthProvider
 * @description The controller for the register view containing a link to the login view. Closes itself after a successful register.
 * @namespace Controllers.Auth.Register
 */

var args = $.args;
var AuthProvider = require('classes/AuthProvider');
var NavBarButton = require('classes/NavBarButton');

/**
 * @description Event handler for the window's `open` event. Adds `click` event listeners for `btnLogin` and `btnRegister` in the view.
 * @memberOf Controllers.Auth.Register
 */
function window_open() {	
	Alloy.Globals.tracker.addScreenView('Register');
	
	//$.registerView.lblLogin.addEventListener('click', lblLogin_click);
	//$.registerView.btnRegister.addEventListener('click', btnRegister_click);	
	//$.registerView.btnPasswordHelp.addEventListener('click', btnPasswordHelp_click);
	
	//Add a 'back' navigation button
	if(Ti.Platform.osname !== "android") {
		$.window.leftNavButton = NavBarButton.createLeftNavButton({
			text: "Login",
			onClick: function() {
				$.register.close();
			}
		});	
	}
	
	$.registerView.webView.addEventListener('load', function(e) {
		//If the url changes to the confirm email url, show a toast and close the window
		if(e.url === "https://www.10000steps.org.au/accounts/confirm-email/") {
			var dialog = Ti.UI.createAlertDialog({
				message: 'We have sent an email to you for verification. Follow the link provided to finalise the signup process.',
				ok: 'OK',
				title: 'Verify your email address'
			});
			dialog.addEventListener('click', function() {
				$.register.close();	
			});	
			dialog.show();			
		}
	});
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
			ok: 'OK',
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

function btnPasswordHelp_click() {
	var dialog = Ti.UI.createAlertDialog({
		title: 'Password Help',
		message: 'Passwords are case sensitive. Minimum 8 characters. Do not use your first name, last name or email.',
		ok: 'OK'
	});
	dialog.show();
}
