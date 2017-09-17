function loadChart(options) {
	Ti.API.info("widget loadChart called");
	 
	var templateURL=WPATH('/html/webview.html');
	var optionsJSON = JSON.stringify(options);
	
	function onLoadTemplateUrl() {	
		$.chartWebView.evalJS('plotChart('+ optionsJSON + ')');		
		
		//Remove any previously added event listeners to prevent them from stacking
		$.chartWebView.removeEventListener('load', onLoadTemplateUrl);	
	}
	
	$.chartWebView.setUrl(templateURL);
	$.chartWebView.addEventListener('load', onLoadTemplateUrl);
}

function showMessage(message) {
	$.chartWebView.html = "<p style='text-align: center; font-weight: bold; font-family: \"Arial\", Arial;'>" + message + "</p>";
}

exports.loadChart = loadChart;
exports.showMessage = showMessage;