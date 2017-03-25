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
			it("Should return March", function() {
				var monthName = DateTimeHelper.getCurrentMonthName();
				expect(monthName).to.equal('March');
			});
		});
	});
}

module.exports.test = test;