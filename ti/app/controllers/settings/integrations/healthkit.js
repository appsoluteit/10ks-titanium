/**
 * @file HealthKit Controller
 * @description The controller for the healthkit view.
 * @namespace Controllers.Settings.Integrations.HealthKit
 */

var healthkit = require('ti.healthkit');
var healthProvider = require('classes/health/HealthProvider');
var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');

var importFromDate;

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

    // If the user has never imported before, wire up events
    if (Ti.App.Properties.getString('lastSyncDate', null) == null) {
        $.healthkitView.vwImportStepsFrom.addEventListener('click', function() {
            var dialog = Ti.UI.createAlertDialog({
                cancel: 1,
                buttonNames: ['OK'],
                message: 'Choose when you would like to import your steps from when this feature is enabled. Note that choosing an older date will take longer to import.',
                title: 'Import steps from'
             });
             dialog.show();
        });
    
        $.healthkitView.pkFirstImportPicker.addEventListener('change', function(event) {
            importFromDate = event.value;
        });
    }

    populateRows();
 }

 function populateRows() {
    var lastSyncDate = Ti.App.Properties.getString('lastSyncDate', null);
    if (lastSyncDate == null) {
        $.healthkitView.lblLastImportDate.text = 'Never';
        $.healthkitView.vwImportStepsFrom.visible = true;
        $.healthkitView.vwFirstImportPicker.visible = true;

        // Set the default first import date to 1 week in the past
        // Set the minimum first import date to 12 weeks (3 months) in the past
        var today = new Date();
        importFromDate = DateTimeHelper.addWeeks(today, -1);;

        $.healthkitView.pkFirstImportPicker.maxDate = today;
        $.healthkitView.pkFirstImportPicker.minDate = DateTimeHelper.addWeeks(today, -12);
        $.healthkitView.pkFirstImportPicker.value = importFromDate;
    }
    else {
        var lastSyncDateDt = new Date(lastSyncDate);
        var lastSyncDateLabel = DateTimeHelper.getDateLabel(lastSyncDateDt);
        var lastSyncTimeLabel = FormatHelper.formatTime(lastSyncDateDt);
    
        $.healthkitView.lblLastImportDate.text = lastSyncDateLabel + ' at ' + lastSyncTimeLabel;
        $.healthkitView.vwImportStepsFrom.visible = false;
        $.healthkitView.vwFirstImportPicker.visible = false;

        importFromDate = lastSyncDateDt;
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

            healthProvider
                .importSteps(importFromDate)
                .then(function() {
                    Alloy.createWidget("com.mcongrove.toast", null, {
                        text: 'HealthKit import was successful.',
                        duration: 2000,
                        view: $.healthkit,
                        theme: "success"
                    }); 

                    populateRows();
                })
                .catch(function(response) {
                    Alloy.createWidget("com.mcongrove.toast", null, {
                        text: response.message,
                        duration: 2000,
                        view: $.healthkit,
                        theme: "error"
                    });
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