/*
 * Note: There is a 1 day difference between the dayOfWeek value saved in the ReminderRepeat
 * property and the result of calling getDay() on a JavaScript object. This difference is due to a one day
 * discrepency between the implementation of getDay() and Appcelerator's Calendar.
 * 
 * JS Dates have Sunday starting at 0, while Appcelerator has them start at 1.
 * 
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
 * http://docs.appcelerator.com/platform/latest/#!/api/daysOfTheWeekDictionary
 */

require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var FormatHelper = require('helpers/FormatHelper');
var ReminderRepeatSetting = require('classes/ReminderRepeatSetting');
var setting = new ReminderRepeatSetting();

function test() {
	describe("ReminderRepeatSetting", function() {
		before(function() {
			Ti.API.debug("Removing Property:", setting.PropertyName);
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
			var year = 2017,	
				month = 1,		//February
				day = 21;		//21st (Tuesday)
				
			it("Should return today", function() {
				//Build
				var startFrom = new Date(year, month, day);
				var startHours = FormatHelper.unformatTime('2:28pm');
				startFrom.setHours( startHours.getHours(), startHours.getMinutes() );
							
				Ti.App.Properties.setString('ReminderTime', '2:30pm');		//reminder cutoff at 2:30pm
				
				var tmpSetting = { name: 'Tuesday', active: true, dayOfWeek: 3};
				setting.set([
					tmpSetting	
				]);
				
				//Run
				var nextReminderDate = setting.getNextReminderDateTime(startFrom);
			
				//Test
				expect(nextReminderDate.getDate()).to.equal(day);					  //Day
				expect(nextReminderDate.getMonth()).to.equal(month);				  //Month
				expect(nextReminderDate.getFullYear()).to.equal(year);			 	  //Year
				expect(nextReminderDate.getHours()).to.equal(14);				      //Hours
				expect(nextReminderDate.getMinutes()).to.equal(30);			          //Minutes
				expect(nextReminderDate.getDay()).to.equal(tmpSetting.dayOfWeek - 1); //Day of the week
			});
			
			it("Should return tomorrow", function() {				
				//Build
				var startFrom = new Date(year, month, day);		
				var startHours = FormatHelper.unformatTime('3:15pm');
				startFrom.setHours( startHours.getHours(), startHours.getMinutes() );
				
				Ti.App.Properties.setString('ReminderTime', '2:30pm');	//reminder cutoff at 2:30pm
				
				var tmpSetting = { name: 'Wednesday', active: true, dayOfWeek: 4 };
				setting.set([
					tmpSetting
				]);		
						
				//Run
				var nextReminderDate = setting.getNextReminderDateTime(startFrom);
								
				//Test
				expect(nextReminderDate.getDate()).to.equal(day + 1);  				  //The next Day
				expect(nextReminderDate.getMonth()).to.equal(month);   				  //Month
				expect(nextReminderDate.getFullYear()).to.equal(year);				  //Year
				expect(nextReminderDate.getHours()).to.equal(14);					  //Hours
				expect(nextReminderDate.getMinutes()).to.equal(30);					  //Minutes
				expect(nextReminderDate.getDay()).to.equal(tmpSetting.dayOfWeek - 1); //Day of the week				
			});
			
			it("Should return yesterday next week", function() {
				//Build
				var startFrom = new Date(year, month, day);
				var startHours = FormatHelper.unformatTime('2:28pm');
				startFrom.setHours( startHours.getHours(), startHours.getMinutes() );
				
				Ti.App.Properties.setString('ReminderTime', '2:30pm');
				
				var tmpSetting = { name: 'Monday', active: true, dayOfWeek: 2 };
				setting.set([
					tmpSetting
				]);
				
				//Run
				var nextReminderDate = setting.getNextReminderDateTime(startFrom);
				
				//Test
				expect(nextReminderDate.getDate()).to.equal(day + 6);  				  //The day before today next week
				expect(nextReminderDate.getMonth()).to.equal(month);   				  //Month
				expect(nextReminderDate.getFullYear()).to.equal(year);				  //Year
				expect(nextReminderDate.getHours()).to.equal(14);					  //Hours
				expect(nextReminderDate.getMinutes()).to.equal(30);					  //Minutes
				expect(nextReminderDate.getDay()).to.equal(tmpSetting.dayOfWeek - 1); //Day of the week					
			});
			
			it("Should return today next week", function() {
				//Build
				var startFrom = new Date(year, month, day);
				var startHours = FormatHelper.unformatTime('2:35pm');
				startFrom.setHours( startHours.getHours(), startHours.getMinutes() );
				
				Ti.App.Properties.setString('ReminderTime', '2:30pm');
				
				var tmpSetting = { name: 'Tuesday', active: true, dayOfWeek: 3 };
				setting.set([
					tmpSetting
				]);
				
				//Run
				var nextReminderDate = setting.getNextReminderDateTime(startFrom);
				
				//Test
				expect(nextReminderDate.getDate()).to.equal(day + 7);  				  //Today next week
				expect(nextReminderDate.getMonth()).to.equal(month);   				  //Month
				expect(nextReminderDate.getFullYear()).to.equal(year);				  //Year
				expect(nextReminderDate.getHours()).to.equal(14);					  //Hours
				expect(nextReminderDate.getMinutes()).to.equal(30);					  //Minutes
				expect(nextReminderDate.getDay()).to.equal(tmpSetting.dayOfWeek - 1); //Day of the week					
			});
		});
		
		describe("Get scheduled reminders until", function() {
			before(function() {
				setting.set([{
					name: 'Sunday', active: true, dayOfWeek: 1	
				}]);
				
				Ti.App.Properties.setString('ReminderTime', '5:30pm');		//reminder cutoff at 5:30pm
			});
			
			it("Should have five", function() {
				var start = new Date(2017, 3, 30);	//Sunday 30th April
				var end = new Date(start.getTime());
				end.setMonth(start.getMonth() + 1);
				
				var reminders = setting.getScheduledRemindersBetween(start, end);
				
				expect(reminders).to.be.an('array');
				expect(reminders.length).to.equal(5); 					//5 sundays between 30/04/17 and 30/05/17
				
				expect(FormatHelper.formatDate(reminders[0]))
					.to.equal(FormatHelper.formatDate(new Date(2017, 3, 30)));	//today (30/04/17)
					
				expect(FormatHelper.formatDate(reminders[1]))
					.to.equal(FormatHelper.formatDate(new Date(2017, 4, 7)));	//(07/05/17)
					
				expect(FormatHelper.formatDate(reminders[2]))
					.to.equal(FormatHelper.formatDate(new Date(2017, 4, 14)));	//(14/05/17)
					
				expect(FormatHelper.formatDate(reminders[3]))
					.to.equal(FormatHelper.formatDate(new Date(2017, 4, 21)));	//(21/05/17)
					
				expect(FormatHelper.formatDate(reminders[4]))
					.to.equal(FormatHelper.formatDate(new Date(2017, 4, 28)));	//(28/05/17)
			});
			 
			//TODO: Add more complex examples with multiple reminder days
		});
		
		describe("Will expire", function() {
			it("Should be false", function() {
				//set reminder expiry date to 01/05/17
				Ti.App.Properties.setString("ReminderExpiryDate", FormatHelper.formatDate(new Date(2017, 4, 1)));
				
				//set buffer to one week
				Alloy.Globals.ReminderExpiryBufferDays = 7;
				
				//set today to 01/04/17
				var today = new Date(2017, 3, 1);
				
				expect(setting.willExpire(today)).to.equal(false);
			});
			
			it("Should be true", function() {
				//set reminder expiry date to 1/05/17
				Ti.App.Properties.setString("ReminderExpiryDate", FormatHelper.formatDate(new Date(2017, 4, 1)));
								
				//set buffer to one week
				Alloy.Globals.ReminderExpiryBufferDays = 7;
								
				//set today to 28/04/17
				var today = new Date(2017, 3, 28);
				
				//expect(setting.willExpire(today)).to.equal(true);
			});
		});
	});
}

module.exports.test = test;