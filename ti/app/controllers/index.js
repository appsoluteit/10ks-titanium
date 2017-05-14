/**
 * @file Index Controller
 * @description The controller for the index view, which contains an empty Window. This controller simply loads the home controller.
 * @namespace Controllers.Index
 */

var win = Alloy.createController('home/home').getView();
win.open();