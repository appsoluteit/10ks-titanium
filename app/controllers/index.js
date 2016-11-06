//Dev over-ride
Alloy.Globals.IsLoggedIn = true;

var win = Alloy.createController('home/home').getView();
win.open();