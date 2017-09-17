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
				dataProvider.removeAll();
				
				objIn.stepsDate = new Date(2017, 1, 1);		
				dataProvider.writeSingle(objIn);
				done();
			});
			
			it("Should retrieve a date saved on 1/02/2017", function() {
				dataProvider.load();
				var objOut = dataProvider.readByDate(new Date(2017, 1, 1));
				
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
				//dataProvider.load();
				var arrSteps = dataProvider.readWhereNeedsSyncing();
				
				Ti.API.info(JSON.stringify(arrSteps));
				
				expect(dataProvider.models.length).to.equal(3);
				expect(arrSteps.length).to.equal(2);
				expect(arrSteps[0].stepsTotal).to.equal(objIn1.stepsTotal);
				expect(arrSteps[1].stepsTotal).to.equal(objIn2.stepsTotal);
			});
		});
		
		describe("Read by month for year", function() {			
			var dataProvider = new StepsDataProvider();
			
			before(function(done) {
				dataProvider.removeAll();
				
				dataProvider.writeSingle({
					stepsTotal: 10,
					stepsDate: new Date(2017, 0, 1)
				});
				
				dataProvider.writeSingle({
					stepsTotal: 20,
					stepsDate: new Date(2017, 1, 1)
				});
				
				dataProvider.writeSingle({
					stepsTotal: 15,
					stepsDate: new Date(2017, 2, 1)
				});
				
				dataProvider.writeSingle({
					stepsTotal: 15,
					stepsDate: new Date(2017, 2, 1)
				});
				
				done();
			});
			
			it("Should return 10 for January, 20 for February and 30 for March", function() {
				dataProvider.load();
				var data = dataProvider.readByMonthForYear(2017);
				
				expect(data).to.be.an('array');
				expect(data.length).to.equal(12);
				expect(data[0]).to.equal(10);
				expect(data[1]).to.equal(20);
				expect(data[2]).to.equal(30);
				
				expect(data[3]).to.equal(0);
				expect(data[4]).to.equal(0);
				expect(data[5]).to.equal(0);
				expect(data[6]).to.equal(0);
				expect(data[7]).to.equal(0);
				expect(data[8]).to.equal(0);
				expect(data[9]).to.equal(0);
				expect(data[10]).to.equal(0);
				expect(data[11]).to.equal(0);
			});
		});
		
		describe("Read by day for month", function() {
			var dataProvider = new StepsDataProvider();
			
			before(function(done) {
				dataProvider.removeAll();
				
				dataProvider.writeSingle({
					stepsTotal: 10,
					stepsDate: new Date(2017, 4, 1)
				});
						
				dataProvider.writeSingle({
					stepsTotal: 20,
					stepsDate: new Date(2017, 4, 2)
				});
				
				dataProvider.writeSingle({
					stepsTotal: 15,
					stepsDate: new Date(2017, 4, 3)
				});
				
				dataProvider.writeSingle({
					stepsTotal: 15,
					stepsDate: new Date(2017, 4, 3)
				});
				
				done();
			});
			
			it("Should return 10 on 1/05, 20 on 2/05 and 30 on 3/05", function() {
				dataProvider.load();
				var data = dataProvider.readByDayForMonth(5, 2017);
				//Ti.API.info(data);
				
				expect(data).to.be.an('array');
				expect(data.length).to.equal(31);
				expect(data[0]).to.equal(10);
				expect(data[1]).to.equal(20);
				expect(data[2]).to.equal(30);
				
				for(var i = 3; i < 30; i++) {
					expect(data[i]).to.equal(0);
				}
			});
		});
	
		describe("Read years", function() {
			var dataProvider = new StepsDataProvider();
			
			before(function(done) {
				dataProvider.removeAll();
				
				dataProvider.writeSingle({
					stepsTotal: 10,
					stepsDate: new Date(2017, 4, 1)
				});
						
				dataProvider.writeSingle({
					stepsTotal: 20,
					stepsDate: new Date(2000, 1, 1)
				});
				
				dataProvider.writeSingle({
					stepsTotal: 15,
					stepsDate: new Date(1990, 5, 27)
				});
				
				dataProvider.writeSingle({
					stepsTotal: 15,
					stepsDate: new Date(1981, 9, 19)
				});
				
				done();
			});
			
			it("Should return 2017, 2000, 1981 and 1990", function() {
				//dataProvider.load();
				var years = dataProvider.readYears();	
	
				expect(years.length).to.equal(4);
				expect(years[0]).to.equal(2017);
				expect(years[1]).to.equal(2000);
				expect(years[2]).to.equal(1990);
				expect(years[3]).to.equal(1981);
			});	
		});
		
		describe("Read months and years", function() {
			var dataProvider = new StepsDataProvider();
			
			before(function(done) {
				dataProvider.removeAll();
				
				dataProvider.writeSingle({
					stepsTotal: 10,
					stepsDate: new Date(2017, 4, 1) //1st of May
				});
				
				dataProvider.writeSingle({
					stepsTotal: 20,
					stepsDate: new Date(2000, 5, 2) //2nd of June
				});
				
				dataProvider.writeSingle({
					stepsTotal: 30,
					stepsDate: new Date(1990, 6, 3) //3rd of July
				});
				
				done();
			});
			
			it("Should return 05|2017, 06|2000 and 07|1990", function() {
				var monthYears = dataProvider.readMonthsAndYears();
				
				expect(monthYears).to.be.an('array');
				expect(monthYears.length).to.equal(3);
				expect(monthYears[0].year).to.equal(2017);
				expect(monthYears[0].month).to.equal(4);
			});
		});
		
		describe("Read months for year", function() {
			var dataProvider = new StepsDataProvider();
			
			before(function(done) {
				dataProvider.removeAll();
				
				dataProvider.writeSingle({
					stepsTotal: 10,
					stepsDate: new Date(2017, 4, 1) //1st of May
				});
				
				dataProvider.writeSingle({
					stepsTotal: 20,
					stepsDate: new Date(2000, 5, 2) //2nd of June
				});
				
				dataProvider.writeSingle({
					stepsTotal: 30,
					stepsDate: new Date(1990, 6, 3) //3rd of July
				});
				
				done();
			});
			
			it("Should return 05|2017, 06|2000 and 07|1990", function() {
				var months = dataProvider.readMonthsForYear(2017);
				
				expect(months).to.be.an('array');
				expect(months.length).to.equal(1);
				expect(months[0]).to.equal(4);
			});		
		});
	});
}

module.exports.test = test;