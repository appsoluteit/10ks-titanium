function loadChart(chartOptions, customOptions) {	 
	var templateURL=WPATH('/html/webview.html');
	
	chartOptions = JSON.stringify(chartOptions);
	customOptions = JSON.stringify(customOptions);
	
	function onLoadTemplateUrl() {	
		$.chartWebView.evalJS('plotChart('+ chartOptions + ',' + customOptions + ')');		
		
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