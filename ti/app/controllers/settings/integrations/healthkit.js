/**
 * @file HealthKit Controller
 * @description The controller for the healthkit view.
 * @namespace Controllers.Settings.Integrations.HealthKit
 */

var healthkit = require('ti.healthkit');

function window_open() {
    Ti.API.info('Healthkit window open.');

    var isHealthKitEnabled = Ti.App.Properties.getBool("is-healthkit-enabled");
    var sw = $.healthkitView.swHealthKitEnabled;
    sw.value = isHealthKitEnabled;

    sw.addEventListener('change', function (e) {
        Ti.API.info('New switch value: ' + sw.value);
        
        if (sw.value) {
            authoriseHealthKit();
        }
        else {
            Ti.App.Properties.setBool('is-healthkit-enabled', false);
        }
    });
 }

 function authoriseHealthKit() {
    healthkit.authoriseHealthKit(function(response) {
        Ti.API.info(response);
        if (response.success) {
            Ti.App.Properties.setBool('is-healthkit-enabled', true);

            Alloy.createWidget("com.mcongrove.toast", null, {
                text: 'HealthKit enabled successfully.',
                duration: 2000,
                view: $.healthkit,
                theme: "success"
            });		
        }
        else {
            Alloy.createWidget("com.mcongrove.toast", null, {
                text: response.message,
                duration: 2000,
                view: $.healthkit,
                theme: "error"
            });		
        }
    });
 }

 /**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Settings.Integrations.HealthKit
 */
function btnBack_click() {
	$.healthkit.close();
}