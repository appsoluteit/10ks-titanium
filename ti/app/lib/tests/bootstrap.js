//Bootstrap the other tests
require('ti-mocha');

var apiHelperTester = require('tests/APIHelperTester');
var authProviderTester = require('tests/AuthProviderTester');
var dateTimeHelperTester = require('tests/DateTimeHelperTester');
var formatHelperTester = require('tests/FormatHelperTester');
var reminderRepeatSettingTester = require('tests/ReminderRepeatSettingTester');
var reminderFactoryTester = require('tests/ReminderFactoryTester');

function run() {
	mocha.setup( { reporter: 'ti-spec-studio' } );
	
	var tests = [
		apiHelperTester,
		authProviderTester,
		dateTimeHelperTester,
		formatHelperTester,
		reminderRepeatSettingTester,
		reminderFactoryTester
	];
	
	tests.forEach(function(testSuite) {
		testSuite.test();
	});
	
	mocha.run();
}

module.exports.run = run;