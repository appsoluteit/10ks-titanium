/**
 * @file Index Controller
 * @description The controller for the index view, which contains an empty Window. This controller simply loads the home controller.
 * @namespace Controllers.Index
 */

if(Alloy.Globals.IsDebug) {
	Ti.API.info("IsDebug turned on. Showing development home screen.");
	
	var win = Alloy.createController('home/home').getView();
	win.open();	
}
else {
	Ti.API.info("IsDebug turned off. Showing production home screen.");
	
	var win = Alloy.createController('prod_home/home').getView();
	win.open();
}