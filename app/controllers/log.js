/*********************************** BUSINESS FUNCTIONS ***********************************/
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
		title: strLabel,
		color: 'black',
		height: '50dp',
		date: dateObj,
		isLoadMoreButton: isLoadMoreButton
	});
	row.addEventListener('click', tblRow_click);
	
	var view = Ti.UI.createView({
		//backgroundColor: 'blue'	
	});
	
	var label = Ti.UI.createLabel({
		textAlign: "right",
		right: "10dp",
		text: numSteps == undefined ? "" : numSteps,
		color: "red"
	});
	
	view.add(label);
	row.add(view);		//Adding the view to the TableViewRow causes its properties
						//to become inaccessible by the logEntry controller...need to fix.
						
	row.title = strLabel;
	row.date = dateObj;
	row.isLoadMoreButton = isLoadMoreButton;
	
	if(index == undefined)
		$.tblDays.appendRow(row, { animated: false });
	else
		$.tblDays.insertRowAfter(index, row, { animated: false});	
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


/*********************************** EVENT HANDLERS ***********************************/
function window_open() {
	var today = new Date();
	addDateRow("Today", today);
	
	var yesterday = getDayBefore(today);
	addDateRow("Yesterday", yesterday);
	
	//TODO: Load any existing data from local storage and display it in the table
	//TODO: Fix step log compatibility for Android. Possibly the animation argument to tableview methods?
	loadDatesFrom(getDayBefore(yesterday));	
}

function tblRow_click(e) {
	//Due to the child view in the TableViewRow, e.source doesn't
	//contain custom properties. Using e.row instead.
	if(e.row.isLoadMoreButton) {
		$.tblDays.deleteRow(e.row, { animated: false });
		loadDatesFrom(e.row.date);
	}
	else {
		var entryWin = Alloy.createController('logEntry', {
			title: e.row.title,
			date:  e.row.date,
			obj: e.row,
			callback: function(stepsLogged) {
				//Ti.API.info("Callback for: " + e.row.title);
				
				addDateRow(e.row.title, e.row.date, e.row.isLoadMoreButton, e.index, stepsLogged);
				$.tblDays.deleteRow(e.row, { animated: false });
			}
		}).getView();
		
		entryWin.open();
	}
}

function btnBack_click() {
	$.log.close();
}

function btnSync_click() {
	
}