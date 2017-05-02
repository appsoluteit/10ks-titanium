var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');
var StepsProvider = require('classes/StepsProvider');

var stepsProvider = new StepsProvider($.log);
var logCollection = Alloy.createCollection('log');
logCollection.fetch();

/*********************************** LOGIC ***********************************/
/**
 * Adds a row to the dates table
 * @param {String} strLabel The label to add
 * @param {Date} dateObj The date that this record represents.
 * @param {Boolean} isLoadMoreButton A boolean to indicate whether this is the 'Load More' button
 * @param {Integer} index (Optional) The index to add the new row at. If omitted, it will be appended to the end.
 * @param {String} numSteps (Optional) The text to add to the right of the row, in red
 */
function addDateRow(strLabel, dateObj, isLoadMoreButton, index, numSteps) {		
	//Add a new row to the table view	
	var row = Ti.UI.createTableViewRow({
		//title: strLabel,
		color: 'black',
		height: '50dp',
		
		//custom attributes
		label: strLabel,
		date: dateObj,
		isLoadMoreButton: isLoadMoreButton
	});
	row.addEventListener('click', tblRow_click);
	
	var view = Ti.UI.createView({
		//backgroundColor: 'blue'	
	});
	
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
	
	var dateString = FormatHelper.formatDate(dateObj);
	
	//findWhere seems to be unsupported??
	var item = logCollection.where({
		'steps_date': dateString
	});
	
	if(item.length > 0) {
		numSteps = item[0].get('steps_total');
	}
	
	var labelRight = Ti.UI.createLabel({
		right: "10dp",
		textAlign: "right",
		color: "red",
		text: numSteps > 0 ? FormatHelper.formatNumber(numSteps) : "",
		width: Ti.UI.SIZE
	});
	
	view.add(labelLeft);
	view.add(labelRight);
	row.add(view);		//Adding the view to the TableViewRow causes its properties
						//to become inaccessible by the logEntry controller...need to fix.
	
	if(index == undefined) {
		$.tblDays.appendRow(row);
	}
	else {
		$.tblDays.insertRowAfter(index, row);	
	}
}

/**
 * Adds 30 days to tblDays (the dates table) starting from dateObj, then adds another row that says 'Load More'
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

/*********************************** EVENT HANDLERS ***********************************/
function window_open() {
	var today = new Date();
	addDateRow("Today", today);
	
	var yesterday = DateTimeHelper.getDayBefore(today);
	addDateRow("Yesterday", yesterday);
	
	loadDatesFrom(DateTimeHelper.getDayBefore(yesterday));	
}

function tblRow_click(e) {
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
				//Ti.API.info("Callback for: " + e.row.title);
				
				addDateRow(e.row.label, e.row.date, e.row.isLoadMoreButton, e.index, stepsLogged);
				$.tblDays.deleteRow(e.row);
			}
		}).getView();
		
		entryWin.open();
	}
}

function btnBack_click() {
	$.log.close();
}

function btnSync_click() {
	stepsProvider.getSteps()
			     .then(function success(steps) {
			     	//TODO: write steps to local storage
			     	
			     	return stepsProvider.postSteps();
			     }, function fail(reason) {
					Alloy.createWidget('com.mcongrove.toast', null, {
						text: 'Failed to get steps. Reason: ' + reason,
						duration: 2000,
						view: $.log,
						theme: 'error'
					});
			     })
			     .then(function success() {
					Alloy.createWidget('com.mcongrove.toast', null, {
						text: 'Steps synced successfully!',
						duration: 2000,
						view: $.log,
						theme: 'success'
					});
			     }, function fail(reason) {
					Alloy.createWidget('com.mcongrove.toast', null, {
						text: 'Failed to post steps. Reason: ' + reason,
						duration: 2000,
						view: $.log,
						theme: 'error'
					});			     	
			     });
}