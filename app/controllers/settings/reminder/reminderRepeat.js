// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function window_open() {
	$.reminderRepeatView.tblRowSunday.addEventListener('click', tblRow_click);
	$.reminderRepeatView.tblRowMonday.addEventListener('click', tblRow_click);
	$.reminderRepeatView.tblRowTuesday.addEventListener('click', tblRow_click);
	$.reminderRepeatView.tblRowWednesday.addEventListener('click', tblRow_click);
	$.reminderRepeatView.tblRowThursday.addEventListener('click', tblRow_click);
	$.reminderRepeatView.tblRowFriday.addEventListener('click', tblRow_click);
	$.reminderRepeatView.tblRowSaturday.addEventListener('click', tblRow_click);
	
	//Preset the switches if there is existing data
	if(Ti.App.Properties.hasProperty("ReminderRepeat")) {
		var strReminderRepeat = Ti.App.Properties.getString("ReminderRepeat");
		var objReminderRepeat = JSON.parse(strReminderRepeat);
	
		var activeDays = objReminderRepeat.filter(function(e) { return e.active; });
		for(var i = 0; i < activeDays.length; i++) {
			switch(activeDays[i].name) {
				case 'Sunday':
					$.reminderRepeatView.swSunday.value = true;
					break;
					
				case 'Monday':
					$.reminderRepeatView.swMonday.value = true;
					break;
					
				case 'Tuesday':
					$.reminderRepeatView.swTuesday.value = true;
					break;
					
				case 'Wednesday':
					$.reminderRepeatView.swWednesday.value = true;
					break;
					
				case 'Thursday':
					$.reminderRepeatView.swThursday.value = true;
					break;
					
				case 'Friday':
					$.reminderRepeatView.swFriday.value = true;
					break;
					
				case 'Saturday':
					$.reminderRepeatView.swSaturday.value = true;
					break;	
			}
		}
	}
}

function tblRow_click(e) {
	//Ti.API.info(JSON.stringify(e));
	
	switch(e.row.id) {
		case 'tblRowSunday':
			$.reminderRepeatView.swSunday.value = !$.reminderRepeatView.swSunday.value;
			break;
			
		case 'tblRowMonday':
			$.reminderRepeatView.swMonday.value = !$.reminderRepeatView.swMonday.value;
			break;
			
		case 'tblRowTuesday':
			$.reminderRepeatView.swTuesday.value = !$.reminderRepeatView.swTuesday.value;
			break;
			
		case 'tblRowWednesday':
			$.reminderRepeatView.swWednesday.value = !$.reminderRepeatView.swWednesday.value;
			break;
			
		case 'tblRowThursday':
			$.reminderRepeatView.swThursday.value = !$.reminderRepeatView.swThursday.value;
			break;
			
		case 'tblRowFriday':
			$.reminderRepeatView.swFriday.value = !$.reminderRepeatView.swFriday.value;
			break;
			
		case 'tblRowSaturday':
			$.reminderRepeatView.swSaturday.value = !$.reminderRepeatView.swSaturday.value;
			break;
	}
}

function btnBack_click() {
	var obj = [
		{ name: 'Sunday', active: $.reminderRepeatView.swSunday.value },
		{ name: 'Monday', active: $.reminderRepeatView.swMonday.value },
		{ name: 'Tuesday', active: $.reminderRepeatView.swTuesday.value },
		{ name: 'Wednesday', active: $.reminderRepeatView.swWednesday.value },
		{ name: 'Thursday', active: $.reminderRepeatView.swThursday.value },
		{ name: 'Friday', active: $.reminderRepeatView.swFriday.value },
		{ name: 'Saturday', active: $.reminderRepeatView.swSaturday.value }
	];
		
	Ti.App.Properties.setString("ReminderRepeat", JSON.stringify(obj));
	args.callback(obj);
	
	$.reminderRepeat.close();
}
