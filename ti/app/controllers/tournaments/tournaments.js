/**
 * @file Tournaments Controller
 * @description The controller for the tournaments view, which simply allows the user to select between race timeouts or tournament timeouts.
 * @namespace Controllers.Tournaments
 */

var DateTimeHelper = require('helpers/DateTimeHelper');
var TournamentsProvider = require('classes/TournamentsProvider');
var tournamentsProvider = new TournamentsProvider();

var currentPage = 1;
var isLoading = true;

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Tournaments
 */
function btnBack_click() {
	if(!isLoading) {
		$.tournaments.close();
	}
}

/**
 * @description Event handler for `btnRefresh`. Calls `loadTournaments`.
 * @memberof Controllers.Tournaments
 */
function btnRefresh_click() {
	if(!isLoading) {
		loadTournaments();
	}
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
	isLoading = true;
	$.tournamentsView.tblTournaments.setData([]); // first, clear the table

	function onLoadTournamentsSuccess(results) {
		results.forEach(function(element) {
			var row = Ti.UI.createTableViewRow({
				color: 'black',
				height: Ti.UI.SIZE,

				// Custom attributes
				tournament: element
			});
			row.addEventListener('click', tblRow_click);

			var view = Ti.UI.createView({ 
				height: Ti.UI.SIZE
			});
			view.addEventListener('click', function(e) { }); //adding this event handler to the view seems to fix a bug where the event handler
															//for the row wouldn't fire
			
			var icon = Ti.UI.createImageView({ 
				left: '5dp', 
				width: '32dp',
				image: '/common/' + element.type + '_badge_small.png' 
			});

			var labelView = Ti.UI.createView({ 
				layout: 'vertical', 
				height: Ti.UI.SIZE,
				width: '75%',
			});

			var label = Ti.UI.createLabel({
				left: '10dp',
				top: '5dp',
				height: Ti.UI.SIZE,
				font: {
					fontWeight: 'bold'
				},
				text: element.tournamentName,
				color: 'black'
			});
			labelView.add(label);

			labelView.add(Ti.UI.createLabel({
				left: '10dp',
				text: DateTimeHelper.getDateLabel(new Date(element.tournamentStartDate), true),
				color: 'gray'
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

			view.add(icon);
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

		Ti.API.info('Done loading');
		Alloy.Globals.Spinner.hide();
	}

	function onLoadTournamentsFail(e) {
		if(e.detail === 'Invalid page.') {
			// There are no more tournaments to show. Do nothing.
		}
		else if(e.detail === 'Invalid token.') {
			setTimeout(function() {
				var win = Alloy.createController("auth/login").getView();
				win.open();
			
				win.addEventListener("close", function() {
					loadTournaments();
				});
			}, 2000);
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

		Alloy.Globals.Spinner.hide();
	}

	Alloy.Globals.Spinner.show('Loading tournaments...');
	tournamentsProvider.fetch(currentPage)
		.then(onLoadTournamentsSuccess, onLoadTournamentsFail)
		.done(function() {
			isLoading = false;
		});
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
				tournament: e.row.tournament
			})
			.getView()
			.open();
		}
		else if(e.row.tournament.type === 'timeout') {
			Alloy.createController('tournaments/timeouts', {
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