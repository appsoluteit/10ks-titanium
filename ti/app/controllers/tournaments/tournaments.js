/**
 * @file Tournaments Controller
 * @description The controller for the tournaments view, which simply allows the user to select between race timeouts or tournament timeouts.
 * @namespace Controllers.Tournaments
 */

var DateTimeHelper = require('helpers/DateTimeHelper');
var TournamentsProvider = require('classes/TournamentsProvider');
var tournamentsProvider = new TournamentsProvider();
var spinner = Alloy.createWidget('nl.fokkezb.loading');

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments
 */
function btnBack_click() {
	$.tournaments.close();
}

/**
 * @description Event handler for `btnRefresh`. Calls `loadTournaments`.
 * @memberof Controllers.Tournaments
 */
function btnRefresh_click() {
	loadTournaments();
}

/**
 * @description Event handler for the Window's open event. Adds event handlers for the races and timeout rows.
 * @memberof Controllers.Tournaments
 */
function window_open() {
	Alloy.Globals.tracker.addScreenView('Tournaments');
	loadTournaments();
}

/**
 * @description Calls `fetch` on `TournamentsProvider`. Adds a clickable row the table for each child in the response.
 * @memberof Controllers.Tournaments
 */
function loadTournaments() {
	Ti.API.info('Navigation window', $.tournaments);
	Ti.API.info('Window', $.tournaments.window);
	Ti.API.info('View', $.tournamentsView); // View <null> when referenced from the window.
	Ti.API.info('Table', $.tournamentsView.tblTournaments);

	// TODO: Support paging
	spinner.show('Fetching tournaments...');
	tournamentsProvider.fetch().then(function(results) {
		Ti.API.info('Fetching finished');

		results.forEach(function(element) {
			Ti.API.info('row: ' + element);

			var row = Ti.UI.createTableViewRow({
				color: 'black',
				height: '60dp'
			});

			var view = Ti.UI.createView({ });
			view.addEventListener('click', function(e) { }); //adding this event handler to the view seems to fix a bug where the event handler
															 //for the row wouldn't fire
			
			var labelView = Ti.UI.createView({ layout: 'vertical', left: '0px', width: '75%' })
			labelView.add(Ti.UI.createLabel({
				left: '10dp',
				top: '5dp',
				font: {
					fontWeight: 'bold'
				},
				text: element.tournamentName
			}));

			labelView.add(Ti.UI.createLabel({
				left: '10dp',
				top: '5dp',
				text: DateTimeHelper.getDateLabel(new Date(element.tournamentStartDate))
			}));

			var chevron = null;
			if(Ti.Platform.osname === "android") {
				//On Android, create an ImageView instead of a button
				chevron = Ti.UI.createImageView({
					right: "5dp",
					image: "/common/chevrons/right-16.png"
				});
			}
			else {
				chevron = Ti.UI.createButton({
					top: '10dp',
					right: "5dp",
					image: "/common/chevrons/right-16-g.png",
					tintColor: "gray",
					style: Ti.UI.iOS.SystemButtonStyle.PLAIN
				});
			}

			view.add(labelView);
			view.add(chevron);
			row.add(view);
			$.tournamentsView.tblTournaments.appendRow(row);
		});

		spinner.hide();
	});
}