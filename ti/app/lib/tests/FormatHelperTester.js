require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var FormatHelper = require('helpers/FormatHelper');

function test() {
	describe("FormatHelper", function() {
		describe("Format Date", function() {
			it("Should produce 1990-05-27", function() {
				var date = new Date(1990, 4, 27);
				var dateStr = FormatHelper.formatDate(date);
				
				expect(dateStr).to.equal('1990-05-27');
			});
			
			it("Should not throw", function() {
				var date = undefined;
				var dateStr = FormatHelper.formatDate(date);
				
				expect(dateStr).to.equal('');
			});
			
			it("Should not throw", function() {
				var date = new Date();
				var dateStr = FormatHelper.formatDate(date);
				
				expect(dateStr).to.not.be.undefined;
			});
		});	
		
		describe("Format Time", function() {
			it("Should produce 02:56pm", function() {
				var date = new Date(1990, 3, 27, 14, 56);
				var dateStr = FormatHelper.formatTime(date);
				
				expect(dateStr).to.equal('2:56pm');
			});
		});
		
		describe("Unformat Time", function() {
			var timeStr = "1:28pm";
			var time = FormatHelper.unformatTime(timeStr);
			
			it("Should produce 1:28", function() {
				expect(time.getHours()).to.equal(13);
				expect(time.getMinutes()).to.equal(28);
			});
		});
		
		describe("Format number", function() {		
			it("Should produce 12,345", function() {
				var input = 12345;
				var str = FormatHelper.formatNumber(input);
				expect(str).to.equal("12,345");
			});
		});
	});
}

module.exports.test = test;