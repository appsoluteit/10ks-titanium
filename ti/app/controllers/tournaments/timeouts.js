var args = $.args;

var DateTimeHelper = require('helpers/DateTimeHelper');
var FormatHelper = require('helpers/FormatHelper');

function btnTeamLeaderboard_click() {
    Alloy.createController("tournaments/teamLeaderboard", {
        type: 'timeout'
    })
    .getView()
    .open();
}

function btnTeamMembers_click() {
    Alloy.createController("tournaments/teamMembers", {
        type: 'timeout'
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
    var startDate = new Date(args.tournament.tournamentStartDate);
    var tournamentWeeks = args.tournament.tournamentWeeks * 1;
    var endDate = DateTimeHelper.addWeeks(startDate, tournamentWeeks);

    $.timeoutsView.lblStartDate.text = DateTimeHelper.getDateLabel(startDate);
    $.timeoutsView.lblDuration.text = args.tournament.tournamentWeeks + " weeks";
    $.timeoutsView.lblEndDate.text = DateTimeHelper.getDateLabel(endDate);
    $.timeoutsView.lblTimeLeft.text = DateTimeHelper.getTimeBetween(endDate, new Date());
    $.timeoutsView.lblTeamTotalSteps.text = FormatHelper.formatNumber(args.tournament.teamSteps);
}

function btnBack_click() {
    $.timeouts.close();
}