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
	if(options.message)
		Alloy.Globals.Loading.show(options.message, false);
	else
		Alloy.Globals.Loading.show("Loading...", false);
		
	//Ti.API.info("Sending: ", options.data);
	
	var req = Ti.Network.createHTTPClient();
	req.onload = function() {
		try {
			Ti.API.info("API ready state changed: " + this.readyState);
			
			if(this.readyState == 4) {
				Ti.API.info("Status: " + this.status);
				
				if(this.status == 200 || this.status == 201) {
					Ti.API.info("API success response: " + this.responseText);
					Alloy.Globals.Loading.hide();
					
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
		Ti.API.error('API Request error. ' + JSON.stringify(e));
		Ti.API.error('Response object: ' + this.responseText);
		
		Alloy.Globals.Loading.hide();
		
		if(typeof(options.fail) === "function") {
			options.fail(makeResponse(this.responseText));
		}
		else {
			Ti.API.warn("No fail handler defined for API call. Is this intended?");
		}
	};
	
	req.open(options.method, options.url);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	if(options.headers) {
		options.headers.forEach(function(ele) {
			req.setRequestHeader(ele.key, ele.value);
		});
	}
	
	req.send(options.data);
}
	
function get(options) {
	options.method = "GET";
	return send(options);
}

function post(options) {
	options.method = "POST";
	return send(options);
}

module.exports.get = get;
module.exports.post = post;