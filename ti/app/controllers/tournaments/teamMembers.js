var FormatHelper = require('helpers/FormatHelper');
var TournamentMembersProvider = require('classes/TournamentMembersProvider');
var membersProvider = new TournamentMembersProvider();
var args = $.args;

function window_open() {
    loadMembers();
}

function btnBack_click() {
    $.members.close();
}

function loadMembers() {
    var contacts = membersProvider.fetch(args.tournament);

    // https://stackoverflow.com/questions/22763035/appcelerator-titanium-js-table-alphabetical-index-not-working
    var sectionArr = [];
    var index = [];
    for (var i = 0, lastL, l, currSection, ilen = contacts.length; i < ilen; i++) {
        l = contacts[i].lastName.substr(0, 1);
        if (lastL != l) {
            index.push({
                title : l,
                index : i
            });
            currSection = Ti.UI.createTableViewSection({
                headerTitle : l
            });
            sectionArr.push(currSection);
        }
        var row = Ti.UI.createTableViewRow({
            //title : contacts[i],
        });
        var rowView = Ti.UI.createView({ height: '50dp' });

        // Child view for the full name
        var nameView = Ti.UI.createView({ left: '5dp', layout: 'horizontal' });
        nameView.add(Ti.UI.createLabel({
            text: contacts[i].firstName,
            top: '25%',
            color: 'black',
            font: {
                fontSize: '12pt'
            }
        }));
        nameView.add(Ti.UI.createLabel({
            text: ' ' + contacts[i].lastName,
            top: '25%',
            font: {
                fontWeight: 'bold',
                fontSize: '12pt'
            },
            color: 'black'
        }));

        rowView.add(nameView);
        rowView.add(Ti.UI.createLabel({
            right: '5dp',
            text: FormatHelper.formatNumber(contacts[i].steps),
            color: 'gray',
            font: {
                fontSize: '12pt'
            }
        }));
        row.add(rowView);

        currSection.add(row);
        lastL = l;
    }

    $.membersView.tbMembers.setData(sectionArr);
    $.membersView.tbMembers.index = index;
}