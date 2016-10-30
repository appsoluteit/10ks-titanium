/**
 * The toast notification widget
 * 
 * @class Widgets.com.mcongrove.toast
 */

/**
 * @member Widgets.com.mcongrove.toast
 * @property {Object} CONFIG
 * @property {String} CONFIG.text The text to display in the toast
 * @property {Number} CONFIG.duration The length of time (ms) to display the toast
 * @property {Function} CONFIG.view The view to attach the toast to
 */
var CONFIG = arguments[0] || {};

if(CONFIG.text) {
	if(OS_IOS) {
		$.textLabel.text = CONFIG.text;
		setStyle($.Modal);
		
		open();
		
		setTimeout(function() {
			close();
		}, CONFIG.duration ? (CONFIG.duration + 250) : 3000);
	} else if(OS_ANDROID) {
		var toast = Ti.UI.createNotification({
			message: CONFIG.text,
			duration: CONFIG.duration < 2000 ? Ti.UI.NOTIFICATION_DURATION_SHORT : Ti.UI.NOTIFICATION_DURATION_LONG
		});
		
		setStyle(toast);
		
		toast.show();
	}
}

/**
 * Opens the toast notification
 * @private
 */
function open() {
	console.log(CONFIG.view.id);
	
	CONFIG.view.add($.Wrapper);
	
	$.Modal.animate({
		top: "20dp",
		duration: 250
	});
};

/**
 * Closes the toast notification
 * @private
 */
function close() {
	$.Modal.animate({
		top: "70dp",
		duration: 250
	}, function(_event) {
		if(typeof CONFIG.close !== "undefined") {
			CONFIG.view.remove($.Wrapper);
		}
	});
};

/**
 * Sets the styles
 * @private
 */
function setStyle(base) {
	switch(CONFIG.theme) {
		case 'success':
			base.backgroundColor = "rgb(189, 244, 203)";
			base.borderColor = "rgb(74, 227, 113)";
			base.color = "black";
			
			if(Ti.Platform.osname !== "android")
				$.textLabel.color = "black";
			
			break;
			
		case 'error': 
			base.backgroundColor = "rgb(255, 187, 187)";
			base.borderColor = "rgb(255, 151, 151)";
			
			if(Ti.Platform.osname !== "android")
				$.textLabel.color = "black";
				
			break;
	}
}
