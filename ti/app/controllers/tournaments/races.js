var args = $.args;

var DateTimeHelper = require('helpers/DateTimeHelper');
var FormatHelper = require('helpers/FormatHelper');

function window_open() {
    Alloy.Globals.tracker.addScreenView('Race Tournaments');
    
    // Populate the UI
    $.racesView.btnTeamLeaderboard.addEventListener('click', btnTeamLeaderboard_click);
    $.racesView.btnTeamMembers.addEventListener('click', btnTeamMembers_click);

    if(Ti.Platform.osname === "android") {
		$.races.activity.actionBar.setTitle(args.tournament.tournamentName);
	}
	else {
		$.window.title = args.tournament.tournamentName;
    }	

    // Populate the labels
    $.racesView.lblGoal.text = FormatHelper.formatNumber(args.tournament.tournamentTotalSteps) + " steps";
    $.racesView.lblDistance.text = FormatHelper.formatNumber(args.tournament.tournamentDistance) + "m";
    $.racesView.lblStartDate.text = DateTimeHelper.getDateLabel(new Date(args.tournament.tournamentStartDate), true);
    $.racesView.lblTeamTotalSteps.text = FormatHelper.formatNumber(args.tournament.teamSteps);

    var percentComplete = args.tournament.teamSteps / args.tournament.tournamentTotalSteps;
    $.racesView.lblPercentComplete.text = Math.round(percentComplete * 100) + '%';

    $.racesView.vbar1.init(args.tournament.teamSteps, args.tournament.tournamentTotalSteps);
}

function btnBack_click() {
    $.races.close();
}

function btnTeamLeaderboard_click() {
    Alloy.createController("tournaments/teamLeaderboard", {
        type: 'race',
        tournament: args.tournament
    })
    .getView()
    .open();
}

function btnTeamMembers_click() {
    Alloy.createController("tournaments/teamMembers", {
        type: 'race',
        tournament: args.tournament
    })
    .getView()
    .open();
}