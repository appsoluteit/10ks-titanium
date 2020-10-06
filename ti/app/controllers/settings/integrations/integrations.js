/**
 * @file Integrations Controller
 * @description The controller for the integrations view.
 * @namespace Controllers.Settings.Integrations.Integrations
 */

 function window_open() {
	if (Ti.Platform.osname !== 'android') {
		Ti.API.info('Making healthkit row');

		var healthKitRow = makeRow('HealthKit');
		healthKitRow.addEventListener('click', tblRowHealthKit_click);
		$.integrationsView.tblContainer.appendRow(healthKitRow);
	}

	// TODO: Add Android integrations
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

function makeRow(title) {
	var row = Ti.UI.createTableViewRow({
		height: "50dp"
	});
	
	row.add(Ti.UI.createLabel({
		text: title,
		left: "10dp",
		textAlign: "left",
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		color: '#000',
		
		font: {
			fontFamily: 'Arial',
			fontSize: '16',
			fontWeight: "bold"
		}
	}));
	
	return row;
}