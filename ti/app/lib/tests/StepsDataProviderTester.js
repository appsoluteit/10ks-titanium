require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;

var StepsDataProvider = require('classes/StepsDataProvider');

function getDummy() {
	var jsonModel = {
		stepsDate: new Date(),
		stepsTotal: 1,
		stepsWalked: 2,
		activityPart: 3
	};
	
	return jsonModel;
}

function test() {
	describe("StepsDataProvider", function() {
		describe("Write Single (INSERT)", function() {
			var dataProvider = new StepsDataProvider();
			var model;
			var numModelsBeforeWrite;
			
			before(function(done) {
				numModelsBeforeWrite = dataProvider.models.length;
				model = dataProvider.writeSingle(getDummy());
		
				done();
			});
			
			it("Should have created a valid backbone model", function() {
				expect(model).to.be.an('object');
				expect(model.steps_date).to.be.a('string');
				expect(model.steps_total).to.be.a('number');
				expect(model.steps_walked).to.be.a('number');
				expect(model.activity_part).to.be.a('number');
			});
			
			it("Should have increased the number of models by 1", function() {
				dataProvider.load(); //reload the data
				expect(dataProvider.models.length).to.equal(numModelsBeforeWrite + 1);
			});
		});
		
		describe("Write Single (UPDATE)", function() {
			//TODO
			
		});
		
		describe("Read single", function() {
			var dataProvider = new StepsDataProvider();
			var objIn = getDummy();
			
			before(function(done) {
				objIn.stepsDate = new Date(2017, 1, 1);		
				dataProvider.writeSingle(objIn);
				done();
			});
			
			it("Should retrieve a date saved on 1/02/2017", function() {
				dataProvider.load();
				var objOut = dataProvider.readSingle(new Date(2017, 1, 1));
				
				expect(objOut.stepsWalked).to.equal(objIn.stepsWalked);
				expect(objOut.stepsTotal).to.equal(objIn.stepsTotal);
				expect(objOut.activityPart).to.equal(objIn.activityPart);
			});
		});
		
		describe("Remove all", function() {
			var dataProvider = new StepsDataProvider();
			
			before(function(done) {
				dataProvider.writeSingle(getDummy());
				dataProvider.writeSingle(getDummy());
				dataProvider.writeSingle(getDummy());
				
				dataProvider.removeAll();
				done();
			});
			
			it("Should have removed all models", function() {
				dataProvider.load();
				expect(dataProvider.models.length).to.equal(0);
			});
		});
		
		describe("Read where needs syncing", function() {
			var dataProvider = new StepsDataProvider();
			var objIn1 = getDummy();
			var objIn2 = getDummy();
			var objIn3 = getDummy();
							
			before(function(done) {
				dataProvider.removeAll();

				//Should be present
				objIn1.stepsTotal = 32;
				objIn1.lastSyncedOn = new Date(2017, 1, 1);		//February 1st
				objIn1.lastUpdatedOn = new Date(2017, 1, 2);	//February 2nd
				
				//Should be present
				objIn2.stepsTotal = 64;
				objIn2.lastSyncedOn = new Date(2017, 2, 30);	//March 30th
				objIn2.lastUpdatedOn = new Date(2017, 3, 2);	//April 2nd
				
				//Should not be present
				objIn3.stepsTotal = 128;
				objIn3.lastSyncedOn = new Date(2017, 3, 30);	//April 30th
				objIn3.lastUpdatedOn = new Date(2017, 3, 15);	//April 14th
				
				dataProvider.writeSingle(objIn1);
				dataProvider.writeSingle(objIn2);
				dataProvider.writeSingle(objIn3);
				
				done();
			});
			
			it("Should read 2 records", function() {
				dataProvider.load();
				var arrSteps = dataProvider.readWhereNeedsSyncing();
				
				//Ti.API.info(JSON.stringify(arrSteps));
				
				expect(dataProvider.models.length).to.equal(3);
				expect(arrSteps.length).to.equal(2);
				expect(arrSteps[0].stepsTotal).to.equal(objIn1.stepsTotal);
				expect(arrSteps[1].stepsTotal).to.equal(objIn2.stepsTotal);
			});
		});
	});
}

module.exports.test = test;