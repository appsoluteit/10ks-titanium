require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var StepsDataProvider = require('classes/StepsDataProvider');

function test() {
	var dataProvider = new StepsDataProvider();
	Ti.API.info("Number of models: " + dataProvider.models.length);
}

module.exports.test = test;