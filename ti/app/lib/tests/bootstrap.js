//Bootstrap the other tests
require('ti-mocha');
var formatHelperTester = require('tests/FormatHelperTester');
var dateTimeHelperTester = require('tests/DateTimeHelperTester');
var reminderRepeatSettingTester = require('tests/ReminderRepeatSettingTester');

function run() {
	mocha.setup( { reporter: 'ti-spec-studio' } );
	
	var tests = [
		formatHelperTester,
		dateTimeHelperTester,
		reminderRepeatSettingTester
	];
	
	tests.forEach(function(testSuite) {
		testSuite.test();
	});
	
	mocha.run();
}

module.exports.run = run;