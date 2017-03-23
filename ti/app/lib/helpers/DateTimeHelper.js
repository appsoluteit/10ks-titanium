/**
 * Returns a month name from January - December based on the provided index.
 * @param {Integer} index A number 0-11 that indicates the month.
 * @returns {String}
 */
function getMonthNameFromIndex(index) {
	var monthNames = [
		"January", 
		"February", 
		"March", 
		"April", 
		"May", 
		"June", 
		"July", 
		"August", 
		"September", 
		"October", 
		"November", 
		"December"
	];

	return monthNames[index];
}

/**
 * Returns the name of the current month.
 */
function getCurrentMonthName() {
	var m = new Date().getMonth();
	return getMonthNameFromIndex(m);
}

module.exports.getMonthNameFromIndex = getMonthNameFromIndex;
module.exports.getCurrentMonthName = getCurrentMonthName;