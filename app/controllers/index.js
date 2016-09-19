var win = null;

//Dev over-ride
Alloy.Globals.IsLoggedIn = false;

if(Alloy.Globals.IsLoggedIn) {
	win = Alloy.createController('home').getView();
}
else {
	win = Alloy.createController('auth/login').getView();
}

win.open();