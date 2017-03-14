require('ti-mocha');
mocha.setup( { reporter: 'ti-spec-studio' } );

var alloy = require('alloy');

describe("Testing", function() {
	it("Should fail", function() {
		throw new Error("Bad!");
	});
});

mocha.run();