//Bootstrap the other tests
	require('ti-mocha');
	mocha.setup( { reporter: 'ti-spec-studio' } );
	
	var formatHelper = require('tests/FormatHelperTester');
	var dateTimeHelper = require('tests/DateTimeHelperTester');
	
	var tests = [
		formatHelper,
		dateTimeHelper
	];
	
	tests.forEach(function(testSuite) {
		testSuite.test();
	});
	
	mocha.run();