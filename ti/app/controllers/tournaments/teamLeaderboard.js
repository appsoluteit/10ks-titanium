var FormatHelper = require('helpers/FormatHelper');
var TournamentLeaderboardProvider = require('classes/TournamentLeaderboardProvider');
var tournamentLeaderboardProvider = new TournamentLeaderboardProvider();

var args = $.args;
var cells = [
    '15%',
    '43%',
    '20%',
    '18%'
];

function window_open() {
    var leaderboard = tournamentLeaderboardProvider.fetch(args.tournament);

    drawHeader();
    drawTable(leaderboard);
}

function drawTable(data) {
    data.forEach(function(team) {
        drawRow(team);
    });
}

function drawRow(team) {
    var rowView = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: 'horizontal'
    });

    var data = [
        team.rank, 
        team.name + '\r\n(' + team.numMembers + ' members)', 
        FormatHelper.formatNumber(team.totalSteps)
    ];

    if(args.type === 'race') {
        data.push(team.status + '%');
    }

    drawCells(rowView, data, false);

    var row = Ti.UI.createTableViewRow({});
    row.add(rowView);

    $.leaderboardView.tblLeaderboard.appendRow(row);
}

function drawCells(row, values, isHeader) {
    if(values.length > cells.length) {
        throw "ArgumentException: number of values exceeds number of cells";
    }

    var titles = [];
    for(var i = 0; i < values.length; i++) {
        titles.push(Ti.UI.createLabel({
            text: values[i],
            font: {
                fontWeight: isHeader ? 'bold' : ''
            },
            color: isHeader ? 'white' : 'black',
            top: '5dp',
            left: i == 0 ? '2%' : 0,
            width: cells[i]
        }));
    }

    titles.forEach(function(title) {
        row.add(title);
    });
}

function drawHeader() {
    var headerRow = Ti.UI.createView({
        backgroundColor: '#252A32',
        height: '40dp',
        layout: 'horizontal'
    });

    var titles = ['Rank', 'Team Name', 'Steps'];
    if(args.type === 'race') {
        titles.push('Status');
    }

    drawCells(headerRow, titles, true);

    var section = Ti.UI.createTableViewSection({
        headerView: headerRow
    });

    $.leaderboardView.tblLeaderboard.insertSectionBefore(0, section);
}

function btnBack_click() {
    $.leaderboard.close();
}