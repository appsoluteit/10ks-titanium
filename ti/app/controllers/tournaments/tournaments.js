/**
 * @file Tournaments Controller
 * @description The controller for the tournaments view, which simply allows the user to select between race timeouts or tournament timeouts.
 * @namespace Controllers.Tournaments
 */

var DateTimeHelper = require('helpers/DateTimeHelper');
var TournamentsProvider = require('classes/TournamentsProvider');
var tournamentsProvider = new TournamentsProvider();
var spinner = Alloy.createWidget('nl.fokkezb.loading');
var currentPage = 1;

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
	function onLoadTournamentsSuccess(results) {
		results.forEach(function(element) {
			var row = Ti.UI.createTableViewRow({
				color: 'black',
				height: '60dp',

				// Custom attributes
				tournament: element
			});
			row.addEventListener('click', tblRow_click);

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

		// If any of the tournaments indicate that they have a next page, show a 'load more' button.
		if(results.filter(function(r) { return r.hasNextPage; }).length) {
			// Add one more row for the load more button. This gets removed when clicked.
			var row = Ti.UI.createTableViewRow({
				color: 'black',
				height: '60dp',
				title: 'Load More',

				// Custom attributes
				isLoadMoreButton: true
			});
			row.addEventListener('click', tblRow_click);
			$.tournamentsView.tblTournaments.appendRow(row);
		}

		spinner.hide();
	}

	function onLoadTournamentsFail(e) {
		if(e.detail === 'Invalid page.') {
			// There are no more tournaments to show. Do nothing.
		}
		else if(e.detail) {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text : e.detail,
				duration : 2000,
				view : $.tournaments,
				theme : "error"
			});
		}
		else {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text : "Unable to get tournaments.",
				duration : 2000,
				view : $.tournaments,
				theme : "error"
			});
		}

		spinner.hide();
	}

	spinner.show('Fetching tournaments...');
	tournamentsProvider.fetch(currentPage)
		.then(onLoadTournamentsSuccess, onLoadTournamentsFail);
}

function tblRow_click(e) {
	if(e.row.isLoadMoreButton) {
		$.tournamentsView.tblTournaments.deleteRow(e.row);
		currentPage++;
		loadTournaments();
	}
	else {
		if(e.row.tournament.type === 'race') {
			Alloy.createController('tournaments/races', {
				title: e.row.label,
				tournament: e.row.tournament
			})
			.getView()
			.open();
		}
		else if(e.row.tournament.type === 'timeout') {
			Alloy.createController('tournaments/timeouts', {
				title: e.row.label,
				tournament: e.row.tournament
			})
			.getView()
			.open();
		}
		else {
			Ti.API.error('Unrecognised tournament type: ' + e.row.tournament.type);
			Alloy.createWidget("com.mcongrove.toast", null, {
				text : "Unknown tournament found",
				duration : 2000,
				view : $.tournaments,
				theme : "error"
			});
		}
	}
}