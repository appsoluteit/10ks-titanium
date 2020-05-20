// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel();
win.add(label);
win.open();


var healthkit = require('ti.healthkit');
Ti.API.info("module is => " + healthkit);

healthkit.authoriseHealthKit(function(response) {
	Ti.API.info('healthkit authoriseHealthKit got response!');
	Ti.API.info(response);
	Ti.API.info('message: ' + response.message);

	var from = new Date(0); // 01/01/1970
	var to = new Date(); // today

	healthkit.querySteps(from, to, function(response) {
		Ti.API.info('healthkit query steps got response!');
		Ti.API.info(response);
	});
});
