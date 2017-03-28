require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var ReminderRepeatSetting = require('classes/ReminderRepeatSetting');
var setting = new ReminderRepeatSetting();

function test() {
	describe("ReminderRepeatSetting", function() {
		before(function() {
			Ti.App.Properties.removeProperty(setting.PropertyName);		
		});
		
		describe("Has reminder days", function() {
			it("Should return false", function() {
				expect(setting.isSet()).to.equal(false);
			});
			
			it("Should return true", function() {
				Ti.App.Properties.setString(setting.PropertyName, 'aaa');
				expect(setting.isSet()).to.equal(true);
			});
		});
		
		describe("Set reminder days", function() {
			it("Should save the object", function() {
				var obj = [{name:'Sunday'}];
				setting.set(obj);
				expect(Ti.App.Properties.getString(setting.PropertyName)).to.equal("[{\"name\":\"Sunday\"}]");	
			});		
		});
		
		describe("Get reminder days", function() {
			var obj = [
				{ name: 'Sunday', active: true, dayOfWeek: 1 },
				{ name: 'Monday', active: false, dayOfWeek: 2 },
				{ name: 'Tuesday', active: true, dayOfWeek: 3 },
				{ name: 'Wednesday', active: false, dayOfWeek: 4 },
				{ name: 'Thursday', active: true, dayOfWeek: 5 },
				{ name: 'Friday', active: false, dayOfWeek: 6 },
				{ name: 'Saturday', active: true, dayOfWeek: 7 }
			];
			setting.set(obj);
			
			var activeDays = setting.get();
				
			it("Should have 4 active days", function() {
				expect(activeDays).to.have.lengthOf(4);			
			});
			
			it("Should save Sunday as active", function () {
				expect(activeDays.filter(function(e) { return e.name === 'Sunday'; }))
					.to.not.be.empty;				
			});
			
			it("Should save Monday as inactive", function() {
				expect(activeDays.filter(function(e) { return e.name === 'Monday'; }))
					.to.be.empty;
			});
			
			it("Should save Tueaday as active", function() {
				expect(activeDays.filter(function(e) { return e.name === 'Tuesday'; }))
					.to.not.be.empty;
			});
			
			it("Should save Wednesday as inactive", function() {
				expect(activeDays.filter(function(e) { return e.name === 'Wednesday'; }))
					.to.be.empty;
			});
			
			it("Should save Thursday as active", function() {
				expect(activeDays.filter(function(e) { return e.name === 'Thursday'; }))
					.to.not.be.empty;
			});
			
			it("Should save Friday as inactive", function() {
				expect(activeDays.filter(function(e) { return e.name === 'Friday'; }))
					.to.be.empty;
			});
			
			it("Should save Saturday as active", function() {
				expect(activeDays.filter(function(e) { return e.name === 'Saturday'; }))
					.to.not.be.empty;
			});
		});
	
		describe("Get next reminder date", function() {
			it("Should return today", function() {
				//Build
				var startFrom = new Date(2017, 01, 21, 13, 28);			//start from 21/02/2017 (Tuesday) 1:28pm
				Ti.App.Properties.setString('ReminderTime', '2:30pm');	//reminder cutoff at 2:30pm
				setting.set([
					{ name: 'Tuesday', active: true, dayOfWeek: 3}
				]);
				
				//Run
				var nextReminderDate = setting.getNextReminderDateTime(startFrom);
			
				//Test
				expect(nextReminderDate.getDate()).to.equal(21);		//Day
				expect(nextReminderDate.getMonth()).to.equal(1);		//Month
				expect(nextReminderDate.getFullYear()).to.equal(2017);	//Year
				expect(nextReminderDate.getHours()).to.equal(14);		//Hours
				expect(nextReminderDate.getMinutes()).to.equal(30);		//Minutes
				expect(nextReminderDate.getDay()).to.equal(3);			//Day of the week
			});
			
			it("Should return tomorrow", function() {
				//Build
				var startFrom = new Date(2017, 01, 21, 15, 15);			//start from 21/02/2017 (Tuesday) 3:15pm
				Ti.App.Properties.setString('ReminderTime', '2:30pm');	//reminder cutoff at 2:30pm
				setting.set([
					{ name: 'Wednesday', active: true, dayOfWeek: 4}
				]);		
						
				//Run
				var nextReminderDate = setting.getNextReminderDateTime(startFrom);
								
				//Test
				expect(nextReminderDate.getDate()).to.equal(22);		//Day
				expect(nextReminderDate.getMonth()).to.equal(1);		//Month
				expect(nextReminderDate.getFullYear()).to.equal(2017);	//Year
				expect(nextReminderDate.getHours()).to.equal(14);		//Hours
				expect(nextReminderDate.getMinutes()).to.equal(30);		//Minutes
				expect(nextReminderDate.getDay()).to.equal(4);			//Day of the week				
			});
			
			it("Should return a yesterday next week", function() {
				
			});
			
			it("Should return today next week", function() {
				
			});
		});
	});
}

module.exports.test = test;