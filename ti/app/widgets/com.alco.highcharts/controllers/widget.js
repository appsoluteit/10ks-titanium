
/*
	on iOS, showing a native spinner will cause an orientation change, which reloads the graph, which 
	reshows the spinner, which causes an orientation change - infinite loop. Luckily on iOS, the 
	webview spinner works quite well.

	on Android, the webview spinner either appears too high or not at all. So show the native spinner
	on Android only.
*/

Ti.App.addEventListener('app:fromWebView', function(e) {
	Ti.API.info('fromWebView');
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
		Ti.API.info('loading template 2');
		
		// DEBUG: Turn this off and let the chart show the static data
		var js = 'plotChart('+ chartOptions + ',' + customOptions + ')';
		Ti.API.info(js);

		// the empty callback is now required
		// https://jira.appcelerator.org/browse/TIMOB-26709
		// https://jira.appcelerator.org/browse/TIMOB-25862
		
		$.chartWebView.evalJS(js, function(err, result) {});		
		
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

$.chartWebView.loadChart = loadChart;
$.chartWebView.showMessage = showMessage;