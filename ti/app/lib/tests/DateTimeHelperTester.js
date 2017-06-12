require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var DateTimeHelper = require('helpers/DateTimeHelper');

function test() {
	describe("DateTimeHelper", function() {
		describe("Get month name from index", function() {
			it("Should return January", function() {
				var monthName = DateTimeHelper.getMonthNameFromIndex(0);
				expect(monthName).to.equal('January');
			});
			
			it("Should return December", function() {
				var monthName = DateTimeHelper.getMonthNameFromIndex(11);
				expect(monthName).to.equal('December');
			});
		});
		
		//We might need to update this unit test every month?
		describe("Get current month name", function() {
			it("Should return May", function() {
				var monthName = DateTimeHelper.getCurrentMonthName();
				expect(monthName).to.equal('June');
			});
		});
		
		describe("Get date label", function() {			
			it("Should be Sun Jan 01", function() {
				var day = new Date(2017, 0, 1);
				var dayString = DateTimeHelper.getDateLabel(day);	
				expect(dayString).to.equal('Sun Jan 01');			
			});
			
			it("Should be Thurs Feb 02", function() {
				var day = new Date(2017, 1, 2);
				var dayString = DateTimeHelper.getDateLabel(day);
				expect(dayString).to.equal('Thurs Feb 02');
			});
		});
		
		describe("Get month label", function() {
			it("Should be May 2017", function() {
				var month = new Date(2017, 4, 1);
				var string = DateTimeHelper.getMonthLabel(month);
				expect(string).to.equal('May 2017');
			});
		});
		
		describe("Get day before", function() {
			it("Should get yesterday", function() {
				var today = new Date(2017, 2, 3);
				var yesterday = DateTimeHelper.getDayBefore(today);
				
				expect(yesterday.getDate()).to.equal(2);
				expect(yesterday.getMonth()).to.equal(2);
				expect(yesterday.getFullYear()).to.equal(2017);
			});
		});
	
		describe("Is valid date", function() {
			it("Should return true", function() {
				var date1 = new Date();
				var date2 = new Date(2012, 1, 2);
				
				expect(DateTimeHelper.isValidDate(date1)).to.equal(true);
				expect(DateTimeHelper.isValidDate(date2)).to.equal(true);
			});
			
			it("Should return false", function() {
				var test1 = undefined;
				var test2 = null;
				var test3 = '';
				var test4 = 0;
				
				expect(DateTimeHelper.isValidDate(test1)).to.equal(false);
				expect(DateTimeHelper.isValidDate(test2)).to.equal(false);
				expect(DateTimeHelper.isValidDate(test3)).to.equal(false);
				expect(DateTimeHelper.isValidDate(test4)).to.equal(false);
			});
		});
	});
}

module.exports.test = test;