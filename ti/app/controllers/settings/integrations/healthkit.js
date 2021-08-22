/**
 * @file HealthKit Controller
 * @description The controller for the healthkit view.
 * @namespace Controllers.Settings.Integrations.HealthKit
 */

var healthkit = require('ti.healthkit');
var healthProvider = require('classes/health/HealthProvider');
var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');

function window_open() {
    Ti.API.info('Healthkit window open.');

    var isHealthKitEnabled = Ti.App.Properties.getString("healthProvider", null) === 'healthkit';
    var sw = $.healthkitView.swHealthKitEnabled;
    sw.value = isHealthKitEnabled;

    sw.addEventListener('change', function () {
        Ti.API.info('New switch value: ' + sw.value);
        
        if (sw.value) {
            authoriseHealthKit();
        }
        else {
            Ti.App.Properties.setString('healthProvider', null);
        }
    });

    $.healthkitView.tblRowEnableHealthKit.addEventListener('click', function() {
        var dialog = Ti.UI.createAlertDialog({
            cancel: 1,
            buttonNames: ['OK'],
            message: 'If this option is enabled, this app will import steps from HealthKit whenever you open the Step Log. You will then have the option the sync the steps to the 10K Steps website.',
            title: 'About HealthKit'
         });
         dialog.show();
    });

    populateRows();
 }

 function populateRows() {
    var lastSyncDate = Ti.App.Properties.getString('lastSyncDate', null);
    if (lastSyncDate == null) {
        $.healthkitView.lblLastImportDate.text = 'Never';
    }
    else {
        Ti.API.info('Last synced on ', lastSyncDate);
        
        var lastSyncDateDt = new Date(lastSyncDate); // this is an ISO-string, so it's okay to init this way

        Ti.API.info('Last synced date', lastSyncDateDt);

        var lastSyncDateLabel = DateTimeHelper.getDateLabel(lastSyncDateDt);
        var lastSyncTimeLabel = FormatHelper.formatTime(lastSyncDateDt);
    
        $.healthkitView.lblLastImportDate.text = lastSyncDateLabel + ' at ' + lastSyncTimeLabel;
    }
 }

 function authoriseHealthKit() {
    healthkit.authoriseHealthKit(function(response) {
        Ti.API.info(response);
        if (response.success) {
            Ti.App.Properties.setString('healthProvider', 'healthkit');

            Alloy.createWidget("com.mcongrove.toast", null, {
                text: 'HealthKit enabled successfully.',
                duration: 2000,
                view: $.healthkit,
                theme: "success"
            });		

            // Since we're not importing any steps from before the feature is enabled, no need to import here. Just save the last sync date as today.
            var now = DateTimeHelper.now();
            Ti.App.Properties.setString('lastSyncDate', now.toISOString());

            populateRows();
            
            // healthProvider
            //     .importSteps()
            //     .then(function() {
            //         Alloy.createWidget("com.mcongrove.toast", null, {
            //             text: 'HealthKit import was successful.',
            //             duration: 2000,
            //             view: $.healthkit,
            //             theme: "success"
            //         }); 

            //         populateRows();
            //     })
            //     .catch(function(response) {
            //         Alloy.createWidget("com.mcongrove.toast", null, {
            //             text: response.message,
            //             duration: 2000,
            //             view: $.healthkit,
            //             theme: "error"
            //         });
            //     });
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