var FormatHelper = require("helpers/FormatHelper");
var APIHelper = require("helpers/APIHelper");

var logCollection = Alloy.createCollection('log');
logCollection.fetch();

/*********************************** BUSINESS FUNCTIONS ***********************************/
//TODO: Move these to DateHelper

/**
 * Computes and returns a label that represents the given date. Eg: Mon Feb 24.
 * @param {Date} dateObj A date object for the date to process
 * @returns {String} The date label
 */
function getDateLabel(dateObj) {
	var dayNames = [
		"Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"
	];
	
	var monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];	
	
	var days = dateObj.getDate();
	var str = dayNames[dateObj.getDay()] + " " + 
			  monthNames[dateObj.getMonth()] + " " + 
			  (days < 10? "0" + days : days);
			  
	return str;
}

/**
 * Gets a Date Object for the day before dateObj
 * @param {Date} dateObj The input date
 * @returns {Date} A date object set 1 day before dateObj
 */
function getDayBefore(dateObj) {
	return new Date(dateObj.getTime() - (24*60*60*1000));
}

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
	
	if(index == undefined)
		$.tblDays.appendRow(row);
	else
		$.tblDays.insertRowAfter(index, row);	
}

/**
 * Adds 30 days to tblDays (the dates table) starting from dateObj, then adds another row that says 'Load More'
 * @param {Date} dateObj The date to start from
 */
function loadDatesFrom(dateObj) {
	var start = dateObj.getDate();
	
	for(var i = start; i >= start - 30; i--) {
		var labelStr = getDateLabel(dateObj);
		addDateRow(labelStr, dateObj, false);
		
		dateObj = getDayBefore(dateObj);
	}
	
	addDateRow("Load More", dateObj, true);
}

/**
 * Loads steps for the current user from the server and adds them to local storage, if they don't exist.
 */
function getSteps() {
	function onSuccess(e) {
		Ti.API.info("Get steps success", JSON.stringify(e));
	}
	
	function onFail(e) {
		Alloy.createWidget("com.mcongrove.toast", null, {
			text: "Failed to get steps",
			duration: 2000,
			view: $.log,
			theme: "error"
		});
	}
	
	var data = {
		Authorization: "Token " + Alloy.Globals.AuthKey
	};
	
	APIHelper.get({
		message:	"Fetching steps...",
		url:		"steps/",
		headers: [{
				 	key: "Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		success: 	onSuccess,
		fail: 		onFail
	});
}

/**
 * Pushes unsynced steps from local storage to the server.
 */
function postSteps() {
	function onSuccess(e) {
		Ti.API.info("Post steps success", JSON.stringify(e));
	}
	
	function onFail(e) {
		Ti.API.info("Post steps fail", JSON.stringify(e));
	}
	
	//TODO: Make these real
	var data = {
		user: Alloy.Globals.UserURL,
		steps_date: "2016-10-12",
		steps_total: "9999",
		steps_walked: "9999",
		moderate: "9999",
		vigorous: "9999",
		activity_part: "9999"
	};
	
	Ti.API.info("Posting", data);
	
	APIHelper.post({
		message:	"Sending steps...",
		url: 		"steps/",
		headers: [{
			key: 	"Authorization", value: "Token " + Alloy.Globals.AuthKey
		}],
		
		data: 		data,
		success: 	onSuccess,
		fail: 		onFail
	});
}

/*********************************** EVENT HANDLERS ***********************************/
function window_open() {
	var today = new Date();
	addDateRow("Today", today);
	
	var yesterday = getDayBefore(today);
	addDateRow("Yesterday", yesterday);
	
	loadDatesFrom(getDayBefore(yesterday));	
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
	
	//TODO: have getSteps return a promise. Then call postSteps.
	//getSteps();
	
	postSteps();
}