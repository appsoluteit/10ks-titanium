// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function makeDateLabel(dateObj) {
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

function window_open() {
	//Show one month's worth of history in the table, with an optional 'Load More' button
	var d = new Date();
	var today = d.getDate();
	
	//TODO: This doesnt work when going past the current month. Either make a smarter algorithm
	//		or possible use a module like Moment.js
	for(var i = today; i >= today - 30; i--) {
		d.setDate(i);
		
		var labelStr = "";
		
		if(i == today) 
			labelStr = "Today";
		else if(i == today - 1)
			labelStr = "Yesterday";
		else
			labelStr = makeDateLabel(d);
		
		//Add a new row to the table view	
		var row = Ti.UI.createTableViewRow({
			rowIndex: i,
			title: labelStr,
			color: 'black',
			height: '50dp'
		});
		row.addEventListener('click', tblRow_click);
		
		$.tblDays.appendRow(row);
	}	
}

function tblRow_click(e) {
	alert(e.source.title);
}

function btnBack_click() {
	$.log.close();
}

function btnSync_click() {
	
}