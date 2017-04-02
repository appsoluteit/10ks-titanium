require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var ReminderFactory = require('classes/ReminderFactory');
var reminderProvider = ReminderFactory.create();

var ReminderRepeatSetting = require('classes/ReminderRepeatSetting');
var setting = new ReminderRepeatSetting();

function test() {
	describe("ReminderFactory", function() {
		before(function() {
			//Set some defaults for the reminder
			Ti.App.Properties.setString("ReminderLabel", "TestLabel");
			Ti.App.Properties.setString('ReminderTime', '2:30pm');	//reminder cutoff at 2:30pm
			
			var tmpSetting = { name: 'Wednesday', active: true, dayOfWeek: 4 };
			setting.set([
				tmpSetting
			]);	
		});
		
		describe("Add Reminder", function() {
			
		});
		
		describe("Remove Reminder", function() {
			
		});
	});
}

module.exports.test = test;