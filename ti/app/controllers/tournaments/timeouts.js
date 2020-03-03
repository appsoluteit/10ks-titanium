var args = $.args;

var DateTimeHelper = require('helpers/DateTimeHelper');
var FormatHelper = require('helpers/FormatHelper');

function btnTeamLeaderboard_click() {
    Alloy.createController("tournaments/teamLeaderboard", {
        type: 'timeout',
        tournament: args.tournament
    })
    .getView()
    .open();
}

function btnTeamMembers_click() {
    Alloy.createController("tournaments/teamMembers", {
        type: 'timeout',
        tournament: args.tournament
    })
    .getView()
    .open();
}

function window_open() {
    //Ti.API.info(args);

    Alloy.Globals.tracker.addScreenView('Timeout Tournaments');
    
    // Populate the UI
    $.timeoutsView.btnTeamLeaderboard.addEventListener('click', btnTeamLeaderboard_click);
    $.timeoutsView.btnTeamMembers.addEventListener('click', btnTeamMembers_click);

    if(Ti.Platform.osname === "android") {
        $.timeouts.activity.actionBar.setTitle(args.tournament.tournamentName);
    }
    else {
        $.window.title = args.tournament.tournamentName;
    }	

    // Populate the labels
    $.timeoutsView.lblStartDate.text = DateTimeHelper.getDateLabel(args.tournament.tournamentStartDate, true);
    $.timeoutsView.lblDuration.text = args.tournament.tournamentWeeks + " weeks";
    $.timeoutsView.lblEndDate.text = DateTimeHelper.getDateLabel(args.tournament.tournamentEndDate, true);
    $.timeoutsView.lblTimeLeft.text = DateTimeHelper.getTimeBetween(args.tournament.tournamentEndDate, new Date());
    $.timeoutsView.lblTeamTotalSteps.text = FormatHelper.formatNumber(args.tournament.teamSteps);
}

function btnBack_click() {
    $.timeouts.close();
}