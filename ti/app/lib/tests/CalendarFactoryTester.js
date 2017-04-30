require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var CalendarFactory = require('classes/CalendarFactory');
var reminderProvider = CalendarFactory.create();

var ReminderRepeatSetting = require('classes/ReminderRepeatSetting');
var setting = new ReminderRepeatSetting();

function test() {
	describe("CalendarFactory", function() {
		before(function(done) {
			//Set some defaults for the reminder
			Ti.App.Properties.setString("ReminderLabel", "TestLabel");
			Ti.App.Properties.setString('ReminderTime', '2:30pm');	//reminder cutoff at 2:30pm
			
			var tmpSetting = { name: 'Wednesday', active: true, dayOfWeek: 4 };
			setting.set([
				tmpSetting
			]);	
			
			done();
		});
		
		describe("Add Reminder", function() {
			before(function(done) {
				//Requesting permission is a non-blocking operation. Put it in the before callback.
				reminderProvider.requestPermission()
								.then(function success() {
									return reminderProvider.getCalendar();
								}, function fail(reason) {
									Ti.API.error("Permission denied for calendar. Reason = " + reason);
									done();
								})
								.then(function success(selectedCalendar) {
									if(Ti.Platform.osname !== "android") {
										selectedCalendar = Ti.Calendar.defaultCalendar;	
									}
									
									return reminderProvider.add(selectedCalendar);									
								}, function fail(reason) {
									Ti.API.error("Couldn't select calendar. Reason: " + reason);			
									done();						
								})
								.then(function success() {
									done();
								}, function fail(reason) {
									Ti.API.error("Couldn't add reminder. Reason: " + reason);
									done();
								});
			});
			
			it("Should have saved the reminder to properties", function() {
				expect(Ti.App.Properties.getBool("HasReminder")).to.equal(true);
				expect(Ti.App.Properties.getString("ReminderEventID")).to.be.a('string');
			});		
		});
		
		describe("Remove Reminder", function() {
			before(function(done) {
				reminderProvider.requestPermission()
								.then(function success() {
									return reminderProvider.getCalendar();
								}, function fail(reason) {
									Ti.API.error("Permission denied for calendar. Reason = " + reason);
									done();
								})
								.then(function success(selectedCalendar) {
									if(Ti.Platform.osname !== "android") {
										selectedCalendar = Ti.Calendar.defaultCalendar;	
									}
									
									return reminderProvider.remove(selectedCalendar);									
								}, function fail(reason) {
									Ti.API.error("Couldn't select calendar. Reason: " + reason);	
									done();								
								})
								.then(function success() {
									done();
								}, function fail(reason) {
									Ti.API.error("Couldn't add reminder. Reason: " + reason);
									done();
								});
			});
			
			it("Should have removed the reminder data from properties", function() {
				expect(Ti.App.Properties.hasProperty("HasReminder")).to.equal(false);
				expect(Ti.App.Properties.hasProperty("ReminderEventID")).to.equal(false);
			});
		});
	});
}

module.exports.test = test;