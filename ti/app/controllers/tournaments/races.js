var args = $.args;

function window_open() {
    Alloy.Globals.tracker.addScreenView('Race Tournaments');
    
    // Populate the UI
    $.racesView.btnTeamLeaderboard.addEventListener('click', btnTeamLeaderboard_click);
    $.racesView.btnTeamMembers.addEventListener('click', btnTeamMembers_click);

    Ti.API.info(args);

    if(Ti.Platform.osname === "android") {
		$.races.activity.actionBar.title = args.tournament.tournamentName;
	}
	else {
		$.window.title = args.tournament.tournamentName;
    }	

    // TODO: Populate the labels. I guess we'll go with the written text instead of the screenshot.
}

function btnBack_click() {
    $.races.close();
}

function btnTeamLeaderboard_click() {
    alert("Leaderboard coming soon");
}

function btnTeamMembers_click() {
    alert("Team members coming soon");
}