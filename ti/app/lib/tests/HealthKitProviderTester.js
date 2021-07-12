require('ti-mocha');

var chai = require('chai');
var expect = chai.expect;
var provider = require('classes/health/HealthProvider');

function setup() {
    console.log('Setting up....');

    // Set the provider to test, so it'll use static test data
    Ti.App.Properties.setString("healthProvider", "test");
    Ti.App.Properties.setString('lastSyncDate', null); // remove the last sync date

    // Clear any existing local steps
    //Alloy.Globals.Steps.removeAll();

    // Write some dummy steps to local storage
    // This simulates a condition where:
    // 1. User imported from HealthKit
    // 2. User uploaded steps to server
    // 3. User re-installed app (or got a new phone)
    // 4. User synced steps from server (so their originally imported steps are now in local storage)
    // 5. User is ready to import again (repeating step 1)

    console.log('Adding single step...');

    Alloy.Globals.Steps.writeSingle({
        stepsWalked: 999,
        stepsTotal: 999,
        stepsDate: new Date(2021, 8, 11),

        activityPart: 0,
        vigorousMins: 0,
        moderateMins: 0,
        lastSyncedOn: null,
        lastUpdatedOn: null
    });
}

function test() {
    describe('Health provider steps import', function() {
        describe('Importing steps should overwrite previous value', function() {
            before(function(done) {
                setup();	

                provider
                    .importSteps()
                    .then(function() {
                        console.log('Import from health provider finished.');
                        done();
                    });
            });

            it('should match the expected steps number', function() {
                var record = Alloy.Globals.Steps.readByDate(new Date(2021, 8, 11));

                console.log('Got record', record);

                expect(record, '1').to.be.an('object');
                expect(record.eventDate, '2').to.be.a('string');
                expect(record.stepsDate, '3').to.equal('2021-07-11');
                expect(record.stepsTotal, '4').to.be.a('number');
                expect(record.stepsTotal, '5').to.equal(1234);
            });
        });
    });
}

module.exports.test = test;