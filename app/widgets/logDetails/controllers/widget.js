function txtStepsWalked_change() {
	calculateTotal();
}

function txtModerateMins_change() {
	calculateTotal();
}

function txtVigorousMins_change() {
	calculateTotal();
}


function calculateTotal() {
	//total = steps walked + (moderate x 100) + (vigorous x 200)
	var stepsWalked = $.txtStepsWalked.value;
	var moderateMins = $.txtModerateMins.value;
	var vigorousMins = $.txtVigorousMins.value;
	
	if(stepsWalked == '')
		stepsWalked = 0;
	else
		stepsWalked = parseInt(stepsWalked, 10);
		
	if(moderateMins == '')
		moderateMins = 0;
	else
		moderateMins = parseInt(moderateMins, 10);
		
	if(vigorousMins == '')
		vigorousMins = 0;
	else
		vigorousMins = parseInt(vigorousMins, 10);
	
	var total = stepsWalked + (moderateMins * 100) + (vigorousMins * 200);
	
	$.lblDailyTotal.total = total;	//store the total in a custom attribute
	$.lblDailyTotal.text = String.formatDecimal(total, 'en-US', '##,##0');
}