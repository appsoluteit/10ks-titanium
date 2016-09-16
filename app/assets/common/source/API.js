function API() {
	this.get = function(url, data, onSuccess, onFail) {
		return this.send("GET", url, data, onSuccess, onFail);
	};
	
	this.post = function(url, data, onSuccess, onFail) {
		return this.send("POST", url, data, onSuccess, onFail);
	};
	
	this.send = function(method, url, data, onSuccess, onFail) {
		var req = Ti.Network.createHTTPClient();
		req.onload = function() {
			try {
				Ti.API.info("API ready state changed: " + this.readyState);
				
				if(this.readyState === 4) {
					if(this.status === 200) {
						Ti.API.info("API success response: " + this.responseText);
						onSuccess();
					}
				}
			}
			catch(err) {
				Ti.API.error('API Caught error: ' + err);
			}
		};
		
		req.onerror = function(e) {
			Ti.API.error('API Request error. Code: ' + e.code + ', error: ' + e.error);
			onFail(e);
		};
		
		req.open(method, url);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(data);
	};
}

module.exports = API;
