//Bootstrap the other tests
require('ti-mocha');

var apiHelperTester = require('tests/APIHelperTester');
var authProviderTester = require('tests/AuthProviderTester');
var calendarFactoryTester = require('tests/CalendarFactoryTester');
var dateTimeHelperTester = require('tests/DateTimeHelperTester');
var formatHelperTester = require('tests/FormatHelperTester');
var reminderRepeatSettingTester = require('tests/ReminderRepeatSettingTester');
var stepsDataProviderTester = require('tests/StepsDataProviderTester');

function run() {
	mocha.setup( { reporter: 'ti-spec-studio' } );
	
	var tests = [
		//apiHelperTester,
		//authProviderTester,
		//calendarFactoryTester,
		//dateTimeHelperTester,
		//formatHelperTester,
		//reminderRepeatSettingTester,
		stepsDataProviderTester
	];
	
	tests.forEach(function(testSuite) {
		testSuite.test();
	});
	
	mocha.run();
}

module.exports.run = run;