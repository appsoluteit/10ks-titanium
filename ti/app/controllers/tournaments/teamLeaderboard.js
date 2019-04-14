var FormatHelper = require('helpers/FormatHelper');
var TournamentLeaderboardProvider = require('classes/TournamentLeaderboardProvider');
var tournamentLeaderboardProvider = new TournamentLeaderboardProvider();

var args = $.args;

// keep in mind that there is 8% lost in left-margins
var cells = [];
// total = 93%

var titles = ['#', 'Team Name', 'Steps'];
if(args.type === 'race') {
    titles.push('%');

    cells = [    
        '10%',  // rank
        '35%',  // name
        '25%',  // total steps
        'auto'   // status (%) (20%)
    ];
}
else {
    cells = [
        '10%', // rank
        '45%', // name
        'auto' // steps
    ];
}

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
        layout: 'horizontal',
        //backgroundColor: 'red' // debug
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

    var labels = [];
    for(var i = 0; i < values.length; i++) {
        var colors = ['red', 'blue', 'pink', 'green'];

        var label = Ti.UI.createLabel({
            text: values[i],
            font: {
                fontWeight: isHeader ? 'bold' : '',
            },
            color: isHeader ? 'white' : 'black',
            top: '5dp',
            left: '2%',
            width: cells[i],

            // debug
            backgroundColor: colors[i]
        });

        // Set a 12pt font size on iOS. On Android, leave the default.
        if(Ti.Platform.osname !== "android") {
            label.font.fontSize = '12pt';
        }

        if(args.type === 'race' && titles[i] === '%') {
            label.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
        }
        else if(args.type === 'timeout' && titles[i] === 'Steps') {
            label.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
        }
        else {
            label.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
        }

        labels.push(label);
    }

    labels.forEach(function(label) {
        row.add(label);
    });
}

function drawHeader() {
    var headerRow = Ti.UI.createView({
        backgroundColor: '#252A32',
        height: '40dp',
        layout: 'horizontal'
    });

    drawCells(headerRow, titles, true);

    var section = Ti.UI.createTableViewSection({
        headerView: headerRow
    });

    $.leaderboardView.tblLeaderboard.insertSectionBefore(0, section);
}

function btnBack_click() {
    $.leaderboard.close();
}