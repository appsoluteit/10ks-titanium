/**
 * @file Integrations Controller
 * @description The controller for the integrations view.
 * @namespace Controllers.Settings.Integrations.Integrations
 */

 function window_open() {
	$.integrationsView.tblRowHealthKit.addEventListener('click', tblRowHealthKit_click);
 }

 /**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Settings.Integrations.Integrations
 */
function btnBack_click() {
	$.integrations.close();
}

function tblRowHealthKit_click() {
    var win = Alloy.createController('settings/integrations/healthkit').getView();
	win.open();
}