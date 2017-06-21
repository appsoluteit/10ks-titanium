/**
 * @file Steps Controller
 * @description The controller for the steps view.
 * @require helpers/FormatHelper
 * @require helpers/DateTimeHelper
 * @require classes/StepsProvider
 * @require classes/StepsDataProvider
 * @require widgets/com.mcongrove.toast
 * @namespace Controllers.Steps
 */

var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');
var StepsProvider = require('classes/StepsProvider');
var StepsDataProvider = require('classes/StepsDataProvider');

var stepsDataProvider;	//Initialised on window load

/**
 * @description Adds a row to the dates table
 * @memberof Controllers.Steps
 * @param {String} strLabel The label to add
 * @param {Date} dateObj The date that this record represents.
 * @param {Boolean} isLoadMoreButton A boolean to indicate whether this is the 'Load More' button
 * @param {Integer} index (Optional) The index to add the new row at. If omitted, it will be appended to the end.
 * @param {String} numSteps (Optional) The text to add to the right of the row, in red
 */
function addDateRow(strLabel, dateObj, isLoadMoreButton, index, numSteps) {			
	//Add a new row to the table view	
	var row = Ti.UI.createTableViewRow({
		color: 'black',
		height: '50dp',
		
		//custom attributes
		label: strLabel,
		date: dateObj,
		isLoadMoreButton: isLoadMoreButton
	});
	row.addEventListener('click', tblRow_click);
	
	var view = Ti.UI.createView({});
	view.addEventListener('click', function(e) { }); //adding this event handler to the view seems to fix a bug where the event handler
													 //for the row wouldn't fire
	
	var labelLeft = Ti.UI.createLabel({
		left: '10dp',
		textAlign: 'left',
		color: 'black',
		font: {
			fontWeight: 'bold'
		},
		text: strLabel,
		width: Ti.UI.SIZE
	});
	view.add(labelLeft);
	
	//Don't add the # of steps if its a 'Load More' button
	if(!isLoadMoreButton) {
		if(numSteps === undefined) {		
			var item = stepsDataProvider.readSingle(dateObj);
			
			if(item) {
				numSteps = item.stepsTotal;
			}	
		}
		
		var numStepsStr = numSteps > 0 ? FormatHelper.formatNumber(numSteps) : "";
		
		var labelRight = Ti.UI.createLabel({
			right: "10dp",
			textAlign: "right",
			color: "red",
			text: numStepsStr,
			width: Ti.UI.SIZE
		});
		
		view.add(labelRight);		
	}

	row.add(view);		//Adding the view to the TableViewRow causes its properties
						//to become inaccessible by the logEntry controller...need to fix.
	
	if(index === undefined) {
		//Ti.API.info("Appending row");
		$.tblDays.appendRow(row);
	}
	else {
		//Ti.API.info("Inserting row. Index = " + index);
		$.tblDays.insertRowAfter(index, row);	
	}
}

/**
 * @description Adds 30 days to tblDays (the dates table) starting from dateObj, then adds another row that says 'Load More'
 * @memberof Controllers.Steps
 * @param {Date} dateObj The date to start from
 */
function loadDatesFrom(dateObj) {
	var start = dateObj.getDate();
	
	for(var i = start; i >= start - 30; i--) {
		var labelStr = DateTimeHelper.getDateLabel(dateObj);
		addDateRow(labelStr, dateObj, false);
		
		dateObj = DateTimeHelper.getDayBefore(dateObj);
	}
	
	addDateRow("Load More", dateObj, true);
}

/**
 * @description Interacts with the `StepsProvider`. Calls `getSteps()`, then `postSteps()`. 
 * @memberof Controllers.Steps
 */
function sync() {
	var spinner = Alloy.createWidget('nl.fokkezb.loading');
	spinner.show("Syncing...");
	
	try {
		var stepsProvider = new StepsProvider();
		stepsProvider.sync($.log, function() {
			$.tblDays.setData([]);
			populateRows();
			
			spinner.hide();
		});	
	}
	catch(e) {
		if(e === "InvalidToken") {
			setTimeout(function() {
				var win = Alloy.createController("auth/login").getView();
				win.open();
				
				win.addEventListener("close", function() {
					sync();
				});
			}, 2000);
			
			spinner.hide();
		}
	}
}

/**
 * @description Calls `addDateRow` for today and yesterday, then calls `loadDatesFrom` from the date before yesterday.
 * @memberof Controllers.Steps
 */
function populateRows() {
	//Initialise here to refresh the collection
	stepsDataProvider = new StepsDataProvider();
	
	var today = new Date();
	addDateRow("Today", today);
	
	var yesterday = DateTimeHelper.getDayBefore(today);
	addDateRow("Yesterday", yesterday);
	
	loadDatesFrom(DateTimeHelper.getDayBefore(yesterday));
}

/**
 * @description Event handler for the Window's `open` event. Calls 'populateRows'.
 * @memberof Controllers.Steps
 */
function window_open() {
	Alloy.Globals.tracker.trackScreen({
		screenName: "Steps"
	});
	
	populateRows();
}

/**
 * @description Event handler for `tblRow`. If e is a 'Load More' button, it gets deleted and another month of dates are loaded. Otherwise, the form controller is shown.
 * @listens click
 * @param {Object} e The event source
 * @memberof Controllers.Steps
 */
function tblRow_click(e) {
	Ti.API.info("Row clicked.", e);
	
	//Due to the child view in the TableViewRow, e.source doesn't
	//contain custom properties. Using e.row instead.
	if(e.row.isLoadMoreButton) {
		$.tblDays.deleteRow(e.row);
		loadDatesFrom(e.row.date);
	}
	else {
		var entryWin = Alloy.createController('steps/form', {
			title: e.row.label,
			date:  e.row.date,
			obj: e.row,
			callback: function(stepsLogged) {
				if(stepsLogged > 0) {
					addDateRow(e.row.label, e.row.date, false, e.index, stepsLogged);
					
					Ti.API.info("Deleting row:", e.row);
					$.tblDays.deleteRow(e.index);	//Note: on iOS, it was observed that this line would randomly cause a crash when passing the Ti.UI.TableViewRow.
													//pass an index instead.	
				}
			}
		}).getView();
		
		entryWin.open();
	}
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Steps
 */
function btnBack_click() {
	$.log.close();
}

/**
 * @description Event handler for `btnSync`. Calls `sync`.
 * @memberof Controllers.Steps
 */
function btnSync_click() {
	sync();
}