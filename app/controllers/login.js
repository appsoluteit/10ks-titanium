// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function btnLogin_click(e) {
	//TODO: validation
	
	//On success, try a login
	//tryLogin($.txtUsername.value, $.txtPassword.value);
	
	goHome();
}

function tryLogin(username, password) {
	var req = Ti.Network.createHTTPClient();
	req.onload = function() {
		try {
			Ti.API.info(this.readyState);
			
			if(this.readyState === 4) {
				if(this.status === 200) {
					Ti.API.info(this.responseText);
					
					//TODO: store the auth key
					//TODO: save the login status?
					
					goHome();
				}
			}
		}
		catch(err) {
			Ti.API.error('Caught error: ' + err);
		}
	};
	
	req.onerror = function(e) {
		Ti.API.error('Request error. Code: ' + e.code + ', error: ' + e.error);
		
		if(e.code === 400) {
			$.lblError.text = 'Couldn\'t log in. Are your details right?';
		}
	};
	
	req.open('POST', 'http://steps10000.webfactional.com/api/auth/login/');
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send({
		username: username,
		password: password
	});
}

function goHome() {
	var win = Alloy.createController('home').getView();

	win.addEventListener('open', function() {
		var anim = Ti.UI.createAnimation({
			left: 0,
			duration: 1000
		});
		
		win.animate(anim);
		
		/*
		setTimeout(function() {
			$.login.close();
		}, 1000);
		*/
	});
	
	win.open();
}
