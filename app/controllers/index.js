var isLoggedIn = Ti.App.Properties.getBool("isLoggedIn", false);
var win = null;

if(isLoggedIn) {
	win = Alloy.createController('home').getView();
}
else {
	win = Alloy.createController('login').getView();
}

win.open();