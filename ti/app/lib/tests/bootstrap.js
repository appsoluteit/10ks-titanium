//Bootstrap the other tests
	require('ti-mocha');
	mocha.setup( { reporter: 'ti-spec-studio' } );
	
	var formatHelperTester = require('tests/FormatHelperTester');
	var dateTimeHelperTester = require('tests/DateTimeHelperTester');
	var reminderRepeatSettingTester = require('tests/ReminderRepeatSettingTester');
	
	var tests = [
		formatHelperTester,
		dateTimeHelperTester,
		reminderRepeatSettingTester
	];
	
	tests.forEach(function(testSuite) {
		testSuite.test();
	});
	
	mocha.run();