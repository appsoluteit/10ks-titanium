var spinner = Alloy.createWidget('nl.fokkezb.loading');
var TournamentLeaderboardProvider = require('classes/TournamentLeaderboardProvider');
var tournamentLeaderboardProvider = new TournamentLeaderboardProvider();

var args = $.args;
var cells = [
    '28%',
    '30%',
    '20%',
    '18%'
];

function window_open() {
    spinner.show('Loading...');
    load().then(function(result) {
        drawHeader();
        drawTable(result);

        spinner.hide();
    });
}

function load() {
    return tournamentLeaderboardProvider.fetch(args.tournamentGuid);
}

function drawTable(data) {
    data.forEach(function(team) {
        drawRow(team);
    });
}

function drawRow(team) {
    var rowView = Ti.UI.createView({
        height: '40dp',
        layout: 'horizontal'
    });

    rowView.add(Ti.UI.createLabel({
        text: 'Hello!'
    }));

    var row = Ti.UI.createTableViewRow({});
    row.add(rowView);

    $.leaderboardView.tblLeaderboard.appendRow(row);
}

function drawHeader() {
    var headerRow = Ti.UI.createView({
        backgroundColor: '#252A32',
        height: '40dp',
        layout: 'horizontal'
    });

    var titles = [
        Ti.UI.createLabel({
            text: 'Team name',
            font: {
                fontWeight: 'bold'
            },
            color: 'white',
            top: '5dp',
            left: '2%',
            width: cells[0]
        }),

        Ti.UI.createLabel({
            text: 'Members',
            font: {
                fontWeight: 'bold'
            },
            top: '5dp',
            color: 'white',
            width: cells[1]
        }),

        Ti.UI.createLabel({
            text: 'Steps',
            font: {
                fontWeight: 'bold'
            },
            top: '5dp',
            color: 'white',
            width: cells[2]
        })
    ];

    if(args.type === 'race') {
        titles.push(Ti.UI.createLabel({
            text: 'Status',
            font: {
                fontWeight: 'bold'
            },
            top: '5dp',
            color: 'white',
            width: cells[3]
        }));
    }

    titles.forEach(function(title) {
        headerRow.add(title);
    });

    var section = Ti.UI.createTableViewSection({
        headerView: headerRow
    });

    $.leaderboardView.tblLeaderboard.insertSectionBefore(0, section);
}

function btnBack_click() {
    $.leaderboard.close();
}