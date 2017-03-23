//Dev over-ride
//Alloy.Globals.IsLoggedIn = true;

var win = Alloy.createController('home/home').getView();
win.open();

//Unit tests follow guide at https://gist.github.com/lbrenman/0c18239184cec1c8c74b
if(Alloy.Globals.RunTests) {
	require('tests/bootstrap');	
}