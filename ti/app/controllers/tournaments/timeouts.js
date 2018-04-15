function window_open() {
	Alloy.Globals.tracker.addScreenView('Timeout Tournaments');
}

function btnBack_click() {
    $.timeouts.close();
}