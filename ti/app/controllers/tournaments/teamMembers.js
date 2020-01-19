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
    //var contacts = membersProvider.fetchFake();

    // https://stackoverflow.com/questions/22763035/appcelerator-titanium-js-table-alphabetical-index-not-working
    var sectionArr = [];
    var index = [];

    var alphaStart = "A".charCodeAt(0);
    var alphaEnd = "Z".charCodeAt(0);
    var rowCount = 0;

    // starting at 0, loop through the range of A to Z plus 1.
    // we do one extra iteration to handle non-ASCII contacts.
    for (var i = 0; i <= (alphaEnd - alphaStart + 1); i++) {
        var currentCharCode = alphaStart + i;
        var isLastIteration = i === (alphaEnd - alphaStart + 1);

        var sectionContacts = isLastIteration ?
            contacts.filter(c => {
                // get the contacts whose last name starts with a character outside of the range
                return c.lastName.charCodeAt(0) < alphaStart ||
                       c.lastName.charCodeAt(0) > alphaEnd;
            }) :
            contacts.filter(c => c.lastName.charCodeAt(0) === currentCharCode);
        
        var sectionTitle = isLastIteration ?
            "#" : // use a hash (#) for all non-ascii last names
            String.fromCharCode(currentCharCode);

        index.push({
            title : sectionTitle,

            // If the index reaches the end of the list, it will point back to the top of the list
            // Make sure that it never reaches the end. It should always point to the second last item at most
            index : rowCount >= contacts.length - 1 ? 
                contacts.length - 1 : 
                rowCount
        });

        if (sectionContacts.length) {
            // If there are contacts for this letter, add a new section
            currSection = Ti.UI.createTableViewSection({
                headerTitle : sectionTitle
            });
            sectionArr.push(currSection);
        }

        for(var j = 0; j < sectionContacts.length; j++) {
            var row = Ti.UI.createTableViewRow();
            var rowView = Ti.UI.createView({ height: '50dp' });
    
            // Child view for the full name
            var nameView = Ti.UI.createView({ left: '5dp', layout: 'horizontal' });
            nameView.add(Ti.UI.createLabel({
                text: sectionContacts[j].firstName,
                top: '25%',
                color: 'black',
                font: {
                    fontSize: Ti.Platform.osname === 'android' ? undefined : '12pt'
                }
            }));
            nameView.add(Ti.UI.createLabel({
                text: ' ' + sectionContacts[j].lastName,
                top: '25%',
                font: {
                    fontWeight: 'bold',
                    fontSize: Ti.Platform.osname === 'android' ? undefined : '12pt'
                },
                color: 'black'
            }));
    
            rowView.add(nameView);
            rowView.add(Ti.UI.createLabel({
                right: '5dp',
                text: FormatHelper.formatNumber(sectionContacts[j].steps),
                color: 'gray',
                font: {
                    fontSize: Ti.Platform.osname === 'android' ? undefined : '12pt'
                }
            }));
            row.add(rowView);
            currSection.add(row);

            rowCount++;
        }
    }

    $.membersView.tbMembers.setData(sectionArr);
    $.membersView.tbMembers.index = index;
}