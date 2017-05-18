/**
 * @file APIHelper
 * @description Provides static helper functions for interacting with the 10000steps REST API.
 * @require widgets/nl.fokkezb.loading
 * @exports post
 * @exports get
 * @example 
 * 
 * APIHelper.post({
 * 		message: 'Hello, World',			//This will show next to the spinner or 'Loading...' will be shown if not provided
 * 		success: function(response) { },
 * 		fail: function(response) { },
 * 		url: '/steps/,
 * 		headers: [
 * 			{ key: 'something', value: 'somethingElse' }
 * 		]
 * });
 */

var spinner = Alloy.createWidget("nl.fokkezb.loading");

function makeResponse(responseText) {
	var response = {};
	
	try {
		response = JSON.parse(responseText);
	}		
	catch(e) {
		response.errorMessage = responseText;
	}
	
	return response;
}

function send(options) {
	if(options.message) {
		spinner.show(options.message, false);
	}
	else {
		spinner.show("Loading...", false);
	}
	
	var req = Ti.Network.createHTTPClient();
	req.onload = function() {
		try {
			Ti.API.debug("API ready state changed: " + this.readyState);
			
			if(this.readyState == 4) {
				Ti.API.debug("Status: " + this.status);
				
				if(this.status == 200 || this.status == 201) {
					Ti.API.debug("API success response: " + this.responseText);
					spinner.hide();
					
					if(typeof(options.success === "function")) {
						options.success(makeResponse(this.responseText));
					}
					else {
						Ti.API.warn("No success handler defined for API call. Is this intended?");
					}
				}
			}
		}
		catch(err) {
			Ti.API.error('API Caught error: ' + err);
		}
	};
	
	req.onerror = function(e) {
		Ti.API.debug('API Request error. ' + JSON.stringify(e));
		Ti.API.debug('Response object: ' + this.responseText);
		
		spinner.hide();
		
		if(typeof(options.fail) === "function") {
			options.fail(makeResponse(this.responseText));
		}
		else {
			Ti.API.warn("No fail handler defined for API call. Is this intended?");
		}
	};
	
	req.open(options.method, Alloy.Globals.BaseURL + options.url);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	if(options.headers) {
		options.headers.forEach(function(ele) {
			req.setRequestHeader(ele.key, ele.value);
		});
	}
	
	req.send(options.data);
}

/**
 * Initiates a GET request via the 10000steps REST API.
 * @param {Object} options A config object for the request
 */
function get(options) {
	options.method = "GET";
	return send(options);
}

/**
 * Initiates a POST request via the 10000steps REST API
 * @param {Object} options A config object for the request
 */
function post(options) {
	options.method = "POST";
	return send(options);
}

module.exports.post = post;
module.exports.get = get;