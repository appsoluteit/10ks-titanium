function loadChart(options){ // data argument must be properly designed so it can work in different situations
	var templateURL=WPATH('/html/webview.html');
	var optionsJSON = JSON.stringify(options);
	
	console.log("Widget loading chart. Options = ", optionsJSON);
	
	$.chartWebView.url=templateURL;
	$.chartWebView.addEventListener('load', function() {
		Ti.API.info('chartWebView ready');
		$.chartWebView.evalJS('plotChart('+ optionsJSON + ')');	 
	});
}

exports.loadChart=loadChart;