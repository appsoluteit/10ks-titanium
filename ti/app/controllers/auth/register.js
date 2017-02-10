// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function register(username, email, password, password2) {
	function onSuccess(response) {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Account created. Please check your emails.",
			duration: 2000,
			view: $.register,
			theme: "success"
		});
		
		setTimeout(function (){
			$.register.close();
		}, 2000);
	}
	
	function onFail(response) {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Registration failed",
			duration: 2000,
			view: $.register,
			theme: "error"
		});
		
		if(response.username) {
			$.registerView.lblError.text = "Username: " + response.username;
		}
		else if(response.email) {
			$.registerView.lblError.text = "Email: " + response.email;
		}
		else if(response.password1) {
			$.registerView.lblError.text = "Password: " + response.password1;
		}
		else if(response.password2) {
			$.registerView.lblError.text = "Retype Password: " + response.password2;
		}
		else if(response.non_field_errors) {
			$.registerView.lblError.text = response.non_field_errors[0];
		}
		else if(response.errorMessage) {
			$.registerView.lblError.text = response.errorMessage;
		}
	}
	
	var data = {
		username: username,
		email: email,
		password1: password,
		password2: password2
	};
	
	Ti.API.info("Sending: " + JSON.stringify(data));
	
	Alloy.Globals.API.post({
		message:	"Registering your account...",
		url: 		"auth/registration/",
		data: 		data,
		success: 	onSuccess,
		fail: 		onFail	
	});
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
			 $.registerView.txtEmail.value, 
			 $.registerView.txtPassword.value,
			 $.registerView.txtPassword2.value
	);
}