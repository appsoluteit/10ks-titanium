/**
 * @file FormatHelper
 * @description Provides static helper methods for common formatting operations.
 * @module
 */

/**
 * Accepts a Date object and returns a formatted string in y-m-d. Used for storing dates consistently internally.
 */
function formatDate(dateObj) {
	var y = dateObj.getFullYear();
	var m = dateObj.getMonth() + 1;
	var d = dateObj.getDate();

	if (m < 10)
		m = "0" + m;

	if (d < 10)
		d = "0" + d;

	return y + "-" + m + "-" + d;
}

/**
 * Accepts a Date object and returns a formatted string in H:m. Includes am/pm postfix.
 */
function formatTime(dateObj) {
	var h = dateObj.getHours();
	var m = dateObj.getMinutes();
	var postfix = h < 12 ? "am" : "pm";

	if (h > 12)
		h -= 12;

	if (m < 10)
		m = "0" + m;

	return h + ":" + m + postfix;
}

/**
 * Accepts an H:m am/pm string and returns a JS Date object.
 */
function unformatTime(dateStr) {
	var timeparts = dateStr.split(":");

	var h = parseInt(timeparts[0], 10);
	var m = parseInt(timeparts[1].substr(0, 2), 10);
	var postfix = timeparts[1].substr(2, 2);
	//get the am/pm postfix

	if (postfix === "pm") {
		h += 12;
	}

	var d = new Date();
	d.setHours(h, m);

	return d;
}

/**
 * Accepts a double and returns a string in 123,45 format.
 */
function formatNumber(input) {
	//More reliable than String.formatDecimal, which isn't documented in many places.
	return input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

module.exports.formatDate = formatDate;
module.exports.formatTime = formatTime;
module.exports.unformatTime = unformatTime;
module.exports.formatNumber = formatNumber;