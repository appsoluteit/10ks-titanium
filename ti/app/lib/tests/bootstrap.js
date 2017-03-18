//Bootstrap the other tests
	require('ti-mocha');
	mocha.setup( { reporter: 'ti-spec-studio' } );
	
	var formatHelper = require('tests/FormatHelpertester');
	formatHelper.test();
	
	mocha.run();