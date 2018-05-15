var spinner = Alloy.createWidget('nl.fokkezb.loading');
var FormatHelper = require('helpers/FormatHelper');
var TournamentMembersProvider = require('classes/TournamentMembersProvider');
var membersProvider = new TournamentMembersProvider();

function window_open() {
    loadMembers();
}

function btnBack_click() {
    $.members.close();
}

function loadMembers() {
    spinner.show('Loading...');
    membersProvider.fetch().then(function(contacts) {
        Ti.API.info('results: ', contacts);

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
                top: '25%'
            }));
            nameView.add(Ti.UI.createLabel({
                text: ' ' + contacts[i].lastName,
                top: '25%',
                font: {
                    fontWeight: 'bold'
                }
            }));

            rowView.add(nameView);
            rowView.add(Ti.UI.createLabel({
                right: '5dp',
                text: FormatHelper.formatNumber(contacts[i].steps)
            }));
            row.add(rowView);

            currSection.add(row);
            lastL = l;
        }

        $.membersView.tbMembers.setData(sectionArr);
        $.membersView.tbMembers.index = index;

        spinner.hide();
    });
}