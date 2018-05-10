var args = $.args;

function window_open() {
    draw();
}

function draw() {
    var headerRow = Ti.UI.createView({
        backgroundColor: '#252A32',
        height: '40dp'
    });

    var titles = [
        Ti.UI.createLabel({
            text: 'Team name',
            color: 'white',
            left: '2%'
        }),

        Ti.UI.createLabel({
            text: 'Members',
            color: 'white',
            left: '30%'
        }),

        Ti.UI.createLabel({
            text: 'Steps',
            color: 'white',
            left: '60%'
        })
    ];

    if(args.type === 'race') {
        titles.push(Ti.UI.createLabel({
            text: 'Status',
            color: 'white',
            left: '80%'
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