
/*
	on iOS, showing a native spinner will cause an orientation change, which reloads the graph, which 
	reshows the spinner, which causes an orientation change - infinite loop. Luckily on iOS, the 
	webview spinner works quite well.

	on Android, the webview spinner either appears too high or not at all. So show the native spinner
	on Android only.
*/

Ti.App.addEventListener('app:fromWebView', function(e) {
    Alloy.Globals.Spinner.hide();
});

function loadChart(chartOptions, customOptions) {	
	if(Ti.Platform.osname === 'android') {
		Alloy.Globals.Spinner.show("Loading...");
	}

	setTimeout(function() {
		Alloy.Globals.Spinner.hide();
	}, 5000);

	var templateURL=WPATH('/html/webview.html');
	
	chartOptions = JSON.stringify(chartOptions);
	customOptions = JSON.stringify(customOptions);
	
	function onLoadTemplateUrl() {	
		Ti.API.info('loading template');
		
		// DEBUG: Turn this off and let the chart show the static data
		$.chartWebView.evalJS('plotChart('+ chartOptions + ',' + customOptions + ')');		
		
		//Remove any previously added event listeners to prevent them from stacking
		$.chartWebView.removeEventListener('load', onLoadTemplateUrl);	
	}
	
	$.chartWebView.addEventListener('load', onLoadTemplateUrl);
	$.chartWebView.setUrl(templateURL);
}

function showMessage(message) {
	$.chartWebView.html = "<p style='text-align: center; font-weight: bold; font-family: \"Arial\", Arial;'>" + message + "</p>";
}

exports.loadChart = loadChart;
exports.showMessage = showMessage;