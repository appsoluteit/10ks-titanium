var args = $.args;

var DateTimeHelper = require('helpers/DateTimeHelper');
var FormatHelper = require('helpers/FormatHelper');

function window_open() {
    Alloy.Globals.tracker.addScreenView('Race Tournaments');
    
    // Populate the UI
    $.racesView.btnTeamLeaderboard.addEventListener('click', btnTeamLeaderboard_click);
    $.racesView.btnTeamMembers.addEventListener('click', btnTeamMembers_click);

    if(Ti.Platform.osname === "android") {
		$.races.activity.actionBar.title = args.tournament.tournamentName;
	}
	else {
		$.window.title = args.tournament.tournamentName;
    }	

    // Populate the labels
    $.racesView.lblGoal.text = FormatHelper.formatNumber(args.tournament.tournamentTotalSteps) + " steps";
    $.racesView.lblDistance.text = FormatHelper.formatNumber(args.tournament.tournamentDistance) + "m";
    $.racesView.lblStartDate.text = DateTimeHelper.getDateLabel(new Date(args.tournament.tournamentStartDate));
    $.racesView.lblTeamTotalSteps.text = "";
    $.racesView.lblPercentComplete.text = "";

    $.racesView.vbar1.init(40, 100);
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